import { Contract, providers } from "ethers"
import { Interface } from "ethers/lib/utils"
import { useCallback } from "react"
import LIMIT_FARMING_ABI from '../abis/finite-farming.json'
import { FINITE_FARMING_ADDRESS, INFINITE_FARMING_ADDRESS } from "../constants/addresses"
import { useActiveWeb3React } from "./web3"
import { log } from "util"

export function useLimitFarming() {

    const { chainId, account } = useActiveWeb3React()

    const provider = window.ethereum ? new providers.Web3Provider(window.ethereum) : undefined

    const limitFarmingInteface = new Interface(LIMIT_FARMING_ABI)

    const limitFarmingContract = new Contract(FINITE_FARMING_ADDRESS[chainId], limitFarmingInteface, provider.getSigner())


    const detachFarming = useCallback(async (rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp) => {

        if (!account || !provider) return

        console.log(rewardAddress, bonusRewardAddress, pool.id, startTimestamp, endTimestamp)

        await limitFarmingContract.detachIncentive([rewardAddress, bonusRewardAddress, pool.id, startTimestamp, endTimestamp])

    }, [provider, account])

    const attachFarming = useCallback(async (rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp) => {

        if (!account || !provider) return

        await limitFarmingContract.attachIncentive([rewardAddress, bonusRewardAddress, pool.id, startTimestamp, endTimestamp])

    }, [provider, account])

    const changeRate = useCallback(async (rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp, rewardRate, bonusRewardRate, newRate, rewardType) => {

        if (!account || !provider) return

        if (rewardType === 'main') {
            await limitFarmingContract.setRates([rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp], newRate, bonusRewardRate)
        } else {
            await limitFarmingContract.setRates([rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp], rewardRate, newRate)
        }

    }, [provider, account])

    const addRewards = useCallback(async (rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp, rewardAmount, bonusRewardAmount, newAmount, rewardType) => {

        if (!account || !provider) return

        if (rewardType === 'main') {
            await limitFarmingContract.addRewards([rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp], newAmount, 0)
        } else {
            await limitFarmingContract.addRewards([rewardAddress, bonusRewardAddress, pool, startTimestamp, endTimestamp], 0, newAmount)
        }

    }, [])

    const claimRewards = useCallback(async (rewardAddress, bonusRewardAddress, poolAddress, startTime, endTime, reward, bonusReward) => {

        if (!account || !provider) return

        await limitFarmingContract.decreaseRewardsAmount(
            [rewardAddress, bonusRewardAddress, poolAddress, startTime, endTime],
            reward,
            bonusReward
        )

    }, [account, limitFarmingInteface, provider])

    return {
        attachFarming,
        detachFarming,
        changeRate,
        addRewards,
        claimRewards
    }
}