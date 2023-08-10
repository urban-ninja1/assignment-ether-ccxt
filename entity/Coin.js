const {Coin,} = require("./Sequelize")

async function upsert(values, condition) {
    const obj = await Coin.findOne({where: condition})

    if (obj) return obj.update(values);

    return Coin.create(values);
}


Coin.upsert = upsert

module.exports = Coin