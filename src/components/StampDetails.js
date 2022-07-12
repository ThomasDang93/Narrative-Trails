
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
  const { uri } = useParams();
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
        zip: ""
  });


  useEffect(() => {
    getStamp();
  },[active])

  async function getStamp() {
    const contract = connectContract();
    let resourceURI = uri;
    let stampMetaData;
    await fetch(resourceURI)
        .then(response => response.json())
        .then(data => {
            stampMetaData = {
                name: data.name,
                description: data.description,
                src: data.media_uri_image,
                city: data.properties.city,
                country: data.properties.country,
                lattitude: data.properties.lattitude,
                longitude: data.properties.longitude,
                state: data.properties.state,
                zip: data.properties.zip

        }
            })
    setState({
        ...state,
        name: stampMetaData.name,
        description: stampMetaData.description,
        src: stampMetaData.src,
        city: stampMetaData.city,
        country: stampMetaData.country,
        lattitude: stampMetaData.lattitude,
        longitude: stampMetaData.longitude,
        state: stampMetaData.state,
        zip: stampMetaData.zip
    })
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
      <h2>Stamp</h2>
      <img key={ state.src } src={ state.src } alt="no image" width="100" height="100"/>
      <p>Name: {state.name}</p>
      <p>Description: {state.description}</p>
      <p>City: {state.city}</p>
      <p>State: {state.state}</p>
      <p>Country: {state.country}</p>
      <p>Zip: {state.zip}</p>
      <p>Lattitude: {state.lattitude}</p>
      <p>Longitude: {state.longitude}</p>
      <div>&nbsp;</div>
    </div>
  );
}
 
export default <StampDetails/>;