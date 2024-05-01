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
async function inputProduct(id, name, price, stock, unit, desc) {
  return Product.create({
    id,
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
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getProducts,
  getProduct,
  inputProduct,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
