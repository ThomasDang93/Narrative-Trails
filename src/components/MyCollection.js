import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import './components.css';
import LetterBoxingABI from "./LetterBoxing.json";
import LetterBoxList from "./LetterBoxList";
import MyStamp from "./MyStamp";
import * as  constants from './constants.js';

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

export const injected = new InjectedConnector();

function MyCollection() {
    const [hasMetamask, setHasMetamask] = useState(false);
    const {
        active,
        activate,
        account,
        library: provider,
      } = useWeb3React();
    const [state, setState] = useState(    {
        letterBoxList: [],
        stampList: []
    });
    
    async function connect() {
        if (typeof window.ethereum !== "undefined") {
          try {
            await activate(injected);
            setHasMetamask(true);
          } catch (e) {
            console.log(e);
          }
        }
      }

      async function getNFTs() {
          const contract = connectContract();
          let userStamp = await contract.stampHeldBy(account); //returns tokenId
          userStamp = userStamp.toNumber();
          console.log("userStamp = ", userStamp);
          let userResources = await contract.getFullResources(userStamp); //returns array of resources
          let userJSON = userResources[0].metadataURI;
          console.log("userJson = ", userJSON);

          let stampList = [];
          //get stamps
          await fetch(userJSON)
                .then(response => response.json())
                .then(data => {
                    stampList.push({src: data.media_uri_image})
                })

          //get letterboxes
          let allLetterboxes = await contract.letterboxList(); //array of tokenIds
          let letterBoxList = [];
          for (let i = 0; i < allLetterboxes.length; i++) {
            console.log("letterbox ID: ", allLetterboxes[i].toNumber());
            let iboxResources = await contract.getFullResources(
                allLetterboxes[i].toNumber()
            );

            let iboxURI = iboxResources[0].metadataURI;
            console.log("iboxURI = ", iboxURI)
            //fetch on the above url to actually retrieve json as json
            await fetch(iboxURI)
                .then(response => response.json())
                .then(data => {
                    letterBoxList.push({
                      id: allLetterboxes[i].toNumber(),
                      name: data.name,
                      description: data.description,
                      src: data.media_uri_image,
                      city: data.properties.city,
                      country: data.properties.country,
                      lattitude: data.properties.lattitude,
                      longitude: data.properties.longitude,
                      state: data.properties.state,
                      zip: data.properties.zip
                    })
                })

        }
        setState({
            ...state,
            letterBoxList: letterBoxList,
            stampList: stampList
        });
      }

      useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
          setHasMetamask(true);
        }
      });

      useEffect(() => {
        if(active) {
            getNFTs();
        }
      },[account])

      function connectContract() {
        const signer = provider.getSigner();
        const contractAddress = DEPLOYED_CONTRACT_ADDRESS;
        const contract = new ethers.Contract(contractAddress, LetterBoxingABI["abi"], signer);
        return contract;
      }
      
    
    return (
        <div>
            {console.log('State Context: ', state)}
            {console.log('Account Context: ', account)}
            {console.log('Account Active: ', active)}
            {hasMetamask ? (
                active ? (
                "Connected! "
                ) : (
                <button onClick={() => connect()}>Connect</button>
                )
            ) : (
                "Please install metamask"
            )}
            {active ? 
            <form >
                <div>&nbsp;</div>
                <h1>Letterboxes</h1>
                <LetterBoxList letterbox={state} />
                <div>&nbsp;</div>
                <h1>Stamps</h1>
                {/* <MyStamp stamp={state} /> */}
                {<div>
                    {state.stampList.length > 0 ? 
                    state.stampList.map(function(imageProps) {
                        return (
                            <img key={ imageProps.src } src={ imageProps.src } alt="no image" width="100" height="100"/>
                        );
                    })
                    : ""}
                    
                </div>} 
            </form> : ""}
        </div>
    );
}
export default <MyCollection/>