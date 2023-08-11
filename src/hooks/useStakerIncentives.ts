import { useCallback, useState } from "react"
import { providers } from 'ethers'
import { useActiveWeb3React } from "./web3"
import { INFINITE_FARMING_ADDRESS, FINITE_FARMING_ADDRESS } from "../constants/addresses"
import INFINITE_FARMING_ABI from 'abis/infinite-farming.json'
import FINITE_FARMING_ABI from 'abis/finite-farming.json'
import { Interface, parseUnits } from "ethers/lib/utils"
import { calculateGasMargin } from "../utils/calculateGasMargin"
import { useTransactionAdder } from "../state/transactions/hooks"
import { Tiers } from "../pages/Staking/CreateIncentive"

const EVENT_ADDER = 10_000

export function useStakerIncentives({
    low,
    rewardAddress,
    poolAddress,
    startTime,
    endTime,
    tierLimits,
    lockedToken,
    tierMultipliers,
    reward,
    bonusRewardAddress,
    bonusReward,
    enterStartTime,
    isTierFarming,
    minimalRange
}: {
    low: any,
    rewardAddress: string
    reward: string
    poolAddress: string
    startTime: number
    endTime: number
    lockedToken: any
    tierLimits: Tiers
    tierMultipliers: Tiers
    bonusRewardAddress: string
    bonusReward: string
    enterStartTime: number
    isTierFarming: boolean
    minimalRange: string
}) {

    const { chainId, account, library } = useActiveWeb3React();

    const addTransaction = useTransactionAdder()
    const [createdHash, setCreatedHash] = useState(null)

    const _w: any = window
    const provider = new providers.Web3Provider(_w.ethereum)
    const signer = provider.getSigner()

    const stakerInterface = new Interface(FINITE_FARMING_ABI)

    const createIncentiveTx = useCallback(async () => {
        if (!chainId || !rewardAddress || !poolAddress || !startTime || !endTime || !account || !reward) return null

        setCreatedHash('pending')

        try {

            let calldata;

            if (!isTierFarming) {

                calldata = stakerInterface.encodeFunctionData('createLimitFarming', [
                    [rewardAddress, bonusRewardAddress, poolAddress, startTime, endTime],
                    {
                        tokenAmountForTier1: 0,
                        tokenAmountForTier2: 0,
                        tokenAmountForTier3: 0,
                        tier1Multiplier: EVENT_ADDER,
                        tier2Multiplier: EVENT_ADDER,
                        tier3Multiplier: EVENT_ADDER
                    },
                    {
                        reward,
                        bonusReward,
                        minimalPositionWidth: minimalRange || 0,
                        multiplierToken: '0x0000000000000000000000000000000000000000',
                        enterStartTime,
                    }
                ])

            } else {
                const lockedDecimals = lockedToken.wrapped.decimals

                const tierLevels = {
                    tokenAmountForTier1: parseUnits(tierLimits.low, lockedDecimals).toString(),
                    tokenAmountForTier2: parseUnits(tierLimits.medium, lockedDecimals).toString(),
                    tokenAmountForTier3: parseUnits(tierLimits.high, lockedDecimals).toString(),
                    tier1Multiplier: (+tierMultipliers.low * 100) + EVENT_ADDER,
                    tier2Multiplier: (+tierMultipliers.medium * 100) + EVENT_ADDER,
                    tier3Multiplier: (+tierMultipliers.high * 100) + EVENT_ADDER
                }

                const params = {
                    reward,
                    bonusReward,
                    minimalPositionWidth: minimalRange || 0,
                    multiplierToken: lockedToken.wrapped.address,
                    enterStartTime
                }

                calldata = stakerInterface.encodeFunctionData('createLimitFarming', [
                    [rewardAddress, bonusRewardAddress, poolAddress, startTime, endTime],
                    tierLevels,
                    params
                ])

            }

            const txn: { to: string; data: string } = {
                to: FINITE_FARMING_ADDRESS[chainId],
                data: calldata
            }

            library
                .getSigner()
                .estimateGas(txn)
                .then((estimate) => {
                    const newTxn = {
                        ...txn,
                        gasLimit: calculateGasMargin(chainId, estimate),
                    }
                    return library
                        .getSigner()
                        .sendTransaction(newTxn)
                        .then((response) => {
                            addTransaction(response, {
                                summary: `Created incentive`
                            })
                            setCreatedHash(response.hash)

                        })
                        .catch(err => {
                            setCreatedHash('failed')
                            console.error(err)
                        })
                })
                .catch(err => {
                    setCreatedHash('failed')
                    console.error(err)
                })

        } catch (e) {
            setCreatedHash('failed')
            console.error(e)
        }

        // setCreated(true)

    }, [account,
        rewardAddress,
        poolAddress,
        startTime,
        endTime,
        tierLimits,
        lockedToken,
        tierMultipliers,
        reward,
        bonusRewardAddress,
        bonusReward,
        enterStartTime,
        isTierFarming
    ])


    return {
        createIncentiveTx,
        createdHash
    }
}

