import { Currency } from '@uniswap/sdk-core'
import { useActiveWeb3React } from '../hooks/web3'

export function currencyId(currency: Currency, chainId: number): string {
  let chainSymbol

  if (chainId === 0x64) {
    chainSymbol = 'XDAI'
  }

  if (currency.isNative) return chainSymbol
  if (currency.isToken) return currency.address
  throw new Error('invalid currency')
}
