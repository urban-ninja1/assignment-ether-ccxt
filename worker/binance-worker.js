const {watchTrades, fetchBinanceCoins} = require('../service/Binance')
require('dotenv').config()
const Coin = require("../entity/Coin")
const CoinTransaction = require("../entity/CoinTransaction")


function getArgs () {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach( arg => {
            // long arg
            if (arg.slice(0,2) === '--') {
                const longArg = arg.split('=');
                const longArgFlag = longArg[0].slice(2,longArg[0].length);
                args[longArgFlag] = longArg.length > 1 ? longArg[1] : true;
            }
            // flags
            else if (arg[0] === '-') {
                const flags = arg.slice(1,arg.length).split('');
                flags.forEach(flag => {
                    args[flag] = true;
                });
            }
        });
    return args;
}
async function main(n = 1) {
    const symbols = (await fetchBinanceCoins()).slice(((n - 1) * 200),((n - 1) * 200) + 200)
    const data = [];
    for (const symbol of symbols) {
        const r = Coin.upsert({
            name: symbol
        }, {
            name: symbol
        })
        data.push(r)
    }
    await Promise.all(data)

    await Promise.all(symbols.map((symbol) => watchTrades(symbol, async (trade) => {
        const symbol = await Coin.findOne({where: {name: trade[0].symbol}})
        await CoinTransaction.create({
            amount: trade[0].amount,
            txn_id: trade[0].id,
            price: trade[0].price,
            type: trade[0].side,
            coins_id: symbol.id,
        })
    })))
}

const {no} = getArgs()
main(no)