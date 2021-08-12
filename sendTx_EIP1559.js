require("dotenv").config();
const AlchemyWeb3 = require("@alch/alchemy-web3");

const { API_URL, PRIVATE_KEY, ADDRESS } = process.env;
const toAddress = "0x1c623FC47e6FEEE90D3e0d690770C71904EE3124";
const web3 = AlchemyWeb3.createAlchemyWeb3(API_URL);

const signTx = async (web3, fields = {}) => {
    const nonce = await web3.eth.getTransactionCount(ADDRESS, 'latest');

    const transaction = {
        'nonce': nonce,
        ...fields,
    };

    return await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);
}

const sendTx = async (web3, fields = {}) => {
    const signedTx = await signTx(web3, fields);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction, (error, hash) => {
        if (error) {
            return console.log("Something went wrong while submitting your transaction:", error);
        }
        console.log("Transaction sent!", hash);
        const interval = setInterval(() => {
            console.log("Attempting to get transaction receipt...");
            web3.eth.getTransactionReceipt(hash, (err, rec) => {
                if (rec) {
                    console.log(rec);
                    clearInterval(interval);
                }
            });
        }, 1000);
    });
}

const sendOnlyMaxPriorityFeePerGasLondonTx = (web3) => {
    web3.eth.estimateGas({
        to: toAddress,
        data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
    }).then((estimatedGas) => {
        web3.eth.getMaxPriorityFeePerGas().then((price) => {
            sendTx(web3, {
                gas: estimatedGas,
                maxPriorityFeePerGas: price,
                to: toAddress,
                value: 100,
            });
        });
    });

    // Add maxFeePerGas field only
    // web3.eth.estimateGas({
    //     to: toAddress,
    //     data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
    // }).then((estimatedGas) => {
    //     ethGasStationCall().then((price) => {
    //         sendTx(web3, {
    //         gas: estimatedGas,
    //         maxPriorityFee: price,
    //         to: toAddress,
    //         value: 100,
    //         });
    //     });
    // });
};

// Viewing the baseFee
web3.eth.getBlock("pending").then((block) => console.log('fee',block.baseFeePerGas));


sendOnlyMaxPriorityFeePerGasLondonTx(web3);