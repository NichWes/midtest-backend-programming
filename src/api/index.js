const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const shop = require('./components/shop/shop-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  shop(app);

  return app;
};
