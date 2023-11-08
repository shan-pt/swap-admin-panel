import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0xA0864cCA6E114013AB0e27cbd5B6f4c8947da766'
}

export const POOL_DEPLOYER_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0xC1b576AC6Ec749d5Ace1787bF9Ec6340908ddB47'
}

export const QUOTER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0xcBaD9FDf0D2814659Eb26f600EFDeAF005Eda0F7'
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0xfFB643E73f280B97809A8b41f7232AB401a04ee1'
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x91fD594c46D8B01E62dBDeBed2401dde01817834'
}

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0xc4B85BaF01cD7D1C8F08a8539ba96C205782BBcf'
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x7B709b1E27Dbf4405f45Ed3fFf8A6eFA08BB02f6'
}

export const REAL_STAKER_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x32CFF674763b06B983C0D55Ef2e41B84D16855bb'
}

export const FINITE_FARMING_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0xf9806d646793161303685C61b88DEe2649C3C6aE'
}

export const INFINITE_FARMING_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x607BbfD4CEbd869AaD04331F8a2AD0C3C396674b'
}

export const FARMING_CENTER: AddressMap = {
  [SupportedChainId.POLYGON]: '0xDe51dDF1aE7d5BBD7bF1A0e40aAA1F6C12579106'
}

export const V2_FACTORY_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32'
}

export const V2_ROUTER_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506'
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
}

export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x65770b5283117639760beA3F867b69b3697a91dd'
}