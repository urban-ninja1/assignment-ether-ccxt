const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST, dialect: "mysql", logging: false,
});


const Coin = sequelize.define('Coin', {
    name: {
        type: DataTypes.STRING, unique: true,
    },
}, {
    timestamps: false,
})

const CoinTransaction = sequelize.define('CoinTransaction', {
    amount: {
        type: DataTypes.FLOAT(20, 18),
    }, txn_id: {
        type: DataTypes.STRING,
    }, price: {
        type: DataTypes.FLOAT(20, 18),
    }, type: {
        type: DataTypes.STRING
    },
}, {
    timestamps: true,
})

CoinTransaction.belongsTo(Coin, {
    foreignKey: "coins_id",
})

Coin.hasMany(CoinTransaction, {
    foreignKey: "coins_id",
})

module.exports = {
    Coin, CoinTransaction,
};