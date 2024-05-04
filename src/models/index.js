const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const usersSchema = require('./users-schema');
const productsSchema = require('./products-schema');
const ordersSchema = require('./orders-schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model(
  'users',
  mongoose.Schema(usersSchema, { timestamps: true })
);

const Product = mongoose.model(
  'products',
  mongoose.Schema(productsSchema, { timestamps: true})
);

const Order = mongoose.model(
  'orders',
  mongoose.Schema(ordersSchema, { timestamps: true})
);

module.exports = {
  mongoose,
  User,
  Product,
  Order,
};
