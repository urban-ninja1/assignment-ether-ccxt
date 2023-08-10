const express = require('express');
const router = express.Router();
const Binance = require('../service/Binance')
const Coin = require("../entity/Coin");
const {watchTrades} = require("../service/Binance");
const controller = {
    ether: require("../controller/ethers"),
    binance: require("../controller/binance")
}

router.get("/ether/validate/:address", controller.ether.validate_address)
router.get("/ether/get-latest", controller.ether.fetch_latest_txn)
router.post("/ether/wallet/create", controller.ether.create_wallet)


router.get('/ccxt/get-symbols',controller.binance.fetch_symbols)
router.get('/ccxt/fetch-average-price',controller.binance.fetch_average_price)

module.exports = router;