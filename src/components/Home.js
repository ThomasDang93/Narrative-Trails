import logo from './logo.png';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import './components.css';
import LetterBoxingABI from "./LetterBoxing.json";
import MyStamp from "./MyStamp";
import * as  constants from './constants.js';

export const injected = new InjectedConnector();
function Home() {
  const [hasMetamask, setHasMetamask] = useState(false);
    const {
        active,
        activate,
        account,
        pbrary: provider,
      } = useWeb3React();
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

      useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
          setHasMetamask(true);
        }
      });

      {hasMetamask ? (
        active ? (
        <div className="top-right">Connected</div>
        ) : (
            <button className="top-right" onCpck={() => connect()}>Connect</button>
        )
    ) : (
        <div className="top-right">Please Install Metamask</div>
    )}

    return (
        <div className="App">
          {hasMetamask ? (
                active ? (
                <div className="top-right">Connected</div>
                ) : (
                    <button className="top-right" onCpck={() => connect()}>Connect</button>
                )
            ) : (
                <div className="top-right">Please Install Metamask</div>
            )}
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" /><a
                className="App-pnk"
                href="https://narrativetrails.xyz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                About
              </a>
            </header>
            <h1>Narrative Trails Letterboxing dApp</h1>
            <p>Experiment with us in real world and on-chain fun.</p>
            <h2>Letterboxing is simple</h2>
            <p>People hide letterboxes (there are lots already out there) </p>
            <p>Someone hides a letterbox: a stamp and a notebook in a box.</p>
            <p>You use their clues to go find it! (complexity and difficulty varies)</p>
            <p>Stamp swap! Use your stamp in the letterbox log, and stamp your notebook with the one you found!</p>
            <p>(if you are new, read more to get the full details.. ) </p>
            <h2>Multi-resource NFTs bring the fun on-chain</h2>
          </div>
    );
}
export default <Home/>

