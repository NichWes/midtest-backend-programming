const { Product } = require('../../../models');

/**
 * Get a list of product
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
 * Get product detail
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Product.findById(id);
}

/**
 * input product
 * @param {string} name - Name
 * @param {string} category - Category
 * @param {string} price - Price
 * @param {string} stock - Stock
 * @param {string} unit - Unit
 * @param {string} desc - Desc
 * @returns {Promise}
 */
async function inputProduct(name, category, price, stock, unit, desc) {
  return Product.create({
    name,
    category,
    price,
    stock,
    unit, 
    desc,
  });
}

/**
 * Update existing product
 * @param {string} id - Product ID
 * @param {string} name - Name
 * @param {string} category - Category
 * @param {string} price - Price
 * @param {string} stock - Stock
 * @param {string} unit - Unit
 * @param {string} desc - Desc
 * @returns {Promise}
 */
async function updateProduct(id, name, category, price, stock, unit, desc) {
  return Product.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        category,
        price,
        stock,
        unit,
        desc
      },
    }
  );
}

/**
 * Delete a procuct
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

/**
 * Get product by name to prevent duplicate name
 * @param {string} name - Name
 * @returns {Promise}
 */
async function getProductByName(name) {
  return Product.findOne({ name });
}

/**
 * order product
 * @param {string} id - Product ID
 * @param {string} quantity - Quantity
 * @returns {Promise}
 */
async function orderProduct(id, quantity) {

  return Product.updateOne({ _id: id }, { $set: {stock: quantity} });
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
