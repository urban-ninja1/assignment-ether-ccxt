const {ethers, formatEther, Wallet} = require('ethers')
const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT)


const getLatestTransactions = async (amount) => {
    const blockByNumber = await provider.send("eth_getBlockByNumber", ["pending", false]);
    let transactions = blockByNumber.transactions
    if (blockByNumber.transactions.length < amount) {
        let block = parseInt(blockByNumber.number.toString()) - 1
        console.log(block)
        while (transactions.length < amount) {
            const txn = await provider.getBlock(block)
            transactions = transactions.concat(txn.transactions)
            block--;
        }
        transactions = transactions.slice(0, amount);
    }

    const promiseTransactions = transactions.map(async t => {
        const receipt = await provider.getTransaction(t)
        return {
            from: receipt.from, to: receipt.to, hash: receipt.hash, amount: formatEther(receipt.value) + "ETH",
        }
    });

    return await Promise.all(promiseTransactions)
};

function validateAddress(address) {
    return ethers.isAddress(address);
}

function createWallet() {
    const wallet = Wallet.createRandom();
    const address = wallet.address;
    const privateKey = wallet.privateKey;
    return {
        address, privateKey
    }
}

module.exports = {
    getLatestTransactions, validateAddress,createWallet
}