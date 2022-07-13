import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import LetterBoxList from './LetterBoxList';
import './components.css';
import LetterBoxingABI from "./LetterBoxing.json";
import * as  constants from './constants.js';

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

export const injected = new InjectedConnector();

function FindLetterbox() {
    const [hasMetamask, setHasMetamask] = useState(false);
    const {
        active,
        activate,
        account,
        library: provider,
      } = useWeb3React();
    const [state, setState] = useState(    {
        letterBoxList: []
    });
    useEffect(() => {
    if(active) {
        getNFTs();
    }
    },[active]);

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
            letterBoxList: letterBoxList
        });
      }

      useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
          setHasMetamask(true);
        }
      });

      function connectContract() {
        const signer = provider.getSigner();
        const contractAddress = DEPLOYED_CONTRACT_ADDRESS;
        const contract = new ethers.Contract(contractAddress, LetterBoxingABI["abi"], signer);
        return contract;
      }
      
    
    return (
        <div >
            {console.log('State Context: ', state)}
            {console.log('Account Context: ', account)}
            {console.log('Account Active: ', active)}
            {console.log('State Context: ', state)}
            {console.log('Account Context: ', account)}
            {console.log('Account Active: ', active)}
            {hasMetamask ? (
                active ? (
                <div className="top-right">Connected</div>
                ) : (
                    <button className="top-right" onClick={() => connect()}>Connect</button>
                )
            ) : (
                <div className="top-right">Please Install Metamask</div>
            )}
            {
                active ? 
                <div>
                    <div>&nbsp;</div>
                    <h1 className="center">Letterboxes</h1>
                    <LetterBoxList letterbox={state}/>
                </div> 
                : <h1 className="center">Connect Wallet</h1>
            }
           
        </div>
    );
}
export default <FindLetterbox/>