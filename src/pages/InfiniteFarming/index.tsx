import { AutoColumn } from 'components/Column'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { useEffect, useState } from 'react'
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components/macro'
import { useActiveWeb3React } from '../../hooks/web3'
import { PageTitle } from '../../components/PageTitle'
import { RedirectDuplicateTokenInfiniteFarmingIds } from './redirects'
import { useWalletModalToggle } from '../../state/application/hooks'

import { Helmet } from 'react-helmet'
import { NewInfiniteFarming } from './NewInfiniteFarming'

const PageWrapper = styled(AutoColumn)`
  max-width: 900px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 600px;
  `};
`
const InnerWrapper = styled(AutoColumn)`
  ${({ theme }) => theme.mediaWidth.upToSmall`{
    min-width: 100%;
  }`}
`
const MainContentWrapper = styled.div`
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.upToSmall`{
    min-width: 100%;
  }`}
`

export default function InfiniteFarmingPage() {
  const { account } = useActiveWeb3React()

  const { path } = useRouteMatch()

  return (
    <>
      <Helmet>
        <title>Swapr — Infinite Farming</title>
      </Helmet>
      <PageWrapper>
        <InnerWrapper gap="lg" justify="center">
          <InnerWrapper gap="lg" style={{ width: '100%', gridRowGap: '0' }}>
            <MainContentWrapper>
              <Switch>
                <Route exact path={`${path}`}>
                  <Redirect to={`${path}/${account ? 'create-event' : ''}`} />
                </Route>
                <Route
                  exact
                  strict
                  render={(props) => (
                    <>
                      <Helmet>
                        <title>Swapr — Infinite Farming • Create event</title>
                      </Helmet>
                      <PageTitle title={'Create Infinite event'}></PageTitle>
                      {console.log(props)}
                      <NewInfiniteFarming {...props}></NewInfiniteFarming>
                    </>
                  )}
                  path={`${path}/create-event`}
                ></Route>
                <Route
                  exact
                  strict
                  render={(props) => (
                    <>
                      <Helmet>
                        <title>Swapr — Farming • Create event</title>
                      </Helmet>
                      <PageTitle title={'Create Infinite event'}></PageTitle>
                      <RedirectDuplicateTokenInfiniteFarmingIds {...props}></RedirectDuplicateTokenInfiniteFarmingIds>
                    </>
                  )}
                  path={`${path}/create-event/:currencyIdA?/:currencyIdB?/:rewardTokenId?/:bonusRewardTokenId?/:lockedTokenId?`}
                ></Route>
              </Switch>
            </MainContentWrapper>
          </InnerWrapper>
        </InnerWrapper>
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}
