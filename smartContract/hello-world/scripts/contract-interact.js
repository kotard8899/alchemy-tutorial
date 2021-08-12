require('dotenv').config();
const { API_URL, PUBLIC_KEY, PRIVATE_KEY } = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json");

const contractAddress = "0x76812aBc55c826dE3EE3A8c9Eec35E2398E98E4e";
const helloWorldContract = new web3.eth.Contract(contract.abi, contractAddress);

const updateMessage = async (newMessage) => {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); // get latest nonce
    const gasEstimate = await helloWorldContract.methods.update(newMessage).estimateGas(); // estimate gas

    // Create the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': gasEstimate, 
        'maxFeePerGas': 1000000108,
        'data': helloWorldContract.methods.update(newMessage).encodeABI()
    };

    // Sign the transaction
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise.then((signedTx) => {
        web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, hash) => {
            if (!err) {
                console.log("The hash of your transaction is: ", hash);
            } else {
                console.log("Something went wrong when submitting your transaction:", err)
            }
        });
    }).catch((err) => {
        console.log("Promise failed:", err);
    });
}

const main = async () => {
    const message = await helloWorldContract.methods.message().call();
    console.log("The message is: " + message);
    // await updateMessage("Hello Drupe!");
}

main();