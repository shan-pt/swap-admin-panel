import { useCallback, useMemo, useState } from 'react'
import { useEffect } from 'react'
import { Frown } from 'react-feather'
import styled, { keyframes, css } from 'styled-components/macro'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useAllTransactions } from '../../state/transactions/hooks'
import { stringToColour } from '../../utils/stringToColour'
import Loader from '../Loader'
import { PageTitle } from '../PageTitle'

const skeletonAnimation = keyframes`
  100% {
    transform: translateX(100%);
  }
`

const skeletonGradient = css`
  position: relative;
  overflow: hidden;
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(91, 105, 141, 0) 0,
      rgba(91, 105, 141, 0.2) 25%,
      rgba(91, 105, 141, 0.5) 60%,
      rgba(91, 105, 141, 0)
    );
    animation-name: ${skeletonAnimation};
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    content: '';
  }
`

const Stakes = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  // height: 450px;
  overflow-y: auto;
  overflow-x: hidden;
`

const TokenIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  background-color: ${({ name }) => (name ? stringToColour(name).background : '#3d4a6a')};
  border: 1px solid ${({ name }) => (name ? stringToColour(name).border : '#3d4a6a')};
  color: ${({ name }) => (name ? stringToColour(name).text : '#3d4a6a')};
  border-radius: 50%;

  ${({ skeleton }) => (skeleton ? skeletonGradient : null)}

  &:nth-of-type(2) {
    margin-left: -8px;
  }
`
const Stake = styled.div`
  display: flex;
  padding: 8px 0;
  margin-bottom: 16px;
  font-family: Montserrat;
  width: 100%;
  // background: #202635;

  & > * {
    &:not(:last-of-type) {
      max-width: calc(100% / 6);
      min-width: calc(100% / 6);
    }
  }
`
const StakeId = styled.div`
  display: flex;
  align-items: center;
  min-width: 96px !important;
`

const StakePool = styled.div`
  display: flex;
`
const StakeSeparator = styled.div`
  display: flex;
  align-items: center;
  color: #878d9d;
  font-size: 14px;
  font-style: italic;
  margin: 0 1rem;
`

const StakeReward = styled.div`
  display: flex;

  & > ${TokenIcon} {
    // margin-right: 16px;
  }
`

const StakeCountdown = styled.div`
  font-size: 16px;
  margin: auto;

  max-width: 170px !important;
  min-width: 170px !important;

  & > * {
    ${({ skeleton }) =>
      skeleton
        ? css`
            width: 80px;
            height: 16px;
            background: #3d4a6a;
            border-radius: 4px;

            ${skeletonGradient}
          `
        : null}
  }
`

const StakeActions = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

const StakeButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  background-color: ${({ skeleton }) => (skeleton ? '#3d4a6a' : '#4829bb')};
  color: white;
  min-width: 184px;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.4;
      cursor: default;
    `}

  ${({ skeleton }) =>
    skeleton
      ? css`
          ${skeletonGradient}
          width: 80px;
        `
      : null}
`

const StakeListHeader = styled.div`
  display: flex;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #202635;
  & > * {
    max-width: calc(100% / 6);
    min-width: calc(100% / 6);
    font-weight: 500;
    color: #ababab;
  }
`

const TokensNames = styled.div`
  margin-left: 1rem;
  & > * {
    ${({ skeleton }) =>
      skeleton
        ? css`
            width: 40px;
            height: 16px;
            background: #3d4a6a;
            margin-bottom: 3px;
            border-radius: 4px;
            ${skeletonGradient}
          `
        : null}
  }
`

const EmptyMock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;

  & > * {
    margin-bottom: 1rem;
  }
