import { gql } from "@apollo/client";
import { FINITE_FARMING_ADDRESS } from "../constants/addresses";

//Farming

export const FETCH_REWARDS = account => gql`
query fetchRewards {
    rewards(orderBy: amount, orderDirection: desc, where: {owner: "${account}"}) {
        id
        rewardAddress
        amount
        owner
    }
}`

export const FETCH_TOKEN = tokenId => gql`
query fetchToken {
    tokens(where: { id: "${tokenId}" }) {
        id
        symbol
        name
        decimals
    }
}`

export const FETCH_POOL = () => gql`
query fetchPool ($poolId: ID) {
    pools(where: { id: $poolId}) {
        id
        fee
        token0 {
            id
            decimals
            symbol
        }
        token1 {
            id
            decimals
            symbol
        }
        sqrtPrice
        liquidity
        tick
        feesUSD
        untrackedFeesUSD
    }
}`

export const TRANSFERED_POSITIONS = (account, chainId) => gql`
    query transferedPositions {
        deposits (orderBy: id, orderDirection: desc, where: {owner: "${account}", onFarmingCenter: "true"}) {
            id
            L2tokenId
            owner
            eternalFarming
            pool
    }
}
`

export const SHARED_POSITIONS = account => gql`
    query sharedPositions {
        deposits (orderBy: id, orderDirection: desc, where: {owner: "${account}", limitFarming_not: null}) {
            id
            owner
            eternalFarming
            pool
    }
}
`

export const TRANSFERED_POSITIONS_FOR_POOL = (account, pool) => gql`
query transferedPositionsForPool {
    deposits (orderBy: id, orderDirection: desc, where: {owner: "${account}", pool: "${pool}"}) {
        id
        owner
        eternalFarming
        pool
    }
}`

export const POSITIONS_OWNED_FOR_POOL = (account, pool) => gql`
query positionsOwnedForPool {
    deposits (orderBy: id, orderDirection: desc, where: {owner: "${account}",  pool: "${pool}"}) {
        id
        owner
        pool
        eternalFarming
    }
}`

//Info

export const INFINITE_EVENTS = gql`
    query infinitePools {
        eternalFarmings {
            id
            rewardToken
            bonusRewardToken
            pool
            startTime
            endTime
            reward
            bonusReward
            rewardRate
            bonusRewardRate
            isDetached
            virtualPool
            minRangeLength
        }
    }
`

export const TOP_POOLS = gql`
query topPools {
  pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
    id
  }
}
`

export const POOLS_FROM_ADDRESSES = (blockNumber: undefined | number, pools: string[]) => {
    let poolString = `[`
    pools.map((address) => {
        return (poolString += `"${address}",`)
    })
    poolString += ']'
    const queryString =
        `
      query pools {
        pools(where: {id_in: ${poolString}},` +
        (blockNumber ? `block: {number: ${blockNumber}} ,` : ``) +
        ` orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
          id
          fee
          liquidity
          sqrtPrice
          tick
          token0 {
              id
              symbol 
              name
              decimals
              derivedETH
          }
          token1 {
              id
              symbol 
              name
              decimals
              derivedETH
          }
          token0Price
          token1Price
          volumeUSD
          txCount
          totalValueLockedToken0
          totalValueLockedToken1
          totalValueLockedUSD
        }
      }
      `
    return gql(queryString)
}


export const TOP_TOKENS = gql`
  query topTokens {
    tokens(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
      id
    }
  }
`

export const TOKENS_FROM_ADDRESSES = (blockNumber: number | undefined, tokens: string[]) => {
    let tokenString = `[`
    tokens.map((address) => {
        return (tokenString += `"${address}",`)
    })
    tokenString += ']'
    const queryString =
        `
      query tokens {
        tokens(where: {id_in: ${tokenString}},` +
        (blockNumber ? `block: {number: ${blockNumber}} ,` : ``) +
        ` orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
          id
          symbol
          name
          derivedETH
          volumeUSD
          volume
          txCount
          totalValueLocked
          feesUSD
          totalValueLockedUSD
        }
      }
      `
    return gql(queryString)
}


//Blocklytics

export const GET_BLOCKS = (timestamps: string[]) => {
    let queryString = 'query blocks {'
    queryString += timestamps.map((timestamp) => {
        return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600
            } }) {
          number
        }`
    })
    queryString += '}'
    return gql(queryString)
}
