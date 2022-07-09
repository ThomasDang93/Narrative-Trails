import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import './components.css';
import LetterBoxingABI from "./LetterBoxing.json";
import fleek from '@fleekhq/fleek-storage-js';  

const DEPLOYED_CONTRACT_ADDRESS = '0xD5565022DE11F6663bfBE872e800D5129C0e20d3';

export const injected = new InjectedConnector();

function LetterPlanting() {
    const [hasMetamask, setHasMetamask] = useState(false);
    const {
        active,
        activate,
        chainId,
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
        isLetterBox: true,
        selectedAddress: "",
        balance: "",
        ipfsurl: ""
    });
    const [file, setFile] = useState({});
    const handleSubmit = async(event) => {
        event.preventDefault();
        if(state.name !== "" && state.lattitude !== "" && state.longitude !== "" && 
            state.description !== "" && state.city !== "" && state.state !== ""
            && state.country !== "" && state.zip !== "" && state.isLetterBox === true) {
            const formData = new FormData();
            formData.append('File', file);
            console.log(formData.get('File'));


            const pictureResult = await fleek.upload( {
                apiKey: process.env.REACT_APP_FLEEK_API_KEY,
                apiSecret: process.env.REACT_APP_FLEEK_API_SECRET,
                key: `narrativetrails/letterbox`,
                data: formData.get('File'),
              });

            console.log(pictureResult);
            let metaData = {
                name: state.name,
                description: state.description,
                media_uri_image: pictureResult.publicUrl,
                properties: {
                    lattitude: state.lattitude,
                    longitude: state.longitude,
                    city: state.city,
                    state: state.state,
                    country: state.country,
                    zip: state.zip,
                    isLetterBox: state.isLetterBox
                }
            };

            const metaDataResult = await fleek.upload( {
                apiKey: process.env.REACT_APP_FLEEK_API_KEY,
                apiSecret: process.env.REACT_APP_FLEEK_API_SECRET,
                key: `narrativetrails/letterbox-metadata`,
                data: JSON.stringify(metaData),
              });
           console.log(metaDataResult);
            // const mdf = await addFile(ipfsRemote, JSON.stringify(metaData)); // Or use IPFS local
            // console.log(mdf);

        } else {
            alert("Please enter value for all fields");
        }
    }

    function handleFileChange(event) {
        setFile(event.target.files[0]);
    }
    function handleLattitudeChange(event) {
        setState({...state, lattitude: event.target.value});
    }
    function handleLongitudeChange(event) {
        setState({...state, longitude: event.target.value});
    }
    function handleCityChange(event) {
        setState({...state, city: event.target.value});
    }
    function handleStateChange(event) {
        setState({...state, state: event.target.value});
    }
    function handleCountryChange(event) {
        setState({...state, country: event.target.value});
    }
    function handleZipChange(event) {
        setState({...state, zip: event.target.value});
    }
    function handleNameChange(event) {
        setState({...state, name: event.target.value});
    }
    function handleDescriptionChange(event) {
        setState({...state, description: event.target.value});
    }


    async function addFile(ipfs, fileContent) {
        // 1. Add file to ipfs
        const cid = await ipfs.add(fileContent);

        // 2. Get file status from ipfs
        const fileStat = await ipfs.files.stat("/ipfs/" + cid.path);

        return {
            cid: cid.path,
            size: fileStat.cumulativeSize
        };
    }

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

      async function execute() {
        if (active) {
          console.log(provider.getSigner())
          const signer = provider.getSigner();
          const contractAddress = DEPLOYED_CONTRACT_ADDRESS;
          const contract = new ethers.Contract(contractAddress, LetterBoxingABI["abi"], signer);
          try {
            //let jsonuri = await contract.getFullResources(1);
            // console.log("json uri: ", jsonuri[0].metadataURI);
             //contract.mintStamp('0x609cB97e273011Ab5D56e73cF880D2880F9922f6', 'https://crustipfs.xyz/ipfs/QmPRADZ7z3wKpcA1N15CJevovVR6eNkwTMvzjxVy1PcTTw')
            //let value = await contract.feeSetter(0);
            //let value2 = await contract.feeGetter();
            //console.log(value2.toNumber());
            //let value = await contract.isPaused();
            //console.log(value);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("Please install MetaMask");
        }
      }

      useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
          setHasMetamask(true);
        }
      });
    
    return (
        <div>
            {console.log('State Context: ', state)}
            {console.log('File Context: ', file)}
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
            <form onSubmit={handleSubmit}>
                <button onClick={() => execute()}>Execute</button>
                <div>&nbsp;</div>
                <label htmlFor="letter-plant-name">Name:
                    <input type="text" name="name" className="form-control" id="letter-plant-name" onChange={handleNameChange}/>
                </label>
                <label htmlFor="letter-plant-description">Description:
                    <textarea type="text" name="description" rows="4" cols="50"className="form-control" id="letter-plant-description" onChange={handleDescriptionChange}/>
                </label>
                <label htmlFor="letter-plant-lattitude">Lattitude:
                    <input type="text" name="lattitude" className="form-control" id="letter-plant-lattitude" onChange={handleLattitudeChange}/>
                </label>
                <label htmlFor="letter-plant-longitude">Longitude:
                    <input type="text" name="longitude" className="form-control" id="letter-plant-longitude" onChange={handleLongitudeChange}/>
                </label>
                <label htmlFor="letter-plant-city">City:
                    <input type="text" name="city" className="form-control" id="letter-plant-city"onChange={handleCityChange}/>
                </label>
                <label htmlFor="letter-plant-state">State:
                    <input type="text" name="state" className="form-control" id="letter-plant-state"onChange={handleStateChange}/>
                </label>
                <label htmlFor="letter-plant-country">Country: 
                    <input type="text" name="country" className="form-control" id="letter-plant-country"onChange={handleCountryChange}/>
                </label>
                <label htmlFor="letter-plant-zip">Zip Code:
                    <input type="text" name="zip" className="form-control" id="letter-plant-zip"onChange={handleZipChange}/>
                </label>
                <label htmlFor="letter-plant-upload">Upload: 
                    <input type="file" className="form-control" id="letter-plant-upload"onChange={handleFileChange}/>
                </label>
                <div>&nbsp;</div>
                <button type="submit" className="btn btn-success">Mint</button>
            </form> : ""}
            
        </div>
    );
}
export default <LetterPlanting/>