`

export function StakerMyStakes({
  data,
  refreshing,
  now,
  fetchHandler,
}: {
  data: any
  refreshing: boolean
  now: number
  fetchHandler: () => any
}) {
  const { getRewardsHandler, getRewardsHash, withdrawHandler, withdrawnHash } = useStakerHandlers() || {}

  const [gettingReward, setGettingReward] = useState({ id: null, state: null })
  const [unstaking, setUnstaking] = useState({ id: null, state: null })

  const [shallowPositions, setShallowPositions] = useState(null)

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

  useEffect(() => {
    setShallowPositions(data)
  }, [data])

  const stakedNFTs = useMemo(() => {
    if (!shallowPositions) return
    const _positions = shallowPositions.filter((pos) => pos.stakedInIncentive && pos.transfered)
    return _positions.length > 0 ? _positions : undefined
  }, [shallowPositions])

  const inactiveNFTs = useMemo(() => {
    if (!shallowPositions) return
    const _positions = shallowPositions.filter((pos) => !pos.stakedInIncentive && pos.transfered)
    return _positions.length > 0 ? _positions : undefined
  }, [shallowPositions])

  useEffect(() => {
    if (!gettingReward.state) return

    if (getRewardsHash === 'failed') {
      setGettingReward({ id: null, state: null })
    } else if (getRewardsHash && confirmed.includes(getRewardsHash.hash)) {
      setGettingReward({ id: getRewardsHash.id, state: 'done' })
      setShallowPositions(
        shallowPositions.map((el) => {
          if (el.tokenId === getRewardsHash.id) {
            el.stakedInIncentive = false
          }
          return el
        })
      )
    }
  }, [getRewardsHash, confirmed])

  useEffect(() => {
    if (!unstaking.state) return

    if (withdrawnHash === 'failed') {
      setUnstaking({ id: null, state: null })
    } else if (withdrawnHash && confirmed.includes(withdrawnHash.hash)) {
      setUnstaking({ id: withdrawnHash.id, state: 'done' })
      setShallowPositions(
        shallowPositions.map((el) => {
          if (el.tokenId === withdrawnHash.id) {
            el.transfered = false
          }
          return el
        })
      )
    }
  }, [withdrawnHash, confirmed])

  useEffect(() => {
    fetchHandler()
  }, [])

  function getCountdownTime(time) {
    const timestamp = (time * 1000 - now) / 1000
    const days = Math.floor(timestamp / (24 * 60 * 60))
    const hours = Math.floor(timestamp / (60 * 60)) % 24
    const minutes = Math.floor(timestamp / 60) % 60
    const seconds = Math.floor(timestamp / 1) % 60

    function format(digit: number) {
      return digit < 10 ? `0${digit}` : digit
    }

    return `${days > 0 ? `${days}d ` : ''}${format(hours)}:${format(minutes)}:${format(seconds)}`
  }

  function formatReward(earned) {
    const _earned = String(earned)
    return _earned.length > 8 ? `${_earned.slice(0, 8)}..` : _earned
  }

  function getTable(positions, staked: boolean) {
    return positions.map((el, i) => (
      <Stake key={i}>
        <StakeId>{el.tokenId}</StakeId>
        <StakePool>
          {/* {JSON.parse(el.pool)} */}
          <TokenIcon name={el.pool.token0.symbol}>{el.pool.token0.symbol.slice(0, 2)}</TokenIcon>
          <TokenIcon name={el.pool.token1.symbol}>{el.pool.token1.symbol.slice(0, 2)}</TokenIcon>
          <TokensNames>
            <div>{el.pool.token0.symbol}</div>
            <div>{el.pool.token1.symbol}</div>
          </TokensNames>
        </StakePool>
        {/* <StakeSeparator>for</StakeSeparator> */}
        {staked && (
          <StakeReward>
            <TokenIcon name={el.rewardToken.symbol}>{el.rewardToken.symbol.slice(0, 2)}</TokenIcon>
            <TokensNames>
              <div>{formatReward(el.earned)}</div>
              <div>{el.rewardToken.symbol}</div>
            </TokensNames>
          </StakeReward>
        )}
        {staked && (
          <StakeReward>
            <TokenIcon name={el.bonusRewardToken}>{el.bonusRewardToken.symbol.slice(0, 2)}</TokenIcon>
            <TokensNames>
              <div>{formatReward(el.bonusEarned)}</div>
              <div>{el.bonusRewardToken.symbol}</div>
            </TokensNames>
          </StakeReward>
        )}
        {/* <StakeSeparator>by</StakeSeparator> */}
        {staked && (
          <StakeCountdown>
            {el.ended || el.endTime * 1000 < Date.now() ? 'Finished' : getCountdownTime(el.endTime)}
          </StakeCountdown>
        )}
        <StakeActions>
          {staked ? (
            el.endTime * 1000 > Date.now() ? (
              <div style={{ lineHeight: '39px' }}>{`Can't get rewards till end`}</div>
            ) : (
              staked && (
                <StakeButton
                  disabled={gettingReward.id && gettingReward.state !== 'done'}
                  onClick={() => {
                    setGettingReward({ id: el.tokenId, state: 'pending' })
                    getRewardsHandler(el.tokenId, { ...el })
                  }}
                >
                  {gettingReward && gettingReward.id === el.tokenId && gettingReward.state !== 'done' ? (
                    <span>
                      <Loader size={'18px'} stroke={'white'} style={{ margin: 'auto' }} />
                    </span>
                  ) : (
                    <span>{`Collect reward`}</span>
                  )}
                </StakeButton>
              )
            )
          ) : (
            <StakeButton
              disabled={unstaking.id && unstaking.state !== 'done'}
              onClick={() => {
                setUnstaking({ id: el.tokenId, state: 'pending' })
                withdrawHandler(el.tokenId, { ...el })
              }}
            >
              {unstaking && unstaking.id === el.tokenId && unstaking.state !== 'done' ? (
                <span>
                  <Loader size={'18px'} stroke={'white'} style={{ margin: 'auto' }} />
                </span>
              ) : (
                <span>{`Withdraw NFT`}</span>
              )}
            </StakeButton>
          )}
        </StakeActions>
      </Stake>
    ))
  }

  return (
    <>
      {refreshing || !shallowPositions ? (
        <Stakes>
          {[0, 1, 2].map((el, i) => (
            <Stake key={i}>
              <StakePool>
                {/* {JSON.parse(el.pool)} */}
                <TokenIcon skeleton></TokenIcon>
                <TokenIcon skeleton></TokenIcon>
                <TokensNames skeleton>
                  <div>{}</div>
                  <div>{}</div>
                </TokensNames>
              </StakePool>
              {/* <StakeSeparator>for</StakeSeparator> */}
              <StakeReward>
                <TokenIcon skeleton>{}</TokenIcon>
                <TokensNames skeleton>
                  <div>{}</div>
                  <div>{}</div>
                </TokensNames>
              </StakeReward>
              {/* <StakeSeparator>by</StakeSeparator> */}
              <StakeCountdown skeleton>
                <div></div>
              </StakeCountdown>
              <StakeActions>
                <StakeButton skeleton></StakeButton>
              </StakeActions>
            </Stake>
          ))}
        </Stakes>
      ) : shallowPositions && shallowPositions.length === 0 ? (
        <EmptyMock>
          <div>No farms</div>
          <Frown size={35} stroke={'white'} />
        </EmptyMock>
      ) : shallowPositions && shallowPositions.length !== 0 ? (
        <>
          {stakedNFTs && (
            <>
              <StakeListHeader>
                <div style={{ minWidth: '96px' }}>ID</div>
                <div>Pool</div>
                <div>Earned</div>
                <div>Bonus</div>
                <div>End time</div>
                <div></div>
              </StakeListHeader>
              <Stakes>{getTable(stakedNFTs, true)}</Stakes>
            </>
          )}
          {inactiveNFTs && (
            <>
              <PageTitle title={'Inactive NFT-s'}></PageTitle>
              <StakeListHeader>
                <div style={{ minWidth: '96px' }}>ID</div>
                <div>Pool</div>
                <div></div>
                <div></div>
                <div></div>
              </StakeListHeader>
              <Stakes>{getTable(inactiveNFTs, false)}</Stakes>
            </>
          )}
        </>
      ) : null}
    </>
  )
}
