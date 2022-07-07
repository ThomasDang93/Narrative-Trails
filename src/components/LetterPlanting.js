import React, { useState } from 'react';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';
import { Keyring } from '@polkadot/keyring';
import { Buffer } from 'buffer';
import './components.css';
import LetterBoxingABI from "./LetterBoxing.json";
const crustChainEndpoint = 'wss://rpc.crust.network'; // More endpoints: https://github.com/crustio/crust-apps/blob/master/packages/apps-config/src/endpoints/production.ts#L9
const ipfsW3GW = 'https://crustipfs.xyz'; // More web3 authed gateways: https://github.com/crustio/ipfsscan/blob/main/lib/constans.ts#L29
const crustSeeds = 'abc efg hijk';//process.env.REACT_APP_CRUST_SEED; //process.env.CRUST_SEED; // Create account(seeds): https://wiki.crust.network/docs/en/crustAccount
const api = new ApiPromise({
    provider: new WsProvider(crustChainEndpoint),
    typesBundle: typesBundleForPolkadot,
});
const DEPLOYED_CONTRACT_ADDRESS = '0x1D467E6201DbB81a91f2Cc46186bD382DE7a0F68';

function LetterPlanting() {
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

            //[Gateway] Create IPFS instance
            const pair = ethers.Wallet.createRandom();
            const sig = await pair.signMessage(pair.address);
            const authHeaderRaw = `eth-${pair.address}:${sig}`;
            const authHeader = Buffer.from(authHeaderRaw).toString('base64');
            const ipfsRemote = create({
                url: `${ipfsW3GW}/api/v0`,
                headers: {
                    authorization: `Basic ${authHeader}`
                }
            });

            // Add IPFS
            const rst = await addFile(ipfsRemote, formData.get('File')); // Or use IPFS local
            console.log(rst);
            setState({ 
                ...state,
                ipfsurl: 'https://crustipfs.xyz/ipfs/' + rst.cid
            });
            let metaData = {
                name: state.name,
                description: state.description,
                media_uri_image: 'https://crustipfs.xyz/ipfs/' + rst.cid,
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
           
            const mdf = await addFile(ipfsRemote, JSON.stringify(metaData)); // Or use IPFS local
            console.log(mdf);
            // Place storage order
            await placeStorageOrder(rst.cid, rst.size);

            // // Query storage status
            // // Query forever here ...
            // while (true) {
            //     const orderStatus = (await getOrderState(rst.cid)).toJSON();
            //     console.log('Replica count: ', orderStatus['reported_replica_count']); // Print the replica count
            //     await new Promise(f => setTimeout(f, 1500)); // Just wait 1.5s for next chain-query
            // }

        } else {
            alert("Please enter value for all mandatory fields");
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

    async function connectToMetamask() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const balance = await provider.getBalance(accounts[0]);
        const balanceInEther = ethers.utils.formatEther(balance);
        const lbcontract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider);
        let jsonuri = await lbcontract.getFullResources(1);
        console.log("json uri: ", jsonuri[0].metadataURI);
        setState({ ...state, selectedAddress: accounts[0], balance: balanceInEther });
        
    }

    async function placeStorageOrder(fileCid, fileSize) {
        // 1. Construct place-storage-order tx
        const tips = '0';
        const memo = '';
        const tx = api.tx.market.placeStorageOrder(fileCid, fileSize, parseInt(tips), memo);
        console.log(tx)
        // 2. Load seeds(account)
        const kr = new Keyring({ type: 'sr25519' });
        const krp = kr.addFromUri(crustSeeds);
        console.log(krp)
        // 3. Send transaction
        await api.isReadyOrError;
        return new Promise((resolve, reject) => {
            tx.signAndSend(krp, ({events = [], status}) => {
                console.log(`💸  Tx status: ${status.type}, nonce: ${tx.nonce}`);
    
                if (status.isInBlock) {
                    events.forEach(({event: {method, section}}) => {
                        if (method === 'ExtrinsicSuccess') {
                            console.log(`✅  Place storage order success!`);
                            resolve(true);
                        }
                    });
                } else {
                    // Pass it
                }
            }).catch(e => {
                reject(e);
            })
        });
    }

    // async function getOrderState(cid) {
    //     await api.isReadyOrError;
    //     return await api.query.market.filesV2(cid);
    // }

    function renderMetamask() {
        if (!state.selectedAddress) {
          return (
            <button onClick={() => connectToMetamask()}>Connect to Metamask</button>
          )
        } else {
          return (
            <><p>Welcome {state.selectedAddress}</p><p>Your ETH Balance is: {state.balance}</p></>
          );
        }
      }
    
    return (
        <div>
            {console.log('State Context: ', state)}
            {console.log('File Context: ', file)}
            {renderMetamask()}
            <form onSubmit={handleSubmit}>
                <label>Name:
                    <input type="text" name="name" onChange={handleNameChange}/>
                </label>
                <label>Description:
                    <input type="text" name="description" onChange={handleDescriptionChange}/>
                </label>
                <label>Lattitude:
                    <input type="text" name="lattitude" onChange={handleLattitudeChange}/>
                </label>
                <label>Longitude:
                    <input type="text" name="longitude" onChange={handleLongitudeChange}/>
                </label>
                <label>City:
                    <input type="text" name="city" onChange={handleCityChange}/>
                </label>
                <label>State:
                    <input type="text" name="state" onChange={handleStateChange}/>
                </label>
                <label>Country: 
                    <input type="text" name="country" onChange={handleCountryChange}/>
                </label>
                <label>Zip Code:
                    <input type="text" name="zip" onChange={handleZipChange}/>
                </label>
                <h1>Upload Image</h1>
                <input type="file" onChange={handleFileChange}/>
                <button type="submit" className="btn btn-success float-right ">Mint</button>
            </form>
        </div>
    );
}
export default <LetterPlanting/>