import { useState } from "react";
import { BigNumber, Contract, providers } from "ethers";
import { useActiveWeb3React } from "../web3";
import { useClients } from "./useClients";
import { FETCH_POOL, FETCH_TOKEN, INFINITE_EVENTS, POOLS_FROM_ADDRESSES, TOKENS_FROM_ADDRESSES, TOP_POOLS, TOP_TOKENS } from "../../utils/graphql-queries";
import { useBlocksFromTimestamps } from '../blocks'
import { useEthPrices } from '../useEthPrices'
import { useDeltaTimestamps } from "../../utils/queries";
import { formatTokenName, formatTokenSymbol, get2DayChange, getPercentChange } from "../../utils/info";
import VirualPoolABI from 'abis/virtual-pool.json'

function parseTokensData(tokenData: any) {
    return tokenData ? tokenData.reduce((accum: { [address: string]: any }, poolData: any) => {
        accum[poolData.id] = poolData
        return accum
    }, {})
        : {}
}

export function useInfoSubgraph() {

    const { chainId, account } = useActiveWeb3React()

    const { dataClient, farmingClient } = useClients()

    const [t24, t48, tWeek] = useDeltaTimestamps()

    const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48, tWeek])
    const [block24, block48, blockWeek] = blocks ?? []

    const ethPrices = useEthPrices()

    const [infiniteFarmings, setInfiniteFarmings] = useState<any[] | null>(null);
    const [infiniteFarmingsLoading, setInfiniteFarmingsLoading] = useState<boolean>(false)

    const [poolsResult, setPools] = useState<any[] | null>(null);
    const [poolsLoading, setPoolsLoading] = useState<boolean>(false);

    const [tokensResult, setTokens] = useState<any[] | null>(null);
    const [tokensLoading, setTokensLoading] = useState<boolean>(false);

    const provider = window.ethereum ? new providers.Web3Provider(window.ethereum) : undefined

    async function fetchToken(tokenId: string, farming = false) {

        try {

            const { data: { tokens }, error } = (await (farming ? farmingClient : dataClient).query({
                query: FETCH_TOKEN(tokenId)
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            return tokens[0]

        } catch (err) {
            throw new Error('Fetch token ' + err)
        }
    }

    async function fetchPool(poolId: string) {
        try {
            const { data: { pools }, error } = (await dataClient.query({
                query: FETCH_POOL(),
                variables: { poolId }
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            return pools[0]

        } catch (err) {
            throw new Error('Fetch pools ' + err)
        }
    }

    async function getEvents(events: any[]) {

        const _events = []

        for (let i = 0; i < events.length; i++) {

            const pool = await fetchPool(events[i].pool)
            const rewardToken = await fetchToken(events[i].rewardToken, true)
            const bonusRewardToken = await fetchToken(events[i].bonusRewardToken, true)
            const lockedToken = await fetchToken(events[i].multiplierToken, true)

            const _event: any = {
                ...events[i],
                pool,
                rewardToken,
                bonusRewardToken,
                lockedToken,
                reward: events[i].reward,
                bonusReward: events[i].bonusReward
            }

            _events.push({ ..._event })
        }

        return _events

    }

    async function fetchInfiniteFarmings() {

        if (!chainId || !account) return

        if (!provider) throw new Error('No provider')

        setInfiniteFarmings(null)
        setInfiniteFarmingsLoading(true)


        try {

            const { data: { eternalFarmings }, error: error } = await farmingClient.query({
                query: INFINITE_EVENTS,
            })

            if (error) throw new Error(`${error.name} ${error.message}`)

            if (eternalFarmings.length === 0) {
                setInfiniteFarmings([])
                return
            }

            let _eternalFarmings: any[] = []

            for (const farming of eternalFarmings) {

                const virtualPoolContract = new Contract(
                    farming.virtualPool,
                    VirualPoolABI,
                    provider.getSigner()
                )

                const { reserve0: reward, reserve1: bonusReward } = await virtualPoolContract.rewardReserves()

                const rewardToken = await fetchToken(farming.rewardToken, true)
                const bonusRewardToken = await fetchToken(farming.bonusRewardToken, true)

                _eternalFarmings = [
                    ..._eternalFarmings,
                    {
                        ...farming,
                        rewardToken,
                        bonusRewardToken,
                        reward: reward.toString(),
                        bonusReward: bonusReward.toString(),
                        rewardLeftFor: BigNumber.from(reward).div(Number(farming.rewardRate) ? farming.rewardRate : 1).div(60).toString(),
                        bonusRewardLeftFor: BigNumber.from(bonusReward).div(Number(farming.bonusRewardRate) ? farming.bonusRewardRate : 1).div(60).toString()
                    }
                ]

            }

            setInfiniteFarmings(_eternalFarmings)

        } catch (err) {
            console.error('Eternal farmings', err);
            setInfiniteFarmings(null)
        }

        setInfiniteFarmingsLoading(false)
    }

    async function fetchInfoPools(reload?: boolean) {

        if (!blocks || blockError || !ethPrices) return

        try {
            setPoolsLoading(true)

            const { data: { pools: topPools }, error } = (await dataClient.query({
                query: TOP_POOLS,
                fetchPolicy: reload ? 'network-only' : 'cache-first'
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            if (!provider) throw new Error('No provider')

            const { data: { pools }, error: _error } = await dataClient.query({
                query: POOLS_FROM_ADDRESSES(undefined, topPools.map((el: any) => el.id)),
                fetchPolicy: reload ? 'network-only' : 'cache-first'
            })

            if (_error) throw new Error(`${_error.name} ${_error.message}`)

            setPools(pools)

        } catch (err) {
            console.error('Info pools fetch', err)
            setPools(null)
        }

        setPoolsLoading(false)
    }

    async function fetchInfoTokens(reload?: boolean) {

        if (!blocks || blockError || !ethPrices) return

        try {
            setTokensLoading(true)

            const { data: { tokens: topTokens }, error } = (await dataClient.query({
                query: TOP_TOKENS,
                fetchPolicy: reload ? 'network-only' : 'cache-first'
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            if (!provider) throw new Error('No provider')

            const tokenAddresses = topTokens.map((el: any) => el.id)

            const { data: { tokens }, error: _error } = await dataClient.query({
                query: TOKENS_FROM_ADDRESSES(undefined, tokenAddresses),
                fetchPolicy: reload ? 'network-only' : 'cache-first'
            })

            if (_error) throw new Error(`${_error.name} ${_error.message}`)

            const tokens24 = await fetchTokensByTime(block24.number, tokenAddresses)
            const tokens48 = await fetchTokensByTime(block48.number, tokenAddresses)
            const tokensWeek = await fetchTokensByTime(blockWeek.number, tokenAddresses)

            const parsedTokens = parseTokensData(tokens)
            const parsedTokens24 = parseTokensData(tokens24)
            const parsedTokens48 = parseTokensData(tokens48)
            const parsedTokensWeek = parseTokensData(tokensWeek)

            const formatted = tokenAddresses.reduce((accum: { [address: string]: any }, address: any) => {
                const current: any | undefined = parsedTokens[address]
                const oneDay: any | undefined = parsedTokens24[address]
                const twoDay: any | undefined = parsedTokens48[address]
                const week: any | undefined = parsedTokensWeek[address]

                const [volumeUSD, volumeUSDChange] =
                    current && oneDay && twoDay
                        ? get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD)
                        : current
                            ? [parseFloat(current.volumeUSD), 0]
                            : [0, 0]

                const volumeUSDWeek =
                    current && week
                        ? parseFloat(current.volumeUSD) - parseFloat(week.volumeUSD)
                        : current
                            ? parseFloat(current.volumeUSD)
                            : 0
                const tvlUSD = current ? parseFloat(current.totalValueLockedUSD) : 0
                const tvlUSDChange = getPercentChange(current?.totalValueLockedUSD, oneDay?.totalValueLockedUSD)
                const tvlToken = current ? parseFloat(current.totalValueLocked) : 0
                const priceUSD = current ? parseFloat(current.derivedETH) * ethPrices.current : 0
                const priceUSDOneDay = oneDay ? parseFloat(oneDay.derivedETH) * ethPrices.oneDay : 0
                const priceUSDWeek = week ? parseFloat(week.derivedETH) * ethPrices.week : 0
                const priceUSDChange =
                    priceUSD && priceUSDOneDay ? getPercentChange(priceUSD.toString(), priceUSDOneDay.toString()) : 0
                const priceUSDChangeWeek =
                    priceUSD && priceUSDWeek ? getPercentChange(priceUSD.toString(), priceUSDWeek.toString()) : 0
                const txCount =
                    current && oneDay
                        ? parseFloat(current.txCount) - parseFloat(oneDay.txCount)
                        : current
                            ? parseFloat(current.txCount)
                            : 0
                const feesUSD =
                    current && oneDay
                        ? parseFloat(current.feesUSD) - parseFloat(oneDay.feesUSD)
                        : current
                            ? parseFloat(current.feesUSD)
                            : 0

                accum[address] = {
                    exists: !!current,
                    address,
                    name: current ? formatTokenName(address, current.name) : '',
                    symbol: current ? formatTokenSymbol(address, current.symbol) : '',
                    volumeUSD,
                    volumeUSDChange,
                    volumeUSDWeek,
                    txCount,
                    tvlUSD,
                    feesUSD,
                    tvlUSDChange,
                    tvlToken,
                    priceUSD,
                    priceUSDChange,
                    priceUSDChangeWeek,
                }

                return accum
            }, {})

            setTokens(Object.values(formatted))

        } catch (err) {
            console.error('Info tokens fetch', err)
            setTokens(null)
        }

        setTokensLoading(false)
    }

    async function fetchTokensByTime(blockNumber: number, tokenAddresses: any[]) {

        try {

            const { data: { tokens }, error: error } = await dataClient.query({
                query: TOKENS_FROM_ADDRESSES(blockNumber, tokenAddresses),
            })

            if (error) throw new Error(`${error.name} ${error.message}`)

            return tokens

        } catch (err) {
            console.error('Tokens by time fetch', err);
            return undefined
        }

    }

    return {
        blocksFetched: blockError ? false : !!ethPrices && !!blocks,
        fetchInfoPools: { poolsResult, poolsLoading, fetchInfoPoolsFn: fetchInfoPools },
        fetchInfoTokens: { tokensResult, tokensLoading, fetchInfoTokensFn: fetchInfoTokens },
        fetchInfiniteFarmings: { infiniteFarmings, infiniteFarmingsLoading, fetchInfiniteFarmingsFn: fetchInfiniteFarmings },
        fetchPool
    }

}