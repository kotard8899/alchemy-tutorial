const main = async () => {
    require('dotenv').config();
    const { API_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(API_URL); // ropsten
    const myAddress = '0x64568ACE195D79423a4836e84BabE4470c2C2067';
    const contractAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; //UniswapV2Router02

    const nonce = await web3.eth.getTransactionCount(myAddress, 'latest');

    const amountOutMin = '1' + Math.random().toString().slice(2,6);
    const abi = require('./contractABI.json');
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
        'from': myAddress,
        'to': contractAddress,
        'value': 50000000000000000,
        'gas': 300000,
        'maxFeePerGas': 1000000108,
        'nonce': nonce,
        "data": data.encodeABI(),
    };

    const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);
    
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, (error, hash) => {
        if (error) {
            return console.log("❗Something went wrong while submitting your transaction:", error);
        }
        console.log("🎉 The hash of your transaction is: ", hash);
    });
}

// main();
const getPrice = async () => {
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
    
    console.log(route.midPrice.toSignificant(6)); // 201.306
    console.log(route.midPrice.invert().toSignificant(6)); // 0.00496756
};

getPrice();