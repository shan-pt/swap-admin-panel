// function getStakingModal() {
//     return (
//       <div
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           padding: '1rem 2rem',
//           width: '100%',
//           paddingBottom: 0,
//         }}
//       >
//         {stakingState === 1 ? (
//           <>
//             <div
//               style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//               }}
//             >
//               <div>
//                 <ul
//                   style={{
//                     padding: 0,
//                     overflow: 'auto',
//                     maxHeight: 'calc(47px * 8)',
//                     minHeight: 'calc(47px * 8)',
//                     margin: '1rem -2rem',
//                     marginBottom: 0,
//                   }}
//                 >
//                   {console.log('ALL POITONS', allPositions)}
//                   {allPositions &&
//                     selectedReward &&
//                     allPositions
//                       .filter((el) => selectedReward.pool === el.pool && !el.staked)
//                       // .filter(
//                       //   (el) =>

//                       //       el.owner !== STAKER_ADDRESS[chainId].toLowerCase())
//                       //       ||
//                       //       el.owner === STAKER_ADDRESS[chainId].toLowerCase())
//                       // )
//                       .map((el, i) => (
//                         <li
//                           style={{
//                             // height: '40px',
//                             display: 'flex',
//                             padding: '10px 2rem 10px 2rem',
//                             lineHeight: '27px',
//                             // justifyContent: 'space-between'
//                           }}
//                           key={i}
//                         >
//                           <div
//                             style={{
//                               fontSize: '14px',
//                             }}
//                           >
//                             {`# ${el.tokenId}`}
//                           </div>
//                           <div
//                             style={{
//                               fontSize: '13px',
//                               marginLeft: '1rem',
//                             }}
//                           >
//                             <span
//                               style={{
//                                 boxShadow: 'inset 0 -1px currentColor',
//                               }}
//                             >
//                               <NFTLink as={Link} to={`/pool/${el.tokenId}`}>
//                                 View position
//                               </NFTLink>
//                             </span>
//                           </div>
//                           <div
//                             style={{
//                               fontSize: '13px',
//                               marginLeft: '1rem',
//                             }}
//                           >
//                             <span
//                               style={{
//                                 boxShadow: 'inset 0 -1px currentColor',
//                               }}
//                             >
//                               <NFTLink
//                                 href={`https://mumbai.polygonscan.com/address/${NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[137]}?a=${el.tokenId}`}
//                                 target="__blank"
//                               >
//                                 View on scaner
//                               </NFTLink>
//                             </span>
//                             <span
//                               style={{
//                                 marginLeft: '4px',
//                                 marginBottom: '4px',
//                               }}
//                             >
//                               <ExternalLink size={14} />
//                             </span>
//                           </div>
//                           <div
//                             style={{
//                               marginLeft: 'auto',
//                             }}
//                           >
//                             <label>
//                               <Checkbox
//                                 disabled={submitLoader}
//                                 checked={selectedNFT[el.tokenId]?.checked}
//                                 onChange={() => {
//                                   setSelectedNFT({
//                                     ...selectedNFT,
//                                     [el.tokenId]: {
//                                       checked: selectedNFT[el.tokenId] ? !selectedNFT[el.tokenId].checked : true,
//                                       approved: el.approved,
//                                       transfered: el.transfered,
//                                     },
//                                   })
//                                 }}
//                               />
//                             </label>
//                           </div>
//                         </li>
//                       ))}
//                 </ul>
//               </div>
//             </div>
//             <div
//               style={{
//                 padding: '16px 0',
//               }}
//             >
//               {Object.values(selectedNFT).some((el: any) => el.checked) ? (
//                 submitState === 0 &&
//                 Object.values(selectedNFT).some((el: any) => el.approved === null && el.checked && !el.transfered) ? (
//                   <button
//                     onClick={() => {
//                       setSubmitLoader(true)
//                       approveHandler(selectedNFT)
//                     }}
//                     disabled={submitLoader}
//                     style={{
//                       width: '100%',
//                       padding: '12px',
//                       backgroundColor: '#601fb3',
//                       color: 'white',
//                       fontFamily: 'Montserrat',
//                       // fontWeight: 600,
//                       border: 'none',
//                       borderRadius: '6px',
//                     }}
//                   >
//                     {!submitLoader ? (
//                       `Approve ${
//                         Object.values(selectedNFT).filter(
//                           (el: any) => el.approved === null && el.checked && !el.transfered
//                         ).length
//                       } NFT`
//                     ) : (
//                       <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                         <Loader stroke={'white'} />
//                         <span style={{ marginLeft: '5px' }}>Loading</span>
//                       </span>
//                     )}
//                   </button>
//                 ) : submitState === 1 ||
//                   Object.values(selectedNFT).some((el: any) => el.approved && el.checked && !el.transfered) ? (
//                   <button
//                     disabled={submitLoader}
//                     onClick={() => {
//                       setSubmitLoader(true)
//                       transferHandler(selectedNFT)
//                     }}
//                     style={{
//                       width: '100%',
//                       padding: '12px',
//                       backgroundColor: '#601fb3',
//                       color: 'white',
//                       fontFamily: 'Montserrat',
//                       // fontWeight: 600,
//                       border: 'none',
//                       borderRadius: '6px',
//                     }}
//                   >
//                     {!submitLoader ? (
//                       `Transfer ${Object.values(selectedNFT).filter((el: any) => el.approved && el.checked).length} NFT`
//                     ) : (
//                       <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                         <Loader stroke={'white'} />
//                         <span style={{ marginLeft: '5px' }}>Loading</span>
//                       </span>
//                     )}
//                   </button>
//                 ) : submitState === 2 ||
//                   Object.values(selectedNFT).some((el: any) => el.checked && el.transfered && !el.staked) ? (
//                   <button
//                     disabled={submitLoader}
//                     onClick={() => {
//                       setSubmitLoader(true)
//                       stakeHandler(
//                         Object.entries(selectedNFT).reduce(
//                           (acc, [tokenId, token]) => [...acc, { ...token, tokenId }],
//                           []
//                         ),
//                         selectedIncentive
//                       )
//                     }}
//                     style={{
//                       width: '100%',
//                       padding: '12px',
//                       backgroundColor: '#601fb3',
//                       color: 'white',
//                       fontFamily: 'Montserrat',
//                       // fontWeight: 600,
//                       border: 'none',
//                       borderRadius: '6px',
//                     }}
//                   >
//                     {!submitLoader ? (
//                       `Stake ${Object.values(selectedNFT).filter((el: any) => el.transfered && !el.staked).length} NFT`
//                     ) : (
//                       <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                         <Loader stroke={'white'} />
//                         <span style={{ marginLeft: '5px' }}>Loading</span>
//                       </span>
//                     )}
//                   </button>
//                 ) : (
//                   submitState === 3 && (
//                     <button
//                       style={{
//                         width: '100%',
//                         padding: '12px',
//                         backgroundColor: '#1e5e49',
//                         color: 'white',
//                         fontFamily: 'Montserrat',
//                         // fontWeight: 600,
//                         border: 'none',
//                         borderRadius: '6px',
//                       }}
//                     >
//                       Stake completed!
//                     </button>
//                   )
//                 )
//               ) : (
//                 <button
//                   style={{
//                     width: '100%',
//                     padding: '12px',
//                     backgroundColor: '#1e5e49',
//                     color: '#412467',
//                     fontFamily: 'Montserrat',
//                     // fontWeight: 600,
//                     border: 'none',
//                     borderRadius: '6px',
//                   }}
//                 >
//                   Select NFT
//                 </button>
//               )}
//             </div>
//           </>
//         ) : (
//           <div
//             style={{
//               padding: '1rem 0',
//               paddingTop: '0px',
//               paddingBottom: '0px',
//             }}
//           >
//             <div
//               style={{
//                 display: 'flex',
//                 fontSize: '14px',
//                 lineHeight: '36px',
//               }}
//             >
//               <span
//                 onClick={() => setModalState(0)}
//                 style={{
//                   padding: '8px 7px',
//                   borderBottom: `2px solid ${modalState === 0 ? '#36f' : '#0f0e0e'}`,
//                   whiteSpace: 'nowrap',
//                 }}
//               >
//                 Active incentives
//               </span>
//               <span
//                 style={{
//                   borderBottom: '2px solid #0f0e0e',
//                   width: '40px',
//                 }}
//               ></span>
//               <span
//                 onClick={() => setModalState(1)}
//                 style={{
//                   padding: '8px 7px',
//                   borderBottom: `2px solid ${modalState === 1 ? '#36f' : '#0f0e0e'}`,
//                   whiteSpace: 'nowrap',
//                 }}
//               >
//                 On staker
//               </span>
//               <span
//                 style={{
//                   borderBottom: '2px solid #0f0e0e',
//                   width: '40px',
//                 }}
//               ></span>
//               <span
//                 onClick={() => setModalState(2)}
//                 style={{
//                   padding: '8px 7px',
//                   borderBottom: `2px solid ${modalState === 2 ? '#36f' : '#0f0e0e'}`,
//                   whiteSpace: 'nowrap',
//                 }}
//               >
//                 Future incentives
//               </span>
//               <span
//                 style={{
//                   borderBottom: '2px solid #0f0e0e',
//                   width: '40px',
//                 }}
//               ></span>
//               {/* <span
//                 onClick={() => setModalState(3)}
//                 style={{
//                   padding: '8px 7px',
//                   borderBottom: `2px solid ${modalState === 3 ? '#36f' : '#0f0e0e'}`,
//                   whiteSpace: 'nowrap',
//                 }}
//               >
//                 Refund
//               </span> */}
//               <span
//                 style={{
//                   borderBottom: '2px solid #0f0e0e',
//                   width: '100%',
//                 }}
//               ></span>
//             </div>

