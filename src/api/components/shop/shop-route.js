const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const shopControllers = require('./shop-controller');
const shopValidator = require('./shop-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/shop', route);

  // Get list of products
  route.get('/', authenticationMiddleware, shopControllers.getProducts);

  // Get list of products
  route.get('/product', authenticationMiddleware, shopControllers.getProducts);

  // Create user
  route.post(
    '/',
    celebrate(shopValidator.inputProduct),
    shopControllers.inputProduct
  );

  route.post(
    '/product',
    celebrate(shopValidator.inputProduct),
    shopControllers.inputProduct
  );

  // // Get user detail
  // route.get('/:id', authenticationMiddleware, shopControllers.getProduct);

  // // Update user
  // route.put(
  //   '/:id',
  //   authenticationMiddleware,
  //   celebrate(shopValidator.updateProduct),
  //   shopControllers.updateProduct
  // );

  // // Delete user
  // route.delete('/:id', authenticationMiddleware, shopControllers.deleteProduct);
};
