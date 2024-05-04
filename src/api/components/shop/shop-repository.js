const { Product } = require('../../../models');
const { Order } = require('../../../models');

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
 * @param {string} product_Name - Product Name
 * @param {string} product_Id - Product ID
 * @param {string} category - Category
 * @param {string} price - Price
 * @param {string} quantity_Order - Quantity
 * @returns {Promise}
 */
async function orderProduct(product_Name, product_Id, category, price, quantity_Order) {
    return Order.create({
      product_Name,
      product_Id,
      category,
      price,
      quantity_Order, 
    });
}

/**
 * Get a list of order
 * @returns {Promise}
 */
async function getOrders(pageNumber, pageSize, sort, search) {
  return Order.find(search)
    .sort(sort)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .then()
    .catch();
}

/**
 * Get order detail
 * @param {string} id - Order ID
 * @returns {Promise}
 */
async function getOrder(id) {
  return Order.findById(id);
}

/**
 * Update existing order
 * @param {string} id - order Id
 * @param {string} product_Name - Product_Name
 * @param {string} product_id - Product Id
 * @param {string} category - Category
 * @param {string} price - Price
 * @param {string} quantity_Order - Quantity_Order
 * @returns {Promise}
 */
async function updateOrder(id, product_Name, product_Id, category, price, quantity_Order) {
  return Order.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        product_Name,
        product_Id,
        category,
        price,
        quantity_Order,
      },
    }
  );
}

/**
 * Delete a order
 * @param {string} id - Order ID
 * @returns {Promise}
 */
async function deleteOrder(id) {
  return Order.deleteOne({ _id: id });
}


module.exports = {
  getProducts,
  getProduct,
  inputProduct,
  updateProduct,
  deleteProduct,
  getProductByName,
  orderProduct,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
