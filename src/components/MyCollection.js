import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import './components.css';
import LetterBoxingABI from "./LetterBoxing.json";

const DEPLOYED_CONTRACT_ADDRESS = '0xB291247E38F4FcBaD7C6741Dc25F41bA5702f9c3';

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
        name: "",
        lattitude: "",
        longitude: "",
        description: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        isStamp: true,
        selectedAddress: "",
        balance: "",
        errors: "",
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
          let userStamp = await contract.stampsHeldBy(account); //returns tokenId
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
            let iboxResources = await contract.getFullResources(
                allLetterboxes[i].toNumber()
            );

            let iboxURI = iboxResources[0].metadataURI;
            console.log("iboxURI = ", iboxURI)
            //fetch on the above url to actually retrieve json as json
            await fetch(iboxURI)
                .then(response => response.json())
                .then(data => {
                    letterBoxList.push({src: data.media_uri_image})
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
                {<div>
                    {state.letterBoxList.length > 0 ? 
                    state.letterBoxList.map(function(imageProps) {
                        return (
                            <img key={ imageProps.src } src={ imageProps.src } alt="no image" width="100" height="100"/>
                        );
                    })
                    : ""}

                </div>}
                <div>&nbsp;</div>
                <h1>Stamps</h1>
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