const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const shopControllers = require('./shop-controller');
const shopValidator = require('./shop-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/shop', route);

  // CREATE
  // Create Product
  route.post(
    '/',
    celebrate(shopValidator.inputProduct),
    shopControllers.inputProduct
  );

  // Create Product
  route.post(
    '/products',
    celebrate(shopValidator.inputProduct),
    shopControllers.inputProduct
  );

  // Order product
  route.post(
    '/orders', 
    authenticationMiddleware,
    celebrate(shopValidator.orderProduct),
    shopControllers.orderProduct
  );

  // READ
  // Get list of products
  route.get('/', authenticationMiddleware, shopControllers.getProducts);

  // Get list of products
  route.get('/products', authenticationMiddleware, shopControllers.getProducts);

  // Get product detail
  route.get('/products/:id', authenticationMiddleware, shopControllers.getProduct);

  // Get list of orders
  route.get('/orders', authenticationMiddleware, shopControllers.getOrders);

  // Get order detail
  route.get('/orders/:id', authenticationMiddleware, shopControllers.getOrder);

  // UPDATE
  // Update product
  route.put(
    '/products/:id',
    authenticationMiddleware,
    celebrate(shopValidator.updateProduct),
    shopControllers.updateProduct
  );

  // Update order
  route.put(
    '/orders/:id',
    authenticationMiddleware,
    celebrate(shopValidator.updateOrder),
    shopControllers.updateOrder
  );

  // DELETE
  // Delete product
  route.delete('/products/:id', authenticationMiddleware, shopControllers.deleteProduct);

  // Delete order
  route.delete('/orders/:id', authenticationMiddleware, shopControllers.deleteOrder);
};
