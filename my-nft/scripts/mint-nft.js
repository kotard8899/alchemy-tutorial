require('dotenv').config();
const { API_URL, PUBLIC_KEY, PRIVATE_KEY } = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json"); 

const contractAddress = "0x4c95c18749b91f3037642b6014b47a15671f9203";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

const mintNFT = async (tokenURI) => {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');
    
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'maxPriorityFeePerGas': 1999999987,
        'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise.then((signedTx) => {
        console.log('here')
        web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, hash) => {
            if (err) {
                return console.log("Something went wrong when submitting your transaction:", err);
            }
            console.log("The hash of your transaction is: ", hash);
        })
    }).catch((err) => {
        console.log(" Promise failed:", err);
    });
};

mintNFT('https://gateway.pinata.cloud/ipfs/QmPWRL4TSVEiCZAijdkTjWP6vWuhBBnVY67W7gUgTz67DG');