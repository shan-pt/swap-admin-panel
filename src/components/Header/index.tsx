import useScrollPosition from '@react-hook/window-scroll'
import { darken } from 'polished'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Text } from 'rebass'
import { useShowClaimPopup } from 'state/application/hooks'
import { useDarkModeManager } from 'state/user/hooks'
import { useETHBalances } from 'state/wallet/hooks'
import styled from 'styled-components/macro'
import { useActiveWeb3React } from '../../hooks/web3'
import Row from '../Row'
import Web3Status from '../Web3Status'
import NetworkCard from './NetworkCard'

const HeaderFrame = styled.div<{ showBackground: boolean }>`
  display: flex;
  grid-template-columns: 120px 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 1rem;
  z-index: 21;
  position: relative;
  /* Background slide effect on scroll. */
  background-image: ${({ theme }) => `linear-gradient(to bottom, transparent 50%, rgba(0,0,0,.9) 50% )}}`};
  background-position: ${({ showBackground }) => (showBackground ? '0 -100%' : '0 0')};
  background-size: 100% 200%;
  box-shadow: 0px 0px 0px 1px ${({ theme, showBackground }) => (showBackground ? theme.bg2 : 'transparent;')};
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 48px 1fr 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding:  1rem;
    grid-template-columns: 1fr 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding:  1rem;
    grid-template-columns: 36px 1fr;
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};
`

const HeaderLinks = styled(Row)`
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  justify-self: center;
  // background-color: ${({ theme }) => theme.bg0};
  width: fit-content;
  padding: 4px;
  border-radius: 16px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 30px;
  overflow: auto;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    // justify-self: center;  
    `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-self: center;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    z-index: 99;
    position: fixed;
    bottom: 1rem;
    // transform: translate(-50%);
    margin: 0 auto;
    // background-color: ${({ theme }) => theme.bg0};
    // border: 1px solid ${({ theme }) => theme.bg2};
    // box-shadow: 0px 6px 10px rgb(0 0 0 / 2%);
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0;
    background-color: black;
  `}
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg1)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

const UNIAmount = styled(AccountElement)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  text-decoration: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    // justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const AlgIcon = styled.div`
  transition: transform 0.3s ease;

  & > img {
    width: 160px;
  }

  :hover {
    transform: scale(1.2);
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    & > img {
      width: 130px;
    }
  }`}
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 160px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
  padding: 14px 20px;
  word-break: break-word;
  white-space: nowrap;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    border-radius: 16px;
  `}

  &.${activeClassName} {
    // border-radius: 12px;
    font-weight: 600;
    // color: ${({ theme }) => theme.text1};
    // background-color: ${({ theme }) => theme.bg2};
    color: #00fbe6;
  }

  &:not(.${activeClassName}) {
    & :hover,
    &:focus {
      color: ${({ theme }) => darken(0.1, theme.text1)};
      background-color: rgba(15, 46, 64, 0.4);
    }
  }
`

export default function Header() {
  const { account, chainId } = useActiveWeb3React()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  const [darkMode] = useDarkModeManager()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const showClaimPopup = useShowClaimPopup()

  const scrollY = useScrollPosition()

  let chainValue

  if (chainId === 0x64) {
    chainValue = 'XDAI'
  }

  return (
    <HeaderFrame showBackground={scrollY > 45}>
      <Title href=".">
        <AlgIcon>
          <img width={'160px'} src={'https://swapr.liquidity.eth.limo/static/media/swapr-logo.763fce338b3827b675cf717fd40029ba.svg'} alt="logo" />
        </AlgIcon>
      </Title>
      <HeaderLinks>
        {/* <StyledNavLink id={`farming-nav-link`} to={'/farming'}>
          Create Event
        </StyledNavLink>
        <StyledNavLink id={`limit-events-nav-link`} to={'/limit-events'}>
          Limit Events
        </StyledNavLink> */}
        <StyledNavLink id={`infinite-farming-nav-link`} to={'/infinite-farming'}>
          Create Eternal Farming
        </StyledNavLink>
        <StyledNavLink id={`infinite-events-nav-link`} to={'/infinite-events'}>
          Eternal Farmings
        </StyledNavLink>
      </HeaderLinks>
      <HeaderControls>
        <NetworkCard />
        <HeaderElement>
          {/* {availableClaim && !showClaimPopup && (
            <UNIWrapper onClick={toggleClaimModal}>
              <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                <TYPE.white padding="0 2px">
                  {claimTxn && !claimTxn?.receipt ? (
                    <Dots>
                      <Trans>Claiming UNI</Trans>
                    </Dots>
                  ) : (
                    <Trans>Claim UNI</Trans>
                  )}
                </TYPE.white>
              </UNIAmount>
              <CardNoise />
            </UNIWrapper>
          )} */}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {chainId === 0x64 && account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(3)} {chainValue}{' '}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
          {/* <Menu /> */}
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  )
}
