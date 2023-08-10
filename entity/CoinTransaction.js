const {CoinTransaction} = require("./Sequelize")

async function upsert(values, condition) {
    const obj = await CoinTransaction.findOne({where: condition})

    if (obj) return obj.update(values);

    return CoinTransaction.create(values);
}

CoinTransaction.upsert = upsert

module.exports = CoinTransaction