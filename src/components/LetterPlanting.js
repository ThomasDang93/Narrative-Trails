import React, { useState, useEffect, Component, useContext } from 'react';
import fs from 'fs';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';
import { Keyring } from '@polkadot/keyring';
import { Buffer } from 'buffer';

const crustChainEndpoint = 'wss://rpc.crust.network'; // More endpoints: https://github.com/crustio/crust-apps/blob/master/packages/apps-config/src/endpoints/production.ts#L9
const ipfsW3GW = 'https://crustipfs.xyz'; // More web3 authed gateways: https://github.com/crustio/ipfsscan/blob/main/lib/constans.ts#L29
const crustSeeds = process.env.CRUST_SEED; // Create account(seeds): https://wiki.crust.network/docs/en/crustAccount
const api = new ApiPromise({
    provider: new WsProvider(crustChainEndpoint),
    typesBundle: typesBundleForPolkadot,
});
function LetterPlanting() {
  

    // Step1: Build JSON
    // {
    //     name: "",
    //     description: "",
    //     media-uri-image: "" ,
    //     properties: {
    //         lattitude: "",
    //         longitude: "",
    //         city: "",
    //         state: "",
    //         country: "",
    //         zip: "",
    //         file: formData.get('File')
    //     }
    // }

    // Step 2: Send IPFS URL to smart contract
    // {
    //     media-uri-json: ""
    // }
    
    const [state, setState] = useState(    {
        name: "",
        lattitude: "",
        longitude: "",
        description: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        selectedAddress: "",
        balance: ""
    });
    const handleSubmit = async(event) => {
        event.preventDefault();
        const formData = new FormData();
		formData.append('File', state);
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

        // Place storage order
        await placeStorageOrder(rst.cid, rst.size);

        // Query storage status
        // Query forever here ...
        while (true) {
            const orderStatus = (await getOrderState(rst.cid)).toJSON();
            console.log('Replica count: ', orderStatus['reported_replica_count']); // Print the replica count
            await new Promise(f => setTimeout(f, 1500)); // Just wait 1.5s for next chain-query
        }
		
    }

    function handleChange(event) {
        setState(event.target.files[0]);
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
        setState({ selectedAddress: accounts[0], balance: balanceInEther });
    }

    async function placeStorageOrder(fileCid, fileSize) {
        // 1. Construct place-storage-order tx
        const tips = 0;
        const memo = '';
        const tx = api.tx.market.placeStorageOrder(fileCid, fileSize, tips, memo);
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

    async function getOrderState(cid) {
        await api.isReadyOrError;
        return await api.query.market.filesV2(cid);
    }

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
            {console.log('State Context: ' + state)}
            {renderMetamask()}
            <form onSubmit={handleSubmit}>
                <h1>Upload Image</h1>
                <input type="file" onChange={handleChange}/>
                <button type="submit" className="btn btn-success float-right ">Mint</button>
            </form>
        </div>
    );
}
export default <LetterPlanting/>