import styled from 'styled-components/macro'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import { Trans } from '@lingui/macro'
import { RouteComponentProps } from 'react-router-dom'
import { CurrencyDropdown } from './styled'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useActiveWeb3React } from '../../hooks/web3'
import { Currency } from '@uniswap/sdk-core'
import { currencyId } from '../../utils/currencyId'
import { WETH9_EXTENDED } from '../../constants/tokens'
import { useV3MintState, useV3MintActionHandlers, useV3DerivedMintInfo } from 'state/mint/v3/hooks'
import { useV3PositionFromTokenId } from 'hooks/useV3Positions'
import { useDerivedPositionInfo } from 'hooks/useDerivedPositionInfo'
import { BigNumber } from 'ethers'
import { useCurrency } from '../../hooks/Tokens'
import { Field } from '../../state/mint/v3/actions'
import { useIncentiveHandlers } from '../../state/staking/hooks'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { INFINITE_FARMING_ADDRESS } from '../../constants/addresses'
import Loader from '../../components/Loader'
import { useWalletModalToggle } from '../../state/application/hooks'
import { CreateInfiniteFarming } from './CreateInfiniteFarming'
import { stringToColour } from '../../utils/stringToColour'
import Toggle from '../../components/Toggle'

const PageWrapper = styled(AutoColumn)`
  max-width: 902px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 500px;
  `};
`

const MainContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 100%;
  `}
`

const Input = styled.input`
  margin-right: 1rem;
  background-color: #c4c4c445;
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 16px;
  padding-left: 1rem;
  margin-top: 1rem;
  width: 50%;
  margin-top: 0;
  height: 40px;
`

const PairWrapper = styled.div`
  display: flex;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    `}
`

const PairToken = styled.div`
  width: 50%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-bottom: 1rem;
    width: 100%;
  `}
`

const PairSelectorWrapper = styled.div`
  display: flex;
  margin-top: 1rem;
  padding-right: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    padding-right: unset;
    & > ${CurrencyDropdown} {
      width: 100%;
      &:first-of-type {
        margin-bottom: 1rem;
      }
    }
  `}
`

const RewardToken = styled.div`
  width: 50%;
  opacity: ${({ active }) => (active ? '1' : '0.4')};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `}
`

const RewardInput = styled.div`
  display: flex;
  margin-top: 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
      flex-direction: column;

      & > ${Input} {
        width: 100%;
        margin-bottom: 1rem;
      }

      & > ${CurrencyDropdown} {
        width: 100%;
      }
  `}
`

const SummaryWrapper = styled.div`
  background-color: rgba(132, 132, 132, 0.14);
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  align-items: unset;
`}
`

const TokenLogo = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 1rem;
`

const TimeInput = styled(Input)`
  padding-left: 10px;
  margin-right: 7px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100% !important;

  &:last-of-type {
    margin-right: 0;
  }
  `}
`

const TimeWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
        flex-direction: column;
      `}
`

const TimeWrapperPart = styled.div`
  width: 50%;

  &:first-of-type {
    margin-right: 0.5rem;
  }

  &:last-of-type {
    margin-left: 0.5rem;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 100%;

      &:last-of-type {
        margin-left: 0;
        margin-top: 1rem;
      }
  `}
`

const TimeWrapperPartButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  `}
`

const TimeInputsWrapper = styled.div`
  padding: 1rem;
  display: flex;
  background-color: rgba(132, 132, 132, 0.14);
  border: 1px solid ${({ error }) => (error ? 'red' : 'rgba(132, 132, 132, 0.14)')};
  border-radius: 10px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`

const TimeInputsWrapperInner = styled.div`
  margin-right: 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-right: 0;
  margin-bottom: 1rem;
  `}
`

const SummaryPool = styled.div`
  display: flex;
  align-items: center;
  margin-right: 2rem;
  min-width: 150px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-bottom: 1rem;
`}
`

