import { useState } from 'react'
import styled from 'styled-components/macro'
import { Database, LifeBuoy } from 'react-feather'

const Tabs = styled.div`
  display: flex;
`

const Tab = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0 8px 12px;
  border-bottom: 1px solid ${({ active }) => (active ? '#4588ED' : '#202635')};
  white-space: nowrap;
  cursor: pointer;
`

const TabSpacer = styled.div`
  display: inline-block;
  width: 40px;
  height: 37px;
  border-bottom: 1px solid #202635;
  &:last-of-type {
    width: 100%;
  }
`
const TabIcon = styled.span`
  margin-right: 10px;
  & > svg {
    display: block;
  }
`

const tabs = [
  {
    title: 'My rewards',
    icon: <LifeBuoy></LifeBuoy>,
  },
  {
    title: 'My farms',
    icon: <Database></Database>,
  },
]

export function StakerTabs({ changeTabHandler }: { changeTabHandler: (i: number) => void }) {
  const [activeTab, setActiveTab] = useState(0)

  const selectTab = function (i) {
    setActiveTab(i)
    changeTabHandler(i)
  }

  return (
    <Tabs>
      {tabs.map((el, i) => (
        <>
          <Tab onClick={() => selectTab(i)} active={i === activeTab} key={i}>
            <TabIcon>{el.icon}</TabIcon>
            <span>{el.title}</span>
          </Tab>
          <TabSpacer></TabSpacer>
        </>
      ))}
    </Tabs>
  )
}
