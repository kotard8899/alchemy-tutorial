const main = async () => {
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    // const web3 = createAlchemyWeb3("https://eth-mainnet.alchemyapi.io/v2/demo");
    const web3 = createAlchemyWeb3("https://mainnet.infura.io/v3/109440a7c8cc4d83981448395a1e5082");
    const blockNumber = await web3.eth.getBlockNumber();
    console.log("The latest block number is " + blockNumber);
};

main();     