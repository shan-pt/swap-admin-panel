import styled from 'styled-components/macro'
import copy from 'copy-to-clipboard'
import { useState, useEffect } from 'react'
import { parseUnits } from 'ethers/lib/utils'
import { ADDRESS_ZERO } from '@uniswap/v3-sdk'
import { usePool } from '../../hooks/usePools'
import { useInfoSubgraph } from '../../hooks/subgraph/useInfoSubgraph'

const List = styled.div`
  display: grid;
  gap: 2rem;
  margin: 0;
  padding: 0;
  grid-template-columns: repeat(3, 1fr);
`

const ListHeader = styled.div<{ items: number }>`
  display: flex;

  & > span {
    min-width: ${({ items }) => `calc(100%/${items})`};
  }
`

const ListItem = styled.li`
  padding: 1rem;
  background-color: #25282f;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  & > span {
    display: flex;
    margin-bottom: 1rem;

    & > span {
      &:first-of-type {
        margin-right: auto;
        font-weight: 600;
      }
    }
  }
`
const Button = styled.button`
  border: none;
  border-radius: 6px;
  color: white;
  padding: 6px 8px;
`

const DetachButton = styled(Button)`
  background-color: red;
`
const CopyButton = styled(Button)`
  background-color: #36f;
  margin-left: 1rem;
`

const EditButton = styled(Button)`
  background-color: #36f;
  margin-left: 1rem;

  &:disabled {
    background-color: darkblue;
    cursor: not-allowed;
  }
`

const EditInput = styled.input`
  max-width: 100px;
`

function trim(str: string) {
  if (str.length <= 5) return str

  return str.slice(0, 5) + '...'
}

