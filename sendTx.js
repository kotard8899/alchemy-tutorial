const main = async () => {
    require('dotenv').config();
    const { API_URL, PRIVATE_KEY } = process.env;
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(API_URL);
    const myAddress = '0x64568ACE195D79423a4836e84BabE4470c2C2067';
    const myAddress2 = '0x1c623FC47e6FEEE90D3e0d690770C71904EE3124';

    const nonce = await web3.eth.getTransactionCount(myAddress, 'latest');

    const transaction = {
        'to': myAddress2, // faucet address to return eth
        'value': 100,
        'gas': 30000,
        'maxFeePerGas': 1000000108,
        'nonce': nonce,
        // optional data field to send message or execute smart contract
    };

    const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);
    
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, (error, hash) => {
        if (error) {
            return console.log("❗Something went wrong while submitting your transaction:", error);
        }
        console.log("🎉 The hash of your transaction is: ", hash);
    });
}

main();