export function useInfiniteFarmingIncentives({
    poolAddress,
    rewardAddress,
    reward,
    rewardRate,
    bonusRewardAddress = '0x0000000000000000000000000000000000000000',
    bonusReward = '0',
    bonusRewardRate = '0',
    lockedToken,
    tierMultipliers,
    tierLimits,
    isTierFarming,
    minimalRange
}: {
    rewardAddress: string
    reward: string
    poolAddress: string
    bonusRewardAddress: string
    bonusReward: string
    rewardRate: string
    bonusRewardRate: string
    lockedToken: any
    tierLimits: Tiers
    tierMultipliers: Tiers
    isTierFarming: boolean
    minimalRange: string
}) {


    // console.log(lockedToken)
    const { chainId, account, library } = useActiveWeb3React();

    const addTransaction = useTransactionAdder()
    const [createdHash, setCreatedHash] = useState(null)

    const _w: any = window
    const provider = new providers.Web3Provider(_w.ethereum)
    const signer = provider.getSigner()

    const farmingCenterInterface = new Interface(INFINITE_FARMING_ABI)


    const createIncentiveTx = useCallback(async () => {
        if (!chainId || !rewardAddress || !poolAddress || !rewardRate || !account || !reward) return null

        setCreatedHash('pending')

        try {

            let calldata;

            console.log([rewardAddress, bonusRewardAddress, poolAddress, Math.round(Date.now() / 1000) + 20000, 4104559500],
                {
                    reward,
                    bonusReward,
                    rewardRate,
                    bonusRewardRate,
                    minimalPositionWidth: minimalRange || 0,
                    multiplierToken: '0x0000000000000000000000000000000000000000'
                },
                {
                    tokenAmountForTier1: 0,
                    tokenAmountForTier2: 0,
                    tokenAmountForTier3: 0,
                    tier1Multiplier: EVENT_ADDER,
                    tier2Multiplier: EVENT_ADDER,
                    tier3Multiplier: EVENT_ADDER
                })

            if (!isTierFarming) {
                calldata = farmingCenterInterface.encodeFunctionData('createEternalFarming', [
                    [rewardAddress, bonusRewardAddress, poolAddress, Math.round(Date.now() / 1000) + 20000, 4104559500],
                    {
                        reward,
                        bonusReward,
                        rewardRate,
                        bonusRewardRate,
                        minimalPositionWidth: minimalRange || 0,
                        multiplierToken: '0x0000000000000000000000000000000000000000'
                    },
                    {
                        tokenAmountForTier1: 0,
                        tokenAmountForTier2: 0,
                        tokenAmountForTier3: 0,
                        tier1Multiplier: EVENT_ADDER,
                        tier2Multiplier: EVENT_ADDER,
                        tier3Multiplier: EVENT_ADDER
                    }
                ])
            } else {

                const lockedDecimals = lockedToken.wrapped.decimals

                const tierLevels = {
                    tokenAmountForTier1: parseUnits(tierLimits.low, lockedDecimals).toString(),
                    tokenAmountForTier2: parseUnits(tierLimits.medium, lockedDecimals).toString(),
                    tokenAmountForTier3: parseUnits(tierLimits.high, lockedDecimals).toString(),
                    tier1Multiplier: (+tierMultipliers.low * 100) + EVENT_ADDER,
                    tier2Multiplier: (+tierMultipliers.medium * 100) + EVENT_ADDER,
                    tier3Multiplier: (+tierMultipliers.high * 100) + EVENT_ADDER
                }

                const params = {
                    reward,
                    bonusReward,
                    rewardRate,
                    bonusRewardRate,
                    minimalPositionWidth: minimalRange || 0,
                    multiplierToken: lockedToken.wrapped.address
                }

                calldata = farmingCenterInterface.encodeFunctionData('createEternalFarming', [
                    [rewardAddress, bonusRewardAddress, poolAddress, Math.round(Date.now() / 1000) + 20000, 4104559500],
                    params,
                    tierLevels
                ])

            }

            const txn: { to: string; data: string } = {
                to: INFINITE_FARMING_ADDRESS[chainId],
                data: calldata
            }

            console.log('calldata', calldata)

            library
                .getSigner()
                .estimateGas(txn)
                .then((estimate) => {
                    const newTxn = {
                        ...txn,
                        gasLimit: calculateGasMargin(chainId, estimate),
                    }
                    return library
                        .getSigner()
                        .sendTransaction(newTxn)
                        .then((response) => {
                            addTransaction(response, {
                                summary: `Created incentive`
                            })
                            setCreatedHash(response.hash)

                        })
                        .catch(err => {
                            setCreatedHash('failed')
                            console.error(err)
                        })
                })
                .catch(err => {
                    setCreatedHash('failed')
                    console.error(err)
                })

        } catch (e) {
            setCreatedHash('failed')
            console.error(e)
        }

        // setCreated(true)

    }, [account,
        rewardAddress,
        poolAddress,
        reward,
        bonusRewardAddress,
        bonusReward,
        rewardRate,
        bonusRewardRate,
        lockedToken,
        tierMultipliers,
        tierLimits,
        isTierFarming])


    return {
        createIncentiveTx,
        createdHash
    }
}