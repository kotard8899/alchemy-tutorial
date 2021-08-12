require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
const contractAddress = "0x76812aBc55c826dE3EE3A8c9Eec35E2398E98E4e";

export const helloWorldContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);

export const loadCurrentMessage = async () => { 
    const message = await helloWorldContract.methods.message().call();
    return message;
};

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "you can swap now",
                address: addressArray[0]
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        }
    }
};

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "you can swap now",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your
                        browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

export const updateMessage = async (address, message) => {
    if (!window.ethereum || address === null) {
        return {
            status: "💡 Connect your Metamask wallet to update the message on the blockchain.",
        }
    };

    if (message.trim() === "") {
        return {
            status: "❌ Your message cannot be an empty string.",
        }
    };

    const txParams = {
        to: contractAddress,
        from: address,
        data: helloWorldContract.methods.update(message).encodeABI()
    };

    try {
        const txHash = await window.ethereum.request({
            method:"eth_sendTransaction",
            params: [txParams]
        });
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" rel="noreferrer" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
                        View the status of your transaction on Etherscan!
                    </a>
                    <br />
                    ℹ️ Once the transaction is verified by the network, the message will
                    be updated automatically.
                </span>
            )
        }
    } catch (err) {
        return {
            status: "😥 " + err.message,
        };
    };
};

export const getPrice = async () => {
    const { ChainId, Token, WETH, Fetcher, Route } = require("@uniswap/sdk");
    
    const YNT = new Token(
        ChainId.ROPSTEN,
        "0x7ec093f797dad5422e44f9b201ef8ef8fd53669f",
        18
    );

    // const UNI = new Token(
    //     ChainId.ROPSTEN,
    //     "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    //     18
    // );
    const pair = await Fetcher.fetchPairData(YNT, WETH[YNT.chainId]);
    
    const route = new Route([pair], WETH[YNT.chainId]);

    const price = route.midPrice.toSignificant(6);
    return price;
};

export const swapToYNT = async (address, ethNum) => {
    // const { API_URL, PRIVATE_KEY } = process.env;
    const myAddress = address;
    const contractAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; //UniswapV2Router02

    const nonce = await web3.eth.getTransactionCount(myAddress, 'latest');

    const amountOutMin = '1' + Math.random().toString().slice(2,6);
    const abi = require('../contractABI.json');
    const contract = new web3.eth.Contract(abi, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', {from: myAddress.address})
    const tokenAddress = '0x7ec093f797dad5422e44f9b201ef8ef8fd53669f'; // token I created
    const WETHAddress = '0xc778417e063141139fce010982780140aa0cd5ab';

    const data = contract.methods.swapExactETHForTokens(
        amountOutMin,
        [WETHAddress, tokenAddress],
        myAddress,
        web3.utils.toHex(Math.round(Date.now()/1000)+60*20),
    );
    const transaction = {
        from: myAddress,
        to: contractAddress,
        value: web3.utils.toHex(web3.utils.toWei(ethNum, "ether")),
        gas: web3.utils.toHex(300000),
        maxFeePerGas: 1000000108,
        nonce: web3.utils.toHex(nonce),
        data: data.encodeABI(),
    };

    // const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);

    try {
        const txHash = await window.ethereum.request({
            method:"eth_sendTransaction",
            params: [transaction]
        });
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" rel="noreferrer" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
                        View the status of your transaction on Etherscan!
                    </a>
                    <br />
                    ℹ️ Once the transaction is verified by the network, the message will
                    be updated automatically.
                </span>
            )
        }
    } catch (err) {
        return {
            status: "😥 " + err.message,
        };
    };

    // web3.eth.sendSignedTransaction(signedTx.rawTransaction, (error, hash) => {
    //     if (error) {
    //         return console.log("❗Something went wrong while submitting your transaction:", error);
    //     }
    //     console.log("🎉 The hash of your transaction is: ", hash);
    // });
};