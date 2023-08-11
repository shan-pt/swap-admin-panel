import { defaultAbiCoder } from '@ethersproject/abi'
import { BytesLike } from "@ethersproject/bytes";
import { keccak256 } from '@ethersproject/solidity'
import { ethers } from "ethers"
import { Token } from '../entities'
import { getAddress, getCreate2Address } from "ethers/lib/utils"
import { POOL_INIT_CODE_HASH } from "../constants";

/**
 * Computes a pool address
 * @param factoryAddress The Uniswap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @returns The pool address
 */
export function computePoolAddress({
  poolDeployer,
  tokenA,
  tokenB,
  initCodeHashManualOverride,
}: {
  poolDeployer: string
  tokenA: Token
  tokenB: Token
  initCodeHashManualOverride?: string
}): string {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  return getCreate2Address(
    poolDeployer,
    keccak256(['bytes'], [defaultAbiCoder.encode(['address', 'address'], [token0.address, token1.address])]),
    initCodeHashManualOverride ?? POOL_INIT_CODE_HASH
  )
}

export function getCreate2AddressZK(from: string, salt: BytesLike, initCodeHash: BytesLike): string {

  const prefix = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('zksyncCreate2'))

  const addressBytes = ethers.utils.keccak256(ethers.utils.concat([prefix, ethers.utils.zeroPad(from, 32), salt, initCodeHash, '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'])).slice(26)

  return getAddress(addressBytes)

}
