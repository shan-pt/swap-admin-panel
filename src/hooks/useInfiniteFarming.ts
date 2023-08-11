import { Contract, providers } from "ethers"
import { Interface } from "ethers/lib/utils"
import { useCallback } from "react"
import INFINITE_FARMING_ABI from '../abis/infinite-farming.json'
import { INFINITE_FARMING_ADDRESS } from "../constants/addresses"
import { useActiveWeb3React } from "./web3"

export function useInfiniteFarming() {

    const { chainId, account } = useActiveWeb3React();

    const provider = window.ethereum ? new providers.Web3Provider(window.ethereum) : undefined

    const infiniteFarmingInteface = new Interface(INFINITE_FARMING_ABI)

    const infiniteFarmingContract = new Contract(INFINITE_FARMING_ADDRESS[chainId], infiniteFarmingInteface, provider.getSigner())

    const detachFarming = useCallback(async (rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp) => {

        if (!account || !provider) return

        await infiniteFarmingContract.deactivateIncentive([rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp])

    }, [provider, account])

    const attachFarming = useCallback(async (rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp) => {

        if (!account || !provider) return

        await infiniteFarmingContract.attachIncentive([rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp])

    }, [provider, account])

    const changeRate = useCallback(async (rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp, rewardRate, bonusRewardRate, newRate, rewardType) => {

        if (!account || !provider) return

        if (rewardType === 'main') {
            await infiniteFarmingContract.setRates([rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp], newRate, bonusRewardRate)
        } else {
            await infiniteFarmingContract.setRates([rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp], rewardRate, newRate)
        }

    }, [provider, account])

    const addRewards = useCallback(async (rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp, rewardAmount, bonusRewardAmount, newAmount, rewardType) => {

        if (!account || !provider) return

        if (rewardType === 'main') {
            await infiniteFarmingContract.addRewards([rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp], newAmount, 0)
        } else {
            await infiniteFarmingContract.addRewards([rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp], 0, newAmount)
        }

    }, [])

    const removeRewards = useCallback(async (rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp, rewardAmount, bonusRewardAmount, newAmount, rewardType) => {

        if (!account || !provider) return

        if (rewardType === 'main') {
            await infiniteFarmingContract.decreaseRewardsAmount([rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp], newAmount, 0)
        } else {
            await infiniteFarmingContract.decreaseRewardsAmount([rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp], 0, newAmount)
        }

    }, [])

    return {
        attachFarming,
        detachFarming,
        changeRate,
        addRewards,
        removeRewards
    }
}