//             {modalState === 0 ? (
//               <>
//                 <div
//                   style={{
//                     display: 'flex',
//                     padding: '16px 0 0 0',
//                     color: '#aeaeae',
//                     fontSize: '12px',
//                     textTransform: 'uppercase',
//                     lineHeight: '28px',
//                   }}
//                 >
//                   <div
//                     style={{
//                       flex: 1,
//                     }}
//                   >
//                     reward
//                   </div>
//                   <div
//                     style={{
//                       flex: 1,
//                     }}
//                   >
//                     started
//                   </div>
//                   <div
//                     style={{
//                       flex: 1,
//                     }}
//                   >
//                     ends in
//                   </div>
//                   <div
//                     style={{
//                       flex: 1,
//                     }}
//                   ></div>
//                 </div>
//                 <div>
//                   <ul
//                     style={{
//                       padding: 0,
//                       overflow: 'auto',
//                       minHeight: 'calc(47px * 8 + 10px)',
//                       maxHeight: 'calc(47px * 8 + 10px)',
//                       margin: '1rem -2rem',
//                       marginBottom: 0,
//                     }}
//                   >
//                     {selectedReward?.incentives
//                       .filter((inc) => inc.startTime < new Date().getTime() / 1000)
//                       .map((el, i) => (
//                         <li
//                           key={i}
//                           style={{
//                             // height: '40px',
//                             display: 'flex',
//                             padding: '10px 1rem 10px 2rem',
//                             lineHeight: '27px',
//                             // justifyContent: 'space-between'
//                           }}
//                         >
//                           <div
//                             style={{
//                               // padding: '4px 8px',
//                               borderRadius: '6px',
//                               flex: 1,
//                               fontSize: '14px',
//                               // backgroundColor: 'rgba(60, 59, 59, 0.54)',
//                             }}
//                           >
//                             {el.rewardLeft}
//                           </div>

