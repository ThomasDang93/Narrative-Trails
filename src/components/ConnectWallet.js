import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import React, { useState } from 'react';
import MetamaskProvider from './MetamaskProvider.js';
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
export const injected = new InjectedConnector();

function ConnectWallet () {

    const [hasMetamask, setHasMetamask] = useState(false);
    const {
        active,
        activate,
        chainId,
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

      const getLibrary = (provider) => {
        return new Web3Provider(provider);
    }
  return (
    <div>
        <Web3ReactProvider getLibrary={getLibrary}>
            <MetamaskProvider>
                {hasMetamask ? (
                        active ? (
                        "Connected! "
                        ) : (
                        <button onClick={() => connect()}>Connect</button>
                        )
                    ) : (
                        <button onClick={() => connect()}>Connect</button>//"Please install metamask"
                    )}
            </MetamaskProvider>
        </Web3ReactProvider>
    </div>
  );
}
 
export default ConnectWallet;