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
        library: provider,
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
            <button className="top-right" onClick={() => connect()}>Connect</button>
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
                    <button className="top-right" onClick={() => connect()}>Connect</button>
                )
            ) : (
                <div className="top-right">Please Install Metamask</div>
            )}
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <a
                className="App-link"
                href="https://narrativetrails.xyz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                About
              </a>
            </header>
          </div>
    );
}
export default <Home/>