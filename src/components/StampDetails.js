
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import './components.css';
import LetterBoxingABI from "./LetterBoxing.json";
import * as  constants from './constants.js';

export const injected = new InjectedConnector();

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

function StampDetails () {
  const { id } = useParams();
  const {
    active,
    activate,
    account,
    library: provider,
  } = useWeb3React();
  const [state, setState] = useState(    {
        name: "",
        description: "",
        src: "",
        city: "",
        country: "",
        lattitude: "",
        longitude: "",
        state: "",
        zip: "",
        letterBoxList: []
  });


  useEffect(() => {
    getLetterBox();
  },[active])

  async function getLetterBox() {
    const contract = connectContract();
    console.log("ID: ", id)
    let resources = await contract.getFullResources(id);
    for(let i = 1; i < resources.length; i++) {
        let resourceURI = resources[i].metadataURI;
        console.log("JSON URI: ", resourceURI);
        await fetch(resourceURI)
            .then(response => response.json())
            .then(data => {
                    stampList.push({src: data.media_uri_image});
                })
    }
    // setState({
    //     ...state,
    //     name: letterboxList.name,
    //     description: letterboxList.description,
    //     src: letterboxList.src,
    //     city: letterboxList.city,
    //     country: letterboxList.country,
    //     lattitude: letterboxList.lattitude,
    //     longitude: letterboxList.longitude,
    //     state: letterboxList.state,
    //     zip: letterboxList.zip
    // })
}

async function foundLetterbox() {
    if (active) {
      console.log(provider.getSigner())
      const signer = provider.getSigner();
      const contractAddress = DEPLOYED_CONTRACT_ADDRESS;
      const contract = new ethers.Contract(contractAddress, LetterBoxingABI["abi"], signer);
      try{
        let letterboxResources = await contract.getFullResources(id);
        console.log('letterbox resource count: ', letterboxResources.length);
        await contract.stampToLetterbox(account, id, true);
        await contract.letterboxToStamp(account, id);
        letterboxResources = await contract.getFullResources(id);

      } catch(error) {
        console.log(error);
      }
        
    } else {
      console.log("Please install MetaMask");
    }
  }

function connectContract() {
    const signer = provider.getSigner();
    const contractAddress = DEPLOYED_CONTRACT_ADDRESS;
    const contract = new ethers.Contract(contractAddress, LetterBoxingABI["abi"], signer);
    return contract;
  }
  return (
    <div>
        {console.log("State: ", state)}
      <h2>Letter Box - { id }</h2>
      <img key={ state.src } src={ state.src } alt="no image" width="100" height="100"/>
      <p>Name: {state.name}</p>
      <p>Description: {state.description}</p>
      <p>City: {state.city}</p>
      <p>State: {state.state}</p>
      <p>Country: {state.country}</p>
      <p>Zip: {state.zip}</p>
      <p>Lattitude: {state.lattitude}</p>
      <p>Longitude: {state.longitude}</p>
      <button onClick={() => foundLetterbox()}>I found it!</button> 
      <div>&nbsp;</div>
    </div>
  );
}
 
export default <StampDetails/>;