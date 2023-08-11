import { Trans } from '@lingui/macro'
import { Currency } from '@uniswap/v3-core'
import { computePoolAddress } from '../../hooks/computePoolAddress'
import { useActiveWeb3React } from '../../hooks/web3'
import { POOL_DEPLOYER_ADDRESS } from '../../constants/addresses'
import { useInfiniteFarmingIncentives } from '../../hooks/useStakerIncentives'

import { useAllTransactions } from '../../state/transactions/hooks'
import { useEffect, useMemo } from 'react'
import Loader from '../../components/Loader'
import { useHistory } from 'react-router-dom'

import { parseUnits } from 'ethers/lib/utils'

export function CreateInfiniteFarming({
  currencyA,
  currencyB,
  tokenRewardAddress,
  reward,
  bonusRewardAddress,
  bonusReward,
  rewardRate,
  bonusRewardRate,
  minimalRange,
}: {
  currencyA: Currency
  currencyB: Currency
  tokenRewardAddress: Currency
  reward: string
  bonusRewardAddress: Currency
  bonusReward: string
  rewardRate: string
  bonusRewardRate: string
  minimalRange: string
}) {
  const { account, chainId } = useActiveWeb3React()

  const poolDeployerAddress = chainId && POOL_DEPLOYER_ADDRESS[chainId]

  const poolAddress = computePoolAddress({
    poolDeployer: poolDeployerAddress,
    tokenA: currencyA.wrapped,
    tokenB: currencyB.wrapped,
  })

  const _reward = parseUnits(reward.toString(), tokenRewardAddress.wrapped.decimals).toString()
  const _bonusReward = bonusRewardAddress
    ? parseUnits(bonusReward.toString(), bonusRewardAddress.wrapped.decimals).toString()
    : '0'
  const _rewardRate = parseUnits(rewardRate.toString(), tokenRewardAddress.wrapped.decimals).toString()
  const _bonusRewardRate = bonusRewardAddress
    ? parseUnits(bonusRewardRate.toString(), bonusRewardAddress.wrapped.decimals).toString()
    : '0'

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs
      .filter((tx) => new Date().getTime() - tx.addedTime < 86_400_000)
      .sort((a, b) => b.addedTime - a.addedTime)
  }, [allTransactions])

  const confirmed = useMemo(
    () => sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash),
    [sortedRecentTransactions, allTransactions]
  )

  const { createIncentiveTx, createdHash } = useInfiniteFarmingIncentives({
    rewardAddress: tokenRewardAddress?.wrapped?.address,
    bonusRewardAddress: bonusRewardAddress?.wrapped?.address,
    poolAddress,
    reward: _reward,
    bonusReward: _bonusReward,
    rewardRate: _rewardRate,
    bonusRewardRate: _bonusRewardRate,
    minimalRange,
  })

  const history = useHistory()

  useEffect(() => {
    if (!createdHash) return

    if (createdHash === 'failed') {
      //   toggleDisabled()
    } else if (confirmed?.includes(createdHash)) {
      history.push('/farming/future-events')
    }
  }, [createdHash, confirmed])

  return (
    <>
      <button
        onClick={() => {
          if (!createdHash || createdHash === 'failed') {
            createIncentiveTx()
          }
        }}
        style={{
          width: '100%',
          height: '2.8rem',
          background: '#601FB3',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontFamily: 'Inter',
        }}
      >
        {createdHash && confirmed.includes(createdHash) ? (
          <Trans>Created!</Trans>
        ) : createdHash && !confirmed.includes(createdHash) && createdHash !== 'failed' ? (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Loader
              style={{
                display: 'block',
              }}
              stroke={'white'}
            />
            <span
              style={{
                marginLeft: '10px',
              }}
            >
              Creating
            </span>
          </span>
        ) : (
          <Trans>Create incentive</Trans>
        )}
      </button>
    </>
  )
}
