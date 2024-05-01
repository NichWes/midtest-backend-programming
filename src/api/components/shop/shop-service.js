const shopRepository = require('./shop-repository');
const { Product } = require('../../../models');
const { errorResponder, errorTypes } = require('../../../core/errors');

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
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getProduct(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
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
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
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
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
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
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getProducts,
  getProduct,
  inputProduct,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
