import { useActiveWeb3React } from 'hooks/web3'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { WETH9_EXTENDED } from '../../constants/tokens'
import { NewInfiniteFarming } from './NewInfiniteFarming'

export function RedirectDuplicateTokenInfiniteFarmingIds(
  props: RouteComponentProps<{ currencyIdA: string; currencyIdB: string; rewardTokenId: string }>
) {
  const {
    match: {
      params: { currencyIdA, currencyIdB, rewardTokenId },
    },
  } = props

  const { chainId } = useActiveWeb3React()

  // prevent weth + eth
  let symbol

  if (chainId === 0x64) {
    symbol = 'XDAI'
  }

  const isETHOrWETHA =
    currencyIdA === symbol || (chainId !== undefined && currencyIdA === WETH9_EXTENDED[chainId]?.address)
  const isETHOrWETHB =
    currencyIdB === symbol || (chainId !== undefined && currencyIdB === WETH9_EXTENDED[chainId]?.address)

  if (
    currencyIdA &&
    currencyIdB &&
    (currencyIdA.toLowerCase() === currencyIdB.toLowerCase() || (isETHOrWETHA && isETHOrWETHB))
  ) {
    return <Redirect to={`/new-incentive/${currencyIdA}`} />
  }
  return <NewInfiniteFarming {...props} />
}
