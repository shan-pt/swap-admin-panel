import styled from 'styled-components/macro'
import { stringToColour } from '../../utils/stringToColour'

const ModalWrapper = styled.div`
  display: flex;
  width: 100%;
`

const ModalHeader = styled.div`
  display: flex;
  width: 100%;
`

const RewardTokenIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 1rem;
  width: 35px;
  height: 35px;
  background-color: ${({ name }) => (name ? stringToColour(name).background : '#3d4a6a')};
  border: 1px solid ${({ name }) => (name ? stringToColour(name).border : '#3d4a6a')};
  color: ${({ name }) => (name ? stringToColour(name).text : '#3d4a6a')};
`

const RewardTokenInfo = styled.div`
  & > * {
    font-family: Montserrat;
    font-size: 15px;
  }
`

const ClaimRewardButton = styled.button`
  border: none;
  border-radius: 8px;
  background-color: #4829bb;
  color: white;
  margin-left: auto;
  padding: 8px 16px;
`

export function StakerRewardModal({
  rew,
}: {
  rew: {
    amount: string
    symbol: string
  }
}) {
  return (
    <ModalWrapper>
      <ModalHeader>
        <RewardTokenIcon name={rew.symbol}>{rew.symbol.slice(0, 2)}</RewardTokenIcon>
        <RewardTokenInfo>
          <div title={rew.amount}>{rew.amount}</div>
          <div title={rew.symbol}>{rew.symbol}</div>
        </RewardTokenInfo>
        <ClaimRewardButton>Claim</ClaimRewardButton>
      </ModalHeader>
    </ModalWrapper>
  )
}