//                           <div
//                             style={{
//                               // marginLeft: 'auto',
//                               flex: 1,
//                               // padding: '4px 8px',
//                               borderRadius: '6px',
//                               fontSize: '14px',
//                             }}
//                           >
//                             {new Date(el.startTime * 1000).toLocaleString().split(',')[0]}
//                           </div>
//                           <div
//                             style={{
//                               // marginLeft: 'auto',
//                               flex: 1,
//                               // padding: '4px 8px',
//                               borderRadius: '6px',
//                               fontSize: '14px',
//                             }}
//                           >
//                             {el.endTime > new Date().getTime() / 1000 ? getCountdownTime(el.endTime, now) : 'Ended'}
//                           </div>
//                           <div
//                             style={{
//                               flex: 1,
//                             }}
//                           >
//                             {/* <button
//                               style={{
//                                 backgroundColor: 'rgba(60, 59, 59, 0.54)',
//                                 padding: '5px',
//                                 border: 'none',
//                                 color: 'white',
//                                 borderRadius: '4px',
//                                 width: '100%',
//                               }}
//                               onClick={() => {
//                                 setStakingState(1)
//                                 setSelectedIncentive({
//                                   ...el,
//                                 })
//                               }}
//                             >
//                               <span>Stake</span>
//                             </button> */}
//                           </div>
//                         </li>
//                       ))}
//                   </ul>
//                 </div>
//               </>
//             ) : modalState === 1 ? (
//               <>
//                 <div
//                   style={{
//                     display: 'flex',
//                     padding: '16px 0 0 0',
//                     color: '#aeaeae',
//                     fontSize: '12px',
//                     textTransform: 'uppercase',
//                     lineHeight: '28px',
//                   }}
//                 >
//                   <div
//                     style={{
//                       flex: 1,
//                     }}
//                   >
//                     Earned
//                   </div>
//                   <div
//                     style={{
//                       flex: 1,
//                     }}
//                   >
//                     since
//                   </div>
//                   <div
//                     style={{
//                       flex: 1,
//                     }}
//                   >
//                     ends in
//                   </div>
//                   <div
//                     style={{
//                       flex: 2,
//                     }}
//                   ></div>
//                 </div>
//                 <div>
//                   {!positionsLoading ? (
//                     <ul
//                       style={{
//                         padding: 0,
//                         overflow: 'auto',
//                         minHeight: 'calc(47px * 8 + 10px)',
//                         maxHeight: 'calc(47px * 8 + 10px)',
//                         margin: '1rem -2rem',
//                         marginBottom: 0,
//                       }}
//                     >
//                       {positionsResult &&
//                         selectedReward &&
//                         positionsResult
//                           .filter((el) => el.incentive && el.transfered && el.pool === selectedReward.pool)
//                           .filter((el) =>
//                             positionsResult
//                               ?.filter((el: any) => el.incentive && el.transfered)
//                               .map((el: any) =>
//                                 result
//                                   ?.filter((pos) => selectedReward.rewardToken in pos.rewards)
//                                   .map((pos) => pos.rewards[selectedReward.rewardToken].incentives)
//                                   .reduce((arr, v) => (arr.push(...v), arr), [])
//                                   .filter((inc) => el.incentive === inc.id)
//                               )
//                               .reduce((arr, v) => (arr.push(...v), arr), [])
//                               .some((inc) => inc.id === el.incentive)
//                           )
//                           .map((el, i) => (
//                             <li
//                               key={i}
//                               style={{
//                                 // height: '40px',
//                                 display: 'flex',
//                                 padding: '10px 1rem 10px 2rem',
//                                 lineHeight: '27px',
//                                 // justifyContent: 'space-between'
//                               }}
//                             >
//                               <div
//                                 style={{
//                                   // padding: '4px 8px',
//                                   borderRadius: '6px',
//                                   flex: 1,
//                                   fontSize: '14px',
//                                   // backgroundColor: 'rgba(60, 59, 59, 0.54)',
//                                 }}
//                               >
//                                 {/* {getPosition(el.tokenId, selectedIncentive)} */}
//                                 {el.earned}
//                               </div>

