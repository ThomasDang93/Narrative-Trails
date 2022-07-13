import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import './components.css';
import LetterBoxingABI from "./LetterBoxing.json";
import fleek from '@fleekhq/fleek-storage-js';  
import * as  constants from './constants.js';
import MyStamp from './MyStamp';

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

export const injected = new InjectedConnector();

function MintStamp() {
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
        stampList: []
    });
    const [file, setFile] = useState({});
    const handleSubmit = async(event) => {
        event.preventDefault();
        if(handleValidation()) {
            const formData = new FormData();
            formData.append('File', file);
            console.log(formData.get('File'));
            const pictureResult = await fleek.upload( {
                apiKey: process.env.REACT_APP_FLEEK_API_KEY,
                apiSecret: process.env.REACT_APP_FLEEK_API_SECRET,
                key: `narrativetrails/letterbox-stamp/` + uuid(),
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
                    isLetterBox: state.isStamp
                }
            };

            const metaDataResult = await fleek.upload( {
                apiKey: process.env.REACT_APP_FLEEK_API_KEY,
                apiSecret: process.env.REACT_APP_FLEEK_API_SECRET,
                key: `narrativetrails/letterbox-stamp-metadata/` + uuid(),
                data: JSON.stringify(metaData),
              });
            console.log(metaDataResult);
            const contract = connectContract();
            contract.mintStamp(account, metaDataResult.publicUrl);

        } else {
            alert("Please enter value for mandatory fields");
        }
    }

    function handleValidation() {
        let fields = state;
        let errors = {};
        let formIsValid = true;
    
        if (!fields["name"]) {
          formIsValid = false;
          errors["name"] = "Cannot be empty";
        }

        if (!fields["description"]) {
            formIsValid = false;
            errors["description"] = "Cannot be empty";
        }
        if (!file["type"]) {
            formIsValid = false;
            errors["type"] = "Cannot be empty";
        }
        setState({ ...state, errors: errors });
        return formIsValid;
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
          console.log("userJson = ", userJSON)
          let stampList = [];
          //get stamps
          await fetch(userJSON)
                .then(response => response.json())
                .then(data => {
                    stampList.push({
                        id: userStamp,
                        name: data.name,
                        description: data.description,
                        src: data.media_uri_image
                    })
                })
        setState({
            ...state,
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
      },[active === true])

      function connectContract() {
        const signer = provider.getSigner();
        const contractAddress = DEPLOYED_CONTRACT_ADDRESS;
        const contract = new ethers.Contract(contractAddress, LetterBoxingABI["abi"], signer);
        return contract;
      }

      function uuid() {
        var temp_url = URL.createObjectURL(new Blob());
        var uuid = temp_url.toString();
        URL.revokeObjectURL(temp_url);
        return uuid.substr(uuid.lastIndexOf('/') + 1); // remove prefix (e.g. blob:null/, blob:www.test.com/, ...)
     }
      
    
    return (
        <div>
            {console.log('State Context: ', state)}
            {console.log('File Context: ', file)}
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
             {console.log('Stamp URL: ', state.stampList)}
            {active ? 
            <form onSubmit={handleSubmit}>
                <h1>Mint a Stamp</h1>
                <div>&nbsp;</div>
                <label htmlFor="letter-stamp-name">Name:
                    <input type="text" name="name" className="form-control" id="letter-stamp-name" onChange={handleNameChange}/>
                </label>
                <label htmlFor="letter-stamp-description">Description:
                    <textarea type="text" name="description" rows="4" cols="50"className="form-control" id="letter-stamp-description" onChange={handleDescriptionChange}/>
                </label>
                <label htmlFor="letter-stamp-lattitude">Lattitude:
                    <input type="text" name="lattitude" className="form-control" id="letter-stamp-lattitude" onChange={handleLattitudeChange}/>
                </label>
                <label htmlFor="letter-stamp-longitude">Longitude:
                    <input type="text" name="longitude" className="form-control" id="letter-stamp-longitude" onChange={handleLongitudeChange}/>
                </label>
                <label htmlFor="letter-stamp-city">City:
                    <input type="text" name="city" className="form-control" id="letter-stamp-city"onChange={handleCityChange}/>
                </label>
                <label htmlFor="letter-stamp-state">State:
                    <input type="text" name="state" className="form-control" id="letter-stamp-state"onChange={handleStateChange}/>
                </label>
                <label htmlFor="letter-stamp-country">Country: 
                    <input type="text" name="country" className="form-control" id="letter-stamp-country"onChange={handleCountryChange}/>
                </label>
                <label htmlFor="letter-stamp-zip">Zip Code:
                    <input type="text" name="zip" className="form-control" id="letter-stamp-zip"onChange={handleZipChange}/>
                </label>
                <label htmlFor="letter-stamp-upload">Upload: 
                    <input type="file" className="form-control" id="letter-stamp-upload"onChange={handleFileChange}/>
                </label>
                <div>&nbsp;</div>
                <button type="submit" className="btn btn-success">Mint</button>
                <div>&nbsp;</div>
                {<div>
                    <h2>Your Current Stamp</h2>
                    <MyStamp stamp={state}/>
                </div>}
            </form> : <h1 className="center">Connect Wallet</h1>}
        </div>
    );
}
export default <MintStamp/>