const shopRepository = require('./shop-repository');
const { Product } = require('../../../models');

/**
 * Get list of users
 * @returns {Array}
 */ 
async function getProducts(request) {
  const page_number = request.query.page_number || 1;
  const page_size = request.query.page_size || (await Product.countDocuments({}));
  let sort = request.query.sort || 'name';
  let search = request.query.search || '';
  totalPages = Math.ceil((await Product.countDocuments({})) / page_size);

  request.query.sort ? (sort = request.query.sort.split(':')) : (sort = [sort]);
  request.query.search
    ? (search = request.query.search.split(':'))
    : (search = [search]);

  let sortBy = {};
  if (sort[1]) {
    sortBy[sort[0]] = sort[1];
  } else {
    sortBy[sort[0]] = 'asc';
  }

  let searchBy = {};
  if (sort[1]) {
    searchBy[search[0]] = { $regex: search[1], $options: 'i' };
  } else {
    sortBy[sort[0]] = '';
  }

  const products = await shopRepository.getProducts(
    page_number,
    page_size,
    sortBy,
    searchBy
  );

  const results = [];
  const data = [];

  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    data.push({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      unit: product.unit,
      desc: product.desc,
    });
  }

  results.push({
    page_number: page_number,
    page_size: page_size,
    count: JSON.parse(JSON.stringify(products)).length,
    total_pages: totalPages,
    has_previous_page: Boolean(page_number - 1 != 0),
    has_next_page: Boolean(totalPages - page_number != 0),
    products: data,
  });

  return results;
}

/**
 * Get user detail
 * @param {string} id - product ID
 * @returns {Object}
 */
async function getProduct(id) {
  const product = await shopRepository.getProduct(id);

  // Product not found
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    stock: product.stock,
    unit: product.unit,
    desc: product.desc
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function inputProduct(id, name, price, stock, unit, desc) {
  try {
    await shopRepository.inputProduct(id, name, price, stock, unit, desc);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateProduct(id, name, price, stock, unit, desc) {
  const product = await shopRepository.getProduct(id);

  // User not found
  if (!product) {
    return null;
  }

  try {
    await shopRepository.updateProduct(id, name, price, stock, unit, desc);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteProduct(id) {
  const product = await shopRepository.deleteProduct(id);

  // Product not found
  if (!product) {
    return null;
  }

  try {
    await shopRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function nameIsRegistered(id) {
  const product = await shopRepository.getProductByName(id);

  if (product) {
    return true;
  }

  return false;
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function orderProduct(id, quantity) {
  const product = await shopRepository.getProduct(id);

  // Check if user not found
  if (!product) {
    return null;
  }

 const orderSuccess = await shopRepository.orderProduct(id, quantity);

  if (!orderSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getProducts,
  getProduct,
  inputProduct,
  updateProduct,
  deleteProduct,
  nameIsRegistered,
  orderProduct,
};
