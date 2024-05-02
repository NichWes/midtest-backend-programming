const { parseInt } = require('lodash');
const { Product } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getProducts(pageNumber, pageSize, sort, search) {
  return Product.find(search)
    .sort(sort)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .then()
    .catch();
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Product.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function inputProduct(name, price, stock, unit, desc) {
  return Product.create({
    name,
    price,
    stock,
    unit, 
    desc,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateProduct(id, name, price, stock, unit, desc) {
  return Product.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        price,
        stock,
        unit,
        desc
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getProductByName(name) {
  return Product.findOne({ name });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function orderProduct(id, quantity) {

  const produk = Product.findById(id);
  const Stok = parseInt(produk.stock);
  const Quantity = parseInt(quantity);

  const stok = (Stok - Quantity);
  const stock_ = stok.toString();

  return Product.updateOne({ _id: id }, { $set: {stock: stock_} });
}

module.exports = {
  getProducts,
  getProduct,
  inputProduct,
  updateProduct,
  deleteProduct,
  getProductByName,
  orderProduct,
};
