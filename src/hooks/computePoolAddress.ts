import { defaultAbiCoder } from '@ethersproject/abi'
import { keccak256 } from '@ethersproject/solidity'
import { Token } from '@uniswap/sdk-core'
import { ethers } from "ethers"
import { BytesLike } from "@ethersproject/bytes";
import { getAddress, getCreate2Address } from "ethers/lib/utils"

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const POOL_INIT_CODE_HASH = '0xbce37a54eab2fcd71913a0d40723e04238970e7fc1159bfd58ad5b79531697e7'

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  LOW = 500,
  MEDIUM = 500,
  HIGH = 500,
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
  [FeeAmount.LOW]: 60,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 60
}

/**
 * Computes a pool address
 * @param poolDeployer The SynthSwap factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @returns The pool address
 */
export function computePoolAddress({
  poolDeployer,
  tokenA,
  tokenB,
  initCodeHashManualOverride
}: {
  poolDeployer: string
  tokenA: Token
  tokenB: Token
  initCodeHashManualOverride?: string
}): string {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  return getCreate2Address(
    poolDeployer,
    keccak256(
      ['bytes'],
      [defaultAbiCoder.encode(['address', 'address'], [token0.address, token1.address])]
    ),
    initCodeHashManualOverride ?? POOL_INIT_CODE_HASH
  )
}


export function getCreate2AddressZK(from: string, salt: BytesLike, initCodeHash: BytesLike): string {

  const prefix = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('zksyncCreate2'))

  const addressBytes = ethers.utils.keccak256(ethers.utils.concat([prefix, ethers.utils.zeroPad(from, 32), salt, initCodeHash, '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'])).slice(26)

  return getAddress(addressBytes)

}
