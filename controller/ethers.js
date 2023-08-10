const {validateAddress, getLatestTransactions,createWallet} = require("../service/Ethers")


module.exports = {
    validate_address: async (req, res) => {
        const {address} = req.params
        res.send({
            address,
            valid: validateAddress(address),
        })
    },
    fetch_latest_txn: async (req, res) => {
        res.send({
            txn:await getLatestTransactions(1000),
        })
    },
    create_wallet: (req,res)=>{
        res.send({
            wallet:createWallet()
        })
    }
}