export function NewInfiniteFarming({
  match: {
    params: { currencyIdA, currencyIdB, rewardTokenId, bonusRewardTokenId, tokenId, lockedTokenId },
  },
  history,
  location,
}: RouteComponentProps<{
  currencyIdA?: string
  currencyIdB?: string
  rewardTokenId?: string
  bonusRewardTokenId: string
  tokenId?: string
  lockedTokenId?: string
}>) {
  const { chainId, account } = useActiveWeb3React()

  // check for existing position if tokenId in url
  const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(
    tokenId ? BigNumber.from(tokenId) : undefined
  )
  const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails)

  // Extract query parameters from URL
  const urlParams = new URLSearchParams(location.search)
  const rewardFromUrl = urlParams.get('reward') || ''
  const rateFromUrl = urlParams.get('rate') || ''

  const [reward, setReward] = useState(rewardFromUrl)
  const [bonusReward, setBonusReward] = useState('')
  const [rewardRate, setRewardRate] = useState(rateFromUrl)
  const [bonusRewardRate, setBonusRewardRate] = useState('')

  const [minimalRange, setMinimalRange] = useState('')

  const feeAmount = 500

  const baseCurrency = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const tokenCurrency = useCurrency(rewardTokenId)
  const bonusRewardCurrency = useCurrency(bonusRewardTokenId)
  // prevent an error if they input ETH/WETH
  //TODO
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB

  // mint state
  const { independentField, typedValue, startPriceTypedValue } = useV3MintState()

  const { dependentField, parsedAmounts, noLiquidity, currencies, errorCode } = useV3DerivedMintInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    existingPosition,
    tokenCurrency ?? undefined,
    reward,
    bonusRewardCurrency ?? undefined,
    bonusReward
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const { onFieldAInput, onFieldBInput, onRewardTokenInput, onBonusRewardTokenInput } =
    useV3MintActionHandlers(noLiquidity)

  const { onRewardInput, onBonusRewardInput, onRewardRateInput, onBonusRewardRateInput } = useIncentiveHandlers()

  const toggleWalletModal = useWalletModalToggle()

  // Initialize form values from URL parameters
  useEffect(() => {
    if (rewardFromUrl) {
      onRewardInput(rewardFromUrl)
    }
    if (rateFromUrl) {
      onRewardRateInput(rateFromUrl)
    }
  }, [rewardFromUrl, rateFromUrl, onRewardInput, onRewardRateInput])

  const [approvalReward, approveRewardCallback] = useApproveCallback(
    parsedAmounts[Field.REWARD_TOKEN],
    chainId ? INFINITE_FARMING_ADDRESS[chainId] : undefined
  )

  const [approvalBonusReward, approveBonusRewardCallback] = useApproveCallback(
    parsedAmounts[Field.BONUS_REWARD_TOKEN],
    chainId ? INFINITE_FARMING_ADDRESS[chainId] : undefined
  )

  const [hasBonusReward, toggleHasBonusReward] = useState(true)

  const showRewardApproval = approvalReward !== ApprovalState.APPROVED && !!parsedAmounts[Field.REWARD_TOKEN]
  const showBonusRewardApproval =
    approvalBonusReward !== ApprovalState.APPROVED && !!parsedAmounts[Field.BONUS_REWARD_TOKEN]

  const [showErrors, setShowErrors] = useState(null)

  useEffect(() => {
    if (!errorCode) {
      setShowErrors(null)
    }
  }, [errorCode])

  const handleRewardTokenSelect = useCallback(
    (token: Currency) => {
      const tokenNew = currencyId(token, chainId)
      history.push(`/infinite-farming/create-event/${currencyIdA}/${currencyIdB}/${tokenNew}`)
    },
    [currencyIdA, currencyIdB, chainId]
  )

  const handleBonusRewardTokenSelect = useCallback(
    (token: Currency) => {
      const bonusReward = currencyId(token, chainId)
      history.push(`/infinite-farming/create-event/${currencyIdA}/${currencyIdB}/${rewardTokenId}/${bonusReward}`)
    },
    [currencyIdA, currencyIdB, rewardTokenId, chainId]
  )

  const handleCurrencySelect = useCallback(
    (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
      const currencyIdNew = currencyId(currencyNew, chainId)

      let chainSymbol

      if (chainId === 0x64) {
        chainSymbol = 'XDAI'
      }

      if (currencyIdNew === currencyIdOther) {
        // not ideal, but for now clobber the other if the currency ids are equal
        return [currencyIdNew, undefined]
      } else {
        // prevent weth + eth
        const isETHOrWETHNew =
          currencyIdNew === chainSymbol || (chainId !== undefined && currencyIdNew === WETH9_EXTENDED[chainId]?.address)
        const isETHOrWETHOther =
          currencyIdOther !== undefined &&
          (currencyIdOther === chainSymbol ||
            (chainId !== undefined && currencyIdOther === WETH9_EXTENDED[chainId]?.address))

        if (isETHOrWETHNew && isETHOrWETHOther) {
          return [currencyIdNew, undefined]
        } else {
          return [currencyIdNew, currencyIdOther]
        }
      }
    },
    [chainId]
  )

  const handleCurrencyASelect = useCallback(
    (currencyANew: Currency) => {
      const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB)
      if (idB === undefined) {
        history.push(`/infinite-farming/create-event/${idA}${rewardTokenId ? '/' + rewardTokenId : ''}`)
      } else {
        history.push(`/infinite-farming/create-event/${idA}/${idB}${rewardTokenId ? '/' + rewardTokenId : ''}`)
      }
    },
    [handleCurrencySelect, currencyIdB, history]
  )

  const handleCurrencyBSelect = useCallback(
    (currencyBNew: Currency) => {
      const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA)
      if (idA === undefined) {
        history.push(`/infinite-farming/create-event/${idB}${rewardTokenId ? '/' + rewardTokenId : ''}`)
      } else {
        history.push(`/infinite-farming/create-event/${idA}/${idB}${rewardTokenId ? '/' + rewardTokenId : ''}`)
      }
    },
    [handleCurrencySelect, currencyIdA, history]
  )

  const handleRewardInput = useCallback((value: string) => {
    if (errorCode) {
      setShowErrors(errorCode)
    }
    if ((+value >= 0 && /^\d*\.?\d*$/.test(value)) || value === '') {
      setReward(value)
      onRewardInput(value)
    }
  }, [])

  const handleBonusRewardInput = useCallback((value: string) => {
    if (errorCode) {
      setShowErrors(errorCode)
    }
    if ((+value >= 0 && /^\d*\.?\d*$/.test(value)) || value === '') {
      setBonusReward(value)
      onBonusRewardInput(value)
    }
  }, [])

  const handleRewardRateInput = useCallback((value: string) => {
    if (errorCode) {
      setShowErrors(errorCode)
    }
    if ((+value >= 0 && /^\d*\.?\d*$/.test(value)) || value === '') {
      setRewardRate(value)
      onRewardRateInput(value)
    }
  }, [])

  const handleBonusRewardRateInput = useCallback((value: string) => {
    if (errorCode) {
      setShowErrors(errorCode)
    }
    if ((+value >= 0 && /^\d*\.?\d*$/.test(value)) || value === '') {
      setBonusRewardRate(value)
      onBonusRewardRateInput(value)
    }
  }, [])

  const handleLockedTokenSelect = useCallback(
    (token: Currency) => {
      const lockedToken = currencyId(token, chainId)

      history.push(
        `/infinite-farming/create-event/${currencyIdA}/${currencyIdB}/${rewardTokenId}/${bonusRewardTokenId}/${lockedToken}`
      )
    },
    [currencyIdA, currencyIdB, rewardTokenId, bonusRewardTokenId, chainId]
  )

  const isReady = useMemo(() => {
    return (
      baseCurrency &&
      currencyB &&
      tokenCurrency &&
      reward &&
      rewardRate &&
      (hasBonusReward ? Boolean(bonusReward && bonusRewardRate && bonusRewardCurrency) : true)
    )
  }, [
    baseCurrency,
    currencyB,
    tokenCurrency,
    bonusRewardCurrency,
    reward,
    bonusReward,
    rewardRate,
    bonusRewardRate,
    hasBonusReward,
  ])

  //Errors

  return (
    <PageWrapper>
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        {/* <div>
          <TYPE.black style={{ fontSize: ' 18px', marginBottom: '0.5rem' }}>Tier farming</TYPE.black>
          <Toggle
            checked={'Yes'}
            unchecked={'No'}
            isActive={isTierFarming}
            toggle={() => toggleTierFarming(!isTierFarming)}
          />
        </div> */}
        {/* <div style={{ marginLeft: '3rem' }}>
          <TYPE.black style={{ fontSize: ' 18px', marginBottom: '0.5rem' }}>Minimal range (in ticks)</TYPE.black>
          <Input
            pattern="^\d*\.?\d*$"
            value={minimalRange}
            onChange={(e) => setMinimalRange(e.target.value)}
            placeholder="Enter minimum"
          />
        </div> */}
      </div>
      <MainContentWrapper>
        <PairWrapper>
          <PairToken>
            <div style={{ fontSize: '18px' }}>Pair</div>
            <PairSelectorWrapper>
              <CurrencyDropdown
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={onFieldAInput}
                hideInput={true}
                onCurrencySelect={handleCurrencyASelect}
                currency={currencies[Field.CURRENCY_A]}
                id="add-incentive-input-tokena"
                showCommonBases
                showBalance
              />
              <div style={{ width: '12px' }} />

              <CurrencyDropdown
                value={formattedAmounts[Field.CURRENCY_B]}
                onUserInput={onFieldBInput}
                hideInput={true}
                onCurrencySelect={handleCurrencyBSelect}
                currency={currencies[Field.CURRENCY_B]}
                id="add-incentive-input-tokena"
                showCommonBases
                showBalance
              />
            </PairSelectorWrapper>
          </PairToken>
          <RewardToken active={currencyIdA && currencyIdB}>
            <div style={{ fontSize: '18px' }}>Reward</div>
            <RewardInput>
              <Input
                pattern="^\d*\.?\d*$"
                disabled={!currencyIdA || !currencyIdB}
                value={reward}
                onChange={(e) => handleRewardInput(e.target.value)}
                placeholder="Enter an amount"
              />

              <CurrencyDropdown
                value={formattedAmounts[Field.REWARD_TOKEN]}
                onUserInput={onRewardTokenInput}
                hideInput={true}
                onCurrencySelect={currencyIdA && currencyIdB ? handleRewardTokenSelect : null}
                currency={currencies[Field.REWARD_TOKEN]}
                id="add-incentive-input-reward"
                showCommonBases
                showBalance
              />
            </RewardInput>
            {/* {errored(3, 6) && (
              <div
                style={{
                  fontSize: '13px',
                  color: '#de285b',
                  position: 'absolute',
                  marginTop: '8px',
                }}
              >
                {errorMessage}
              </div>
            )} */}
          </RewardToken>
        </PairWrapper>
        <div
          style={{
            marginTop: '20px',
            flex: 1,
            opacity: currencyIdA && currencyIdB && reward && rewardTokenId && hasBonusReward ? '1' : '0.4',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
            <TYPE.black style={{ fontSize: '18px', marginRight: '1rem' }}>Bonus Reward</TYPE.black>
            <Toggle
              checked={'Yes'}
              unchecked={'No'}
              isActive={hasBonusReward}
              toggle={() => toggleHasBonusReward(!hasBonusReward)}
            />
          </div>
          <div style={{ display: 'flex', marginTop: '1rem' }}>
            <Input
              pattern="^\d*\.?\d*$"
              disabled={!currencyIdA || !currencyIdB || !reward}
              value={bonusReward}
              onChange={(e) => handleBonusRewardInput(e.target.value)}
              placeholder="Enter an amount"
            />
            <CurrencyDropdown
              value={formattedAmounts[Field.BONUS_REWARD_TOKEN]}
              onUserInput={onBonusRewardTokenInput}
              hideInput={true}
              onCurrencySelect={currencyIdA && currencyIdB ? handleBonusRewardTokenSelect : null}
              currency={currencies[Field.BONUS_REWARD_TOKEN]}
              id="add-incentive-input-bonus-reward"
              showCommonBases
              showBalance
            />
          </div>
        </div>
        <div style={{ marginTop: '1rem', width: '100%' }}>
          <div
            style={{
              marginTop: '20px',
              flex: 1,
              display: 'flex',
              opacity: currencyIdA && currencyIdB && reward && rewardTokenId ? '1' : '0.4',
            }}
          >
            <div style={{ flex: 1 }}>
              <div>
                <TYPE.black style={{ fontSize: '18px', marginBottom: '1rem' }}>Reward Rate</TYPE.black>
              </div>
              <div>
                <Input
                  style={{ width: '100%' }}
                  pattern="^\d*\.?\d*$"
                  disabled={!currencyIdA || !currencyIdB || !reward}
                  value={rewardRate}
                  onChange={(e) => handleRewardRateInput(e.target.value)}
                  placeholder="Enter a rate"
                />
              </div>
            </div>
            <div style={{ flex: 1, marginLeft: '1rem', opacity: hasBonusReward ? '1' : '0.4' }}>
              <div>
                <TYPE.black style={{ fontSize: '18px', marginBottom: '1rem' }}>Bonus Reward Rate</TYPE.black>
              </div>
              <div>
                <Input
                  style={{ width: '100%' }}
                  pattern="^\d*\.?\d*$"
                  disabled={!currencyIdA || !currencyIdB || !reward || !bonusReward || !hasBonusReward}
                  value={bonusRewardRate}
                  onChange={(e) => handleBonusRewardRateInput(e.target.value)}
                  placeholder="Enter a rate"
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <div
            style={{
              marginTop: '1rem',
              opacity: currencyIdA && currencyIdB && reward && rewardTokenId ? '1' : '0.4',
              width: '100%',
            }}
          >
            <TimeWrapperPart
              style={{ width: '100%', marginLeft: 0, display: 'flex', columnGap: '1rem', alignItems: 'flex-end' }}
            >
              <SummaryWrapper style={{ width: '100%', height: '72px' }}>
                <SummaryPool>
                  {baseCurrency && currencyB && reward && tokenCurrency ? (
                    <TokenLogo
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontFamily: 'Montserrat',
                        fontSize: '14px',
                        background: stringToColour(tokenCurrency.symbol).background,
                        color: stringToColour(tokenCurrency.symbol).text,
                        border: `2px solid ${stringToColour(tokenCurrency.symbol).border}`,
                      }}
                    >
                      {tokenCurrency.symbol.slice(0, 2)}
                    </TokenLogo>
                  ) : (
                    <div
                      style={{
                        backgroundColor: '#373d4e',
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        marginRight: '1rem',
                      }}
                    ></div>
                  )}
                  <div>
                    {baseCurrency && currencyB && reward && tokenCurrency ? (
                      <div title={reward}>{`${reward.length > 5 ? reward.slice(0, 3) + '..' : reward} ${
                        tokenCurrency?.symbol
                      }`}</div>
                    ) : (
                      <div
                        style={{
                          height: '19.2px',
                          width: '80px',
                          backgroundColor: '#373d4e',
                          borderRadius: '6px',
                        }}
                      ></div>
                    )}
                    {baseCurrency && currencyB && reward && tokenCurrency ? (
                      <div style={{ fontSize: '12px', color: '#909090' }}>
                        for{' '}
                        <span style={{ color: '#e81082', boxShadow: 'inset 0 -1px currentColor' }}>
                          {`${baseCurrency?.symbol}/${currencyB?.symbol}`}
                        </span>
                      </div>
                    ) : (
                      <div
                        style={{
                          backgroundColor: '#373d4e',
                          borderRadius: '6px',
                          height: '15.2px',
                          width: '65px',
                          marginTop: '4px',
                        }}
                      ></div>
                    )}
                  </div>
                </SummaryPool>
              </SummaryWrapper>
            </TimeWrapperPart>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <SummaryWrapper>
              <div style={{ width: '100%' }}>
                {!account ? (
                  <button
                    onClick={toggleWalletModal}
                    style={{
                      width: '100%',
                      height: '2.8rem',
                      background: '#601fb3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '16px',
                      fontFamily: 'Inter',
                    }}
                  >
                    Connect Wallet
                  </button>
                ) : showRewardApproval ? (
                  <div>
                    {approvalReward === ApprovalState.PENDING ? (
                      <button
                        style={{
                          width: '100%',
                          height: '2.8rem',
                          background: '#601fb3',
                          cursor: 'pointer',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '16px',
                          fontFamily: 'Inter',
                        }}
                      >
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
                              marginRight: '10px',
                            }}
                            stroke={'white'}
                          />
                          {`Approving ${tokenCurrency?.symbol}`}
                        </span>
                      </button>
                    ) : (
                      <button
                        style={{
                          width: '100%',
                          height: '2.8rem',
                          background: '#601fb3',
                          cursor: 'pointer',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '16px',
                          fontFamily: 'Inter',
                        }}
                        onClick={approveRewardCallback}
                      >
                        {`Approve ${tokenCurrency?.symbol}`}
                      </button>
                    )}
                  </div>
                ) : showBonusRewardApproval ? (
                  <div>
                    {approvalBonusReward === ApprovalState.PENDING ? (
                      <button
                        style={{
                          width: '100%',
                          height: '2.8rem',
                          background: '#601fb3',
                          cursor: 'pointer',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '16px',
                          fontFamily: 'Inter',
                        }}
                      >
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
                              marginRight: '10px',
                            }}
                            stroke={'white'}
                          />
                          {`Approving ${bonusRewardCurrency?.symbol}`}
                        </span>
                      </button>
                    ) : (
                      <button
                        style={{
                          width: '100%',
                          height: '2.8rem',
                          background: '#601fb3',
                          cursor: 'pointer',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '16px',
                          fontFamily: 'Inter',
                        }}
                        onClick={approveBonusRewardCallback}
                      >
                        {`Approve ${bonusRewardCurrency?.symbol}`}
                      </button>
                    )}
                  </div>
                ) : isReady ? (
                  <CreateInfiniteFarming
                    currencyA={baseCurrency}
                    currencyB={currencyB}
                    tokenRewardAddress={tokenCurrency}
                    bonusRewardAddress={bonusRewardCurrency}
                    reward={reward}
                    bonusReward={bonusReward}
                    rewardRate={rewardRate}
                    bonusRewardRate={bonusRewardRate}
                    minimalRange={minimalRange}
                  ></CreateInfiniteFarming>
                ) : (
                  <button
                    // onClick={() => createIncentive()}
                    style={{
                      width: '100%',
                      height: '2.8rem',
                      background: '#1e5e49',
                      color: 'rgb(2, 41, 23)',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '16px',
                      fontFamily: 'Inter',
                    }}
                  >
                    <Trans>Create incentive</Trans>
                  </button>
                )}
              </div>
            </SummaryWrapper>
          </div>
        </div>
      </MainContentWrapper>
    </PageWrapper>
  )
}