//                               <div
//                                 style={{
//                                   // marginLeft: 'auto',
//                                   flex: 1,
//                                   // padding: '4px 8px',
//                                   borderRadius: '6px',
//                                   fontSize: '14px',
//                                 }}
//                               >
//                                 {selectedReward &&
//                                   new Date(
//                                     result
//                                       ?.filter((pos) => selectedReward.rewardToken in pos.rewards)
//                                       .filter((pos) =>
//                                         pos.rewards[selectedReward?.rewardToken].incentives.some(
//                                           (inc) => inc.id === el.incentive
//                                         )
//                                       )
//                                       .map((pos) =>
//                                         pos.rewards[selectedReward?.rewardToken].incentives.filter(
//                                           (inc) => inc.id === el.incentive
//                                         )
//                                       )[0][0].startTime * 1000
//                                   )
//                                     .toLocaleString()
//                                     .split(',')[0]}
//                               </div>
//                               <div
//                                 style={{
//                                   // marginLeft: 'auto',
//                                   flex: 1,
//                                   // padding: '4px 8px',
//                                   borderRadius: '6px',
//                                   fontSize: '14px',
//                                 }}
//                               >
//                                 {selectedReward &&
//                                   (result
//                                     .filter((pos) => selectedReward.rewardToken in pos.rewards)
//                                     .filter((pos) =>
//                                       pos.rewards[selectedReward?.rewardToken].incentives.some(
//                                         (inc) => inc.id === el.incentive
//                                       )
//                                     )
//                                     .map((pos) =>
//                                       pos.rewards[selectedReward?.rewardToken].incentives.filter(
//                                         (inc) => inc.id === el.incentive
//                                       )
//                                     )[0][0].endTime >
//                                   new Date().getTime() / 1000
//                                     ? getCountdownTime(
//                                         result
//                                           .filter((pos) => selectedReward.rewardToken in pos.rewards)
//                                           .filter((pos) =>
//                                             pos.rewards[selectedReward?.rewardToken].incentives.some(
//                                               (inc) => inc.id === el.incentive
//                                             )
//                                           )
//                                           .map((pos) =>
//                                             pos.rewards[selectedReward?.rewardToken].incentives.filter(
//                                               (inc) => inc.id === el.incentive
//                                             )
//                                           )[0][0].endTime,
//                                         now
//                                       )
//                                     : 'Ended')}
//                               </div>
//                               <div
//                                 style={{
//                                   flex: 2,
//                                   display: 'flex',
//                                 }}
//                               >
//                                 {el.staked ? (
//                                   <button
//                                     disabled={positionStateLoader}
//                                     style={{
//                                       backgroundColor: 'rgba(60, 59, 59, 0.54)',
//                                       padding: '5px',
//                                       border: 'none',
//                                       color: 'white',
//                                       borderRadius: '4px',
//                                       width: '100%',
//                                       marginRight: '5px',
//                                     }}
//                                     onClick={() => {
//                                       setPositionStateLoader('staking')
//                                       getRewardsHandler(
//                                         el,
//                                         result
//                                           ?.filter((pos) => selectedReward.rewardToken in pos.rewards)
//                                           .filter((pos) =>
//                                             pos.rewards[selectedReward?.rewardToken].incentives.some(
//                                               (inc) => inc.id === el.incentive
//                                             )
//                                           )
//                                           .map((pos) =>
//                                             pos.rewards[selectedReward?.rewardToken].incentives.filter(
//                                               (inc) => inc.id === el.incentive
//                                             )
//                                           )[0][0]
//                                       )
//                                     }}
//                                   >
//                                     {/* {positionStateLoader === 'staking' ? (
//                                       <span
//                                         style={{
//                                           display: 'flex',
//                                           alignItems: 'center',
//                                           justifyContent: 'center',
//                                         }}
//                                       >
//                                         <span
//                                           style={{
//                                             marginRight: '10px',
//                                           }}
//                                         >
//                                           <Loader stroke={'white'} style={{ display: 'block' }} />
//                                         </span>
//                                         <span>Getting</span>
//                                       </span>
//                                     ) : (
//                                       <span>Get rewards</span>
//                                     )} */}
//                                     <span>Get rewards</span>
//                                   </button>
//                                 ) : (
//                                   <button
//                                     disabled={positionStateLoader}
//                                     style={{
//                                       backgroundColor: 'rgba(60, 59, 59, 0.54)',
//                                       padding: '5px',
//                                       border: 'none',
//                                       color: 'white',
//                                       borderRadius: '4px',
//                                       width: '100%',
//                                       marginRight: '5px',
//                                     }}
//                                     onClick={() => {
//                                       setPositionStateLoader('staking')
//                                       stakeHandler(
//                                         [el],
//                                         result
//                                           ?.filter((pos) => selectedReward.rewardToken in pos.rewards)
//                                           .filter((pos) =>
//                                             pos.rewards[selectedReward?.rewardToken].incentives.some(
//                                               (inc) => inc.id === el.incentive
//                                             )
//                                           )
//                                           .map((pos) =>
//                                             pos.rewards[selectedReward?.rewardToken].incentives.filter(
//                                               (inc) => inc.id === el.incentive
//                                             )
//                                           )[0][0]
//                                       )
//                                     }}
//                                   >
//                                     <span>Stake again</span>
//                                   </button>
//                                 )}
//                                 <button
//                                   disabled={positionStateLoader}
//                                   style={{
//                                     backgroundColor: 'rgba(60, 59, 59, 0.54)',
//                                     padding: '5px',
//                                     border: 'none',
//                                     color: 'white',
//                                     borderRadius: '4px',
//                                     width: '100%',
//                                     marginLeft: '5px',
//                                   }}
//                                   onClick={() => {
//                                     setPositionStateLoader('withdraw')
//                                     withdrawHandler(
//                                       el,
//                                       result
//                                         ?.filter((pos) => selectedReward.rewardToken in pos.rewards)
//                                         .filter((pos) =>
//                                           pos.rewards[selectedReward?.rewardToken].incentives.some(
//                                             (inc) => inc.id === el.incentive
//                                           )
//                                         )
//                                         .map((pos) =>
//                                           pos.rewards[selectedReward?.rewardToken].incentives.filter(
//                                             (inc) => inc.id === el.incentive
//                                           )
//                                         )[0][0]
//                                     )
//                                   }}
//                                 >
//                                   <span>Unstake</span>
//                                 </button>
//                               </div>
//                             </li>
//                           ))}
//                     </ul>
//                   ) : (
//                     <div
//                       style={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         width: '100%',
//                         height: '100%',
//                         minHeight: 'calc(47px * 8 - 6px)',
//                         maxHeight: 'calc(47px * 8 - 6px)',
//                         margin: '1rem 0',
//                       }}
//                     >
//                       <Loader stroke={'white'} size={'30px'} />
//                       <div
//                         style={{
//                           marginTop: '1rem',
//                         }}
//                       >
//                         Updating
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div
//                   style={{
//                     display: 'flex',
//                     padding: '16px 0 0 0',
//                     color: '#aeaeae',
//                     fontSize: '12px',
//                     textTransform: 'uppercase',
//                     lineHeight: '28px',
//                   }}
//                 >
//                   <div
//                     style={{
//                       flex: 1,
//                     }}
//                   >
//                     reward
//                   </div>
//                   <div
//                     style={{
//                       flex: 1,
//                     }}
//                   >
//                     starts in
//                   </div>
//                   <div
//                     style={{
//                       flex: 1,
//                     }}
//                   >
//                     ends after
//                   </div>
//                   <div
//                     style={{
//                       flex: 1,
//                     }}
//                   ></div>
//                 </div>
//                 <div>
//                   <ul
//                     style={{
//                       padding: 0,
//                       overflow: 'auto',
//                       minHeight: 'calc(47px * 8 + 10px)',
//                       maxHeight: 'calc(47px * 8 + 10px)',
//                       margin: '1rem -2rem',
//                       marginBottom: 0,
//                     }}
//                   >
//                     {selectedReward?.incentives
//                       .filter((el) => el.startTime * 1000 > new Date().getTime())
//                       .map((el, i) => (
//                         <li
//                           key={i}
//                           style={{
//                             // height: '40px',
//                             display: 'flex',
//                             padding: '10px 1rem 10px 2rem',
//                             lineHeight: '27px',
//                             // justifyContent: 'space-between'
//                           }}
//                         >
//                           <div
//                             style={{
//                               // padding: '4px 8px',
//                               borderRadius: '6px',
//                               flex: 1,
//                               fontSize: '14px',
//                               // backgroundColor: 'rgba(60, 59, 59, 0.54)',
//                             }}
//                           >
//                             {el.rewardLeft}
//                           </div>

