
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import './components.css';
import LetterBoxingABI from "./LetterBoxing.json";
import StampList from "./StampList";
import * as  constants from './constants.js';

export const injected = new InjectedConnector();

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

function LetterBoxDetails () {
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
        stampBoxList: []
  });


  useEffect(() => {
    getLetterBox();
  },[active])

  async function getLetterBox() {
    const contract = connectContract();
    console.log("ID: ", id)
    let iboxURI = await contract.letterboxMetadataURI(id);
    console.log("iboxURI = ", iboxURI)
    let letterboxList;
    await fetch(iboxURI)
        .then(response => response.json())
        .then(data => {
            letterboxList = {
                name: data.name,
                description: data.description,
                src: data.media_uri_image,
                city: data.properties.city,
                country: data.properties.country,
                lattitude: data.properties.lattitude,
                longitude: data.properties.longitude,
                state: data.properties.state,
                zip: data.properties.zip

        }})

    console.log("ID: ", id)
    let resources = await contract.getFullResources(id);
    let stampList = [];
    for(let i = 1; i < resources.length; i++) {
        let resourceURI = resources[i].metadataURI;
        console.log("JSON URI: ", resourceURI);
        await fetch(resourceURI)
            .then(response => response.json())
            .then(data => {
                    stampList.push({
                      src: data.media_uri_image
                    });
                })
    }
    setState({
        ...state,
        name: letterboxList.name,
        description: letterboxList.description,
        src: letterboxList.src,
        city: letterboxList.city,
        country: letterboxList.country,
        lattitude: letterboxList.lattitude,
        longitude: letterboxList.longitude,
        state: letterboxList.state,
        zip: letterboxList.zip,
        stampBoxList: stampList
    })
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
        await contract.letterboxToStamp(account, id, {gasLimit:500000});
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
        <form>
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
          <h2>Resources</h2>
          <StampList stampList={state}/>  
       </form>
    </div>
  );
}
 
export default <LetterBoxDetails/>;