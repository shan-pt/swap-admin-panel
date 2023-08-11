import { Token, Ether } from '@uniswap/sdk-core'
import { SupportedChainId } from './chains'

// export const USDC_BINANCE = new Token(
//   SupportedChainId.BINANCE,
//   '0x37792237f932004b9f07BB55C3a3ad77e3BF4ca1',
//   8,
//   'USDC',
//   'USD//C'
// )

export const USDC_POLYGON = new Token(
  SupportedChainId.POLYGON,
  '0xFd4039020ce966d5c396868005bfCd11c24A566F',
  6,
  'USDC',
  'USD//C'
)

export const WETH9_EXTENDED: { [chainId: number]: Token } = {
  [SupportedChainId.POLYGON]: new Token(
    SupportedChainId.POLYGON,
    '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    18,
    'WFTM',
    'Wrapped ETH'
  ),
}

export class ExtendedEther extends Ether {
  public get wrapped(): Token {
    if (this.chainId in WETH9_EXTENDED) return WETH9_EXTENDED[this.chainId]
    throw new Error('Unsupported chain ID')
  }

  private static _cachedEther: { [chainId: number]: ExtendedEther } = {}

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedEther[chainId] ?? (this._cachedEther[chainId] = new ExtendedEther(chainId))
  }
}