//                           <div
//                             style={{
//                               // marginLeft: 'auto',
//                               flex: 1,
//                               // padding: '4px 8px',
//                               borderRadius: '6px',
//                               fontSize: '14px',
//                             }}
//                           >
//                             {getCountdownTime(el.startTime, now)}
//                             {/* {new Date(el.startTime * 1000).toLocaleString().split(',')[0]} */}
//                           </div>
//                           <div
//                             style={{
//                               // marginLeft: 'auto',
//                               flex: 1,
//                               // padding: '4px 8px',
//                               borderRadius: '6px',
//                               fontSize: '14px',
//                             }}
//                           >
//                             {`${getCountdownTime(el.endTime, now).split('d')[0]}`}
//                             {/* {new Date(el.endTime * 1000).toLocaleString().split(',')[0]} */}
//                           </div>
//                           <div
//                             style={{
//                               flex: 1,
//                             }}
//                           >
//                             <button
//                               style={{
//                                 backgroundColor: 'rgba(60, 59, 59, 0.54)',
//                                 padding: '5px',
//                                 border: 'none',
//                                 color: 'white',
//                                 borderRadius: '4px',
//                                 width: '100%',
//                               }}
//                               onClick={() => {
//                                 setStakingState(1)
//                                 setSelectedIncentive({
//                                   ...el,
//                                 })
//                               }}
//                             >
//                               <span>Stake</span>
//                             </button>
//                           </div>
//                         </li>
//                       ))}
//                   </ul>
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     )
//   }
