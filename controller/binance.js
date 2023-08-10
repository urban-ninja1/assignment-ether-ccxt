const {Coin, CoinTransaction} = require("../entity")


module.exports = {
    fetch_symbols: async (req, res) => {
        try {
            const symbols = await Coin.findAll({attributes: ["name"]})
            res.send({
                symbols,
            })
        } catch (e) {
            res.status(500).send({
                message: "Unknown Error occurs"
            })
        }
    }, fetch_average_price: async (req, res) => {
        try {
            const symbols = await Coin.findAll({
                attributes: ["name"], include: {
                    model: CoinTransaction, required: false, limit: 100,
                }
            })
            const result = {};
            for (const symbol of symbols) {
                console.log()
                const prices = symbol.CoinTransactions.map(txn => txn.price);
                console.log(prices)
                if (prices.length > 0) {
                    result[symbol.name] = prices.reduce((sum, price) => sum + price, 0) / prices.length;
                    continue
                }
                result[symbol] = 0
            }


            res.send(result )
        } catch (e) {
            console.log(e)
            res.status(500).send({
                message: "Unknown Error occurs"
            })
        }
    }
}