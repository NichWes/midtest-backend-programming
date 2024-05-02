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
  route.get('/products', authenticationMiddleware, shopControllers.getProducts);

  // Create Product
  route.post(
    '/',
    celebrate(shopValidator.inputProduct),
    shopControllers.inputProduct
  );

  route.post(
    '/products',
    celebrate(shopValidator.inputProduct),
    shopControllers.inputProduct
  );

  // Buy product
  route.put(
    '/products/order', 
    authenticationMiddleware,
    celebrate(shopValidator.orderProduct),
    shopControllers.orderProduct
  );

  // Get product detail
  route.get('/products/:id', authenticationMiddleware, shopControllers.getProduct);

  // Update product
  route.put(
    '/products/:id',
    authenticationMiddleware,
    celebrate(shopValidator.updateProduct),
    shopControllers.updateProduct
  );

  // Delete product
  route.delete('/products/:id', authenticationMiddleware, shopControllers.deleteProduct);
};
