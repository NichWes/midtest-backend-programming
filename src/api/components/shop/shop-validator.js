const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  inputProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      price: joiPassword.string().min(1).max(12).required().minOfNumeric(1).label('Price'),
      stock: joiPassword.string().min(1).max(15).minOfNumeric(1).required().label('Stock'),
      unit: joi.string().min(1).max(10).required().label('Unit'),
      desc: joi.string().min(1).max(150).required().label('Description'),
    },
  },

  updateProduct: {
    body: {
      name: joi.string().min(1).max(100).label('Name'),
      price: joiPassword.string().min(1).max(12).minOfNumeric(1).label('Price'),
      stock: joiPassword.string().min(1).max(15).minOfNumeric(1).label('Stock'),
      unit: joi.string().min(1).max(10).label('Unit'),
      desc: joi.string().min(1).max(150).label('Description'),
    },
  },

  orderProduct: {
    body: {
      id: joiPassword.string().min(1).max(100).required().label('Id'),
      quantity: joiPassword.string().min(1).max(12).minOfNumeric(1).required().label('Quantity'),
    },
  },
};