function InfiniteFarmingItem({
  item: {
    id,
    pool,
    reward,
    bonusReward,
    rewardToken,
    bonusRewardToken,
    rewardRate,
    bonusRewardRate,
    enterStartTime,
    startTime,
    endTime,
    isDetached,
    rewardLeftFor,
    bonusRewardLeftFor,
    minRangeLength,
  },
  detachCallback,
  attachCallback,
  changeRateCallback,
  addRewardsCallback,
  claimRewards,
  type,
}: {
  item: any
  detachCallback: any
  attachCallback: any
  changeRateCallback: any
  addRewardsCallback: any
  claimRewards: any
  type: any
}) {
  const [rewardEditToggled, setRewardRateToggled] = useState(false)
  const [bonusRewardEditToggled, setBonusRewardRateToggled] = useState(false)
  const [addRewardsToggled, setAddRewardsToggled] = useState(false)
  const [addBonusRewardsToggled, setAddBonusRewardsToggled] = useState(false)
  const [removeRewardsToggled, setRemoveRewardsToggled] = useState(false)
  const [removeBonusRewardsToggled, setRemoveBonusRewardsToggled] = useState(false)

  const [_rewardRate, setRewardRate] = useState('')
  const [_bonusRewardRate, setBonusRewardRate] = useState('')
  const [_rewardAmount, setRewardAmount] = useState('')
  const [_bonusRewardAmount, setBonusRewardAmount] = useState('')
  const [_removedRewardAmount, setRemovedRewardAmount] = useState('')
  const [_removedBonusRewardAmount, setRemovedBonusRewardAmount] = useState('')

  const [_name, setName] = useState('')

  const { fetchPool } = useInfoSubgraph()

  useEffect(() => {
    fetchPool(pool.id || pool).then((pool) => {
      if (pool && pool.token0 && pool.token1) {
        setName(`${pool.token0.symbol} / ${pool.token1.symbol}`)
      }
    })
  }, [pool])

  return (
    <ListItem>
      <span>
        <span>Name:</span>
        <span>{_name}</span>
      </span>
      <span>
        <span>ID:</span>
        <span>{trim(id)}</span>
        <CopyButton onClick={() => copy(id)}>Copy</CopyButton>
      </span>
      <span>
        <span>Pool ID:</span>
        <span>{trim(pool.id || pool)}</span>
        <CopyButton onClick={() => copy(pool)}>Copy</CopyButton>
      </span>
      <span>
        <span>Reward: </span>
        {!addRewardsToggled && !removeRewardsToggled ? (
          <>
            <span>{`${(+reward / Math.pow(10, +rewardToken.decimals)).toPrecision(5)} ${rewardToken.symbol}`}</span>
            <EditButton
              disabled={isDetached || rewardToken.id === ADDRESS_ZERO}
              onClick={() => setAddRewardsToggled(!addRewardsToggled)}
            >
              Add
            </EditButton>
            <EditButton
              disabled={rewardToken.id === ADDRESS_ZERO}
              onClick={() => setRemoveRewardsToggled(!removeRewardsToggled)}
            >
              Remove
            </EditButton>
          </>
        ) : (
          <>
            <EditInput
              autoFocus
              onChange={(v) =>
                addRewardsToggled ? setRewardAmount(v.target.value) : setRemovedRewardAmount(v.target.value)
              }
              value={addRewardsToggled ? _rewardAmount : _removedRewardAmount}
            ></EditInput>
            <EditButton
              onClick={() => {
                if (addRewardsToggled) {
                  addRewardsCallback(
                    rewardToken.id,
                    bonusRewardToken.id,
                    pool.id || pool,
                    startTime,
                    endTime,
                    reward,
                    bonusReward,
                    parseUnits(_rewardAmount, rewardToken.decimals),
                    'main'
                  )
                } else {
                  claimRewards(
                    rewardToken.id,
                    bonusRewardToken.id,
                    pool.id || pool,
                    startTime,
                    endTime,
                    reward,
                    bonusReward,
                    parseUnits(_removedRewardAmount, rewardToken.decimals),
                    'main'
                  )
                }
                setAddRewardsToggled(false)
                setRemoveRewardsToggled(false)
              }}
            >
              Save
            </EditButton>
            <EditButton
              onClick={() => {
                setAddRewardsToggled(false)
                setRemoveRewardsToggled(false)
              }}
            >
              X
            </EditButton>
          </>
        )}
      </span>
      <span>
        <span>Reward Rate: </span>
        {!rewardEditToggled ? (
          <>
            <span>{rewardRate ? rewardRate / Math.pow(10, rewardToken.decimals) : 0}</span>
            <EditButton
              disabled={isDetached || rewardToken.id === ADDRESS_ZERO}
              onClick={() => setRewardRateToggled(!rewardEditToggled)}
            >
              Edit
            </EditButton>{' '}
          </>
        ) : (
          <>
            <EditInput autoFocus onChange={(v) => setRewardRate(v.target.value)} value={_rewardRate}></EditInput>
            <EditButton
              onClick={() => {
                changeRateCallback(
                  rewardToken.id,
                  bonusRewardToken.id,
                  pool.id || pool,
                  startTime,
                  endTime,
                  rewardRate,
                  bonusRewardRate,
                  parseUnits(_rewardRate, rewardToken.decimals),
                  'main'
                )
                setRewardRateToggled(!rewardEditToggled)
              }}
            >
              Save
            </EditButton>
            <EditButton onClick={() => setRewardRateToggled(!rewardEditToggled)}>X</EditButton>
          </>
        )}
      </span>
      <span>
        <span>Reward left for: </span>
        <span>{rewardLeftFor + ' min'}</span>
      </span>
      <span>
        <span>Bonus Reward: </span>
        {!addBonusRewardsToggled && !removeBonusRewardsToggled ? (
          <>
            {bonusRewardToken.id !== ADDRESS_ZERO ? (
              <span>{`${(bonusReward / Math.pow(10, bonusRewardToken.decimals)).toPrecision(5)} ${
                bonusRewardToken.symbol
              }`}</span>
            ) : (
              <span>-</span>
            )}
            <EditButton
              disabled={isDetached || bonusRewardToken.id === ADDRESS_ZERO}
              onClick={() => setAddBonusRewardsToggled(!addBonusRewardsToggled)}
            >
              Add
            </EditButton>
            <EditButton
              disabled={bonusRewardToken.id === ADDRESS_ZERO}
              onClick={() => setRemoveBonusRewardsToggled(!removeBonusRewardsToggled)}
            >
              Remove
            </EditButton>
          </>
        ) : (
          <>
            <EditInput
              autoFocus
              onChange={(v) =>
                addBonusRewardsToggled
                  ? setBonusRewardAmount(v.target.value)
                  : setRemovedBonusRewardAmount(v.target.value)
              }
              value={addBonusRewardsToggled ? _bonusRewardAmount : _removedBonusRewardAmount}
            ></EditInput>
            <EditButton
              onClick={() => {
                if (addBonusRewardsToggled) {
                  addRewardsCallback(
                    rewardToken.id,
                    bonusRewardToken.id,
                    pool.id || pool,
                    startTime,
                    endTime,
                    reward,
                    bonusReward,
                    parseUnits(_bonusRewardAmount, bonusRewardToken.decimals),
                    'bonus'
                  )
                } else {
                  claimRewards(
                    rewardToken.id,
                    bonusRewardToken.id,
                    pool.id || pool,
                    startTime,
                    endTime,
                    reward,
                    bonusReward,
                    parseUnits(_removedBonusRewardAmount, bonusRewardToken.decimals),
                    'bonus'
                  )
                }
                setAddBonusRewardsToggled(false)
                setRemoveBonusRewardsToggled(false)
              }}
            >
              Save
            </EditButton>
            <EditButton
              onClick={() => {
                setAddBonusRewardsToggled(false)
                setRemoveBonusRewardsToggled(false)
              }}
            >
              X
            </EditButton>
          </>
        )}
      </span>
      <span>
        <span>Bonus Reward Rate: </span>
        {!bonusRewardEditToggled ? (
          <>
            {bonusRewardToken.id !== ADDRESS_ZERO ? (
              <span>{bonusRewardRate ? bonusRewardRate / Math.pow(10, bonusRewardToken.decimals) : 0}</span>
            ) : (
              <span>-</span>
            )}
            <EditButton
              disabled={isDetached || bonusRewardToken.id === ADDRESS_ZERO}
              onClick={() => setBonusRewardRateToggled(!bonusRewardEditToggled)}
            >
              Edit
            </EditButton>{' '}
          </>
        ) : (
          <>
            <EditInput
              autoFocus
              onChange={(v) => setBonusRewardRate(v.target.value)}
              value={_bonusRewardRate}
            ></EditInput>
            <EditButton
              onClick={() => {
                changeRateCallback(
                  rewardToken.id,
                  bonusRewardToken.id,
                  pool.id || pool,
                  startTime,
                  endTime,
                  rewardRate,
                  bonusRewardRate,
                  parseUnits(_bonusRewardRate, bonusRewardToken.decimals),
                  'bonus'
                )
                setBonusRewardRateToggled(!bonusRewardEditToggled)
              }}
            >
              Save
            </EditButton>{' '}
            <EditButton onClick={() => setBonusRewardRateToggled(!bonusRewardEditToggled)}>X</EditButton>
          </>
        )}
      </span>
      <span style={{ fontSize: '15px' }}>
        <span>Bonus Reward left for: </span>
        <span>{bonusRewardLeftFor + ' min'}</span>
      </span>
      <span>
        <span>Min range: </span>
        <span>{minRangeLength || '0'}</span>
      </span>
      <span>
        {!isDetached ? (
          <DetachButton onClick={() => detachCallback(rewardToken.id, bonusRewardToken.id, pool, startTime, endTime)}>
            Detach
          </DetachButton>
        ) : (
          <span style={{ color: 'red' }}>Deactivated</span>
        )}
      </span>
    </ListItem>
  )
}

export function InfiniteFarmingsList({
  list,
  loading,
  detachCallback,
  attachCallback,
  changeRateCallback,
  addRewardsCallback,
  claimRewards,
  type,
  items,
}: {
  list: any[] | null
  loading: boolean
  detachCallback: any
  attachCallback: any
  changeRateCallback: any
  addRewardsCallback: any
  claimRewards: any
  type: any
  items: number
}) {
  return !list || loading ? (
    <span>Loading</span>
  ) : (
    <>
      <List>
        {list.map((item, i) => (
          <InfiniteFarmingItem
            key={i}
            item={item}
            attachCallback={attachCallback}
            detachCallback={detachCallback}
            changeRateCallback={changeRateCallback}
            addRewardsCallback={addRewardsCallback}
            claimRewards={claimRewards}
            type={type}
          />
        ))}
      </List>
    </>
  )
}
