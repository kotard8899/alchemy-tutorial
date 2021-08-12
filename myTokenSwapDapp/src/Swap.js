import React from "react";
import { useEffect, useState } from "react";
import {
    connectWallet,
    getCurrentWalletConnected,
    getPrice,
    swapToYNT
} from "./util/interact.js";

const Swap = () => {
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [price, setPrice] = useState(0);
    const [ethNum, setEthNum] = useState("");
    const [yntNum, setYntNum] = useState("");
    
    useEffect(() => {
        async function fetchData() {

            const { address, status } = await getCurrentWalletConnected();
            setWallet(address);
            setStatus(status);
            const tempPrice = await getPrice();
            setPrice(tempPrice);

            addWalletListener();
        }
        fetchData();
    }, []);

    function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                    setStatus("👆🏽 Write a message in the text-field above.");
                } else {
                    setWallet("");
                    setStatus("🦊 Connect to Metamask using the top right button.");
                }
            })
        } else {
            setStatus(
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your
                        browser.
                    </a>
                </p>
            );
        }
    }

    const connectWalletPressed = async () => {
        const walletRes = await connectWallet();
        setStatus(walletRes.status);
        setWallet(walletRes.address);
    };

    const swap = async () => {
        const status = await swapToYNT(walletAddress, ethNum);
        console.log('swap', status);
    };

    const changeInput = (e) => {
        setEthNum(e.target.value);
        setYntNum(e.target.value * price);
    };

    const changeYntInput = (e) => {
        setYntNum(e.target.value);
        setEthNum(e.target.value / price);
    };

    return (
        <div className="swap-page">
            <button id="walletButton" onClick={connectWalletPressed}>
                {walletAddress.length > 0 ? (
                    "Connected: " +
                    String(walletAddress).substring(0, 6) +
                    "..." +
                    String(walletAddress).substring(38)
                ) : (
                    <span>Connect Wallet</span>
                )}
            </button>
            <div className="swap-wrapper">
                <div className="array"></div>
                <h2 className="swap-h2">兌換</h2>
                <div className="token-block eth">
                    <span className="token-name">ETH</span>
                    <input className="token-input" type="number" placeholder="0.0" value={ethNum} onChange={changeInput} />
                </div>
                <div className="token-block ynt">
                    <span className="token-name">YNT</span>
                    <input className="token-input" type="number" placeholder="0.0" value={yntNum} onChange={changeYntInput} />
                </div>
                <div className="rate">
                    1 ETH = {price} YNT
                </div>
                <button onClick={swap} className="swap-btn">兌換</button>
                <span className="swap-status">{status}</span>
            </div>
        </div>
    )
};

export default Swap;