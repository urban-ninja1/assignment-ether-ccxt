const {pro} = require('ccxt')

const binance = new pro.binance()
binance.newUpdates= true

binance.loadMarkets().then(() => console.log("Markets Loaded")).catch(e => console.error(e))

async function fetchBinanceCoins() {
    try {
        await binance.loadMarkets()
        return binance.symbols
    } catch (e) {
        console.log(e)
        return null
    }
}

async function fetchAveragePrices(from = 1) {
    try {
        const symbols = (await fetchBinanceCoins()).slice(((from - 1) * 10) + 1, ((from) * 10) + 11);
        const averagePrices = {};

        const fetchPromises = symbols.map(async symbol => {
            const trades = await binance.fetchTrades(symbol, undefined, 100);
            const prices = trades.map(trade => trade.price);

            if (prices.length > 0) {
                averagePrices[symbol] = prices.reduce((sum, price) => sum + price, 0) / prices.length;
            }
        });

        await Promise.all(fetchPromises);

        return averagePrices
    } catch (e) {
        console.error(e);
        return null
    }
}

async function watchTrades(symbol, cb,loop=true) {
    while (loop) {
        try {
            const trade = await binance.watchTrades(symbol, undefined, 1)
            cb(trade)
        } catch (e) {
            console.error(symbol, e)
        }
    }
}

module.exports = {
    watchTrades, fetchBinanceCoins, fetchAveragePrices,
}