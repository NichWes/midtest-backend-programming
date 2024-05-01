const shopService = require('./shop-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { Product } = require('../../../models');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProducts(request, response, next) {
  try {
    // Validasi input query yang masuk
    const page_number = request.query.page_number || 1;
    const page_size =
      request.query.page_size || (await Product.countDocuments({}));
    if (
      page_number >
      Math.abs(Math.ceil((await Product.countDocuments({})) / page_size))
    ) {
      throw errorResponder(errorTypes.VALIDATION, 'page_number over a limit');
    } else if (isNaN(page_number) || isNaN(page_size)) {
      throw errorResponder(
        errorTypes.VALIDATION,
        'page_number or page_size must be Integer'
      );
    } else if (page_number < 0 || page_size < 0) {
      throw errorResponder(
        errorTypes.VALIDATION,
        'page_number or page_size must be positive'
      );
    }

    const products = await shopService.getProducts(request);

    if (!products) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown products');
    }

    return response.status(200).json(products);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    const product = await shopService.getProduct(request.params.id);

    if (!product) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown product');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function inputProduct(request, response, next) {
  try {
    const id = request.body.id;
    const name = request.body.name;
    const price = request.body.price;
    const stock = request.body.stock;
    const unit = request.body.unit;
    const desc = request.body.desc;

    // // Email must be unique
    // const idIsRegistered = await shopService.idIsRegistered(id);
    // if (idIsRegistered) {
    //   throw errorResponder(
    //     errorTypes.ID_ALREADY_TAKEN,
    //     'ID is already registered'
    //   );
    // }

    const success = await shopService.inputProduct(id, name, price, stock, unit, desc);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to input product'
      );
    }

    return response.status(200).json({ 
      info: "INPUT PRODUCT SUCCESSFULLY",
      id: id,
      name: name,
      price: price,
      stock: stock,
      unit: unit,
      desc: desc,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    // Email must be unique
    const emailIsRegistered = await usersService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change user password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changePassword(request, response, next) {
  try {
    // Check password confirmation
    if (request.body.password_new !== request.body.password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Check old password
    if (
      !(await usersService.checkPassword(
        request.params.id,
        request.body.password_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong password');
    }

    const changeSuccess = await usersService.changePassword(
      request.params.id,
      request.body.password_new
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change password'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  inputProduct,
  updateUser,
  deleteUser,
  changePassword,
}; 
