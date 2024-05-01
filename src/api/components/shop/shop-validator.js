const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  inputProduct: {
    body: {
      id: joi.string().min(1).max(30).alphanum().required().label('Id'),
      name: joi.string().min(1).max(100).required().label('Name'),
      price: joiPassword.string().min(1).max(12).required().minOfNumeric(1).label('Price'),
      stock: joiPassword.string().min(1).max(15).minOfNumeric(1).required().label('Stock'),
      unit: joi.string().min(1).max(10).required().label('Unit'),
      desc: joi.string().min(1).max(150).required().label('Description'),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  changePassword: {
    body: {
      password_old: joi.string().required().label('Old password'),
      password_new: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(32)
        .required()
        .label('New password'),
      password_confirm: joi.string().required().label('Password confirmation'),
    },
  },
};
