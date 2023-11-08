import ApeModeQueryParamReader from 'hooks/useApeModeQueryParamReader'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components/macro'
import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import { Pool } from 'lib/src'
import { createGlobalStyle } from 'styled-components/macro'
import InfiniteFarmingPage from './InfiniteFarming'
import InfiniteEvents from './InfiniteEvents/InfiniteEvents'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 120px 16px 0px 16px;
  align-items: center;
  flex: 1;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 5rem 16px 16px 16px;
  `};
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 2;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

const GlobalStyle = createGlobalStyle`
  button {
    cursor: pointer;
  }
`

const AdminTitle = styled.div`
  font-size: 50px;
  color: white;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function App() {
  //TODO
  Object.defineProperty(Pool.prototype, 'tickSpacing', {
    get() {
      return 60
    },
  })

  return (
    <ErrorBoundary>
      <GlobalStyle />
      <Route component={DarkModeQueryParamReader} />
      <Route component={ApeModeQueryParamReader} />
      <Web3ReactManager>
        <AppWrapper>
          <HeaderWrapper style={{ zIndex: 3 }}>
            <Header />
          </HeaderWrapper>
          <BodyWrapper style={{ zIndex: 2 }}>
            <Popups />
            <Polling />
            <Switch>
              <Route strict path="/infinite-farming" component={InfiniteFarmingPage} />
              <Route strict path="/infinite-events" component={InfiniteEvents} />
              <Route strict path="/">
                <AdminTitle>Swapr V3 Admin Panel</AdminTitle>
              </Route>
            </Switch>
            <Marginer />
          </BodyWrapper>
        </AppWrapper>
      </Web3ReactManager>
    </ErrorBoundary>
  )
}
