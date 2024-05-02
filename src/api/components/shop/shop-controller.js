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
    const name = request.body.name;
    const price = request.body.price;
    const stock = request.body.stock;
    const unit = request.body.unit;
    const desc = request.body.desc;

    // Name must be unique
    const nameIsRegistered = await shopService.nameIsRegistered(name);
    if (nameIsRegistered) {
      throw errorResponder(
        errorTypes.NAME_ALREADY_TAKEN,
        'Name is already registered'
      );
    }

    const success = await shopService.inputProduct(name, price, stock, unit, desc);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to input product'
      );
    }

    return response.status(200).json({ 
      info: "INPUT PRODUCT SUCCESSFULLY",
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
async function updateProduct(request, response, next) {
  try {
    const id = request.params.id;
    const Name = request.body.name || await shopService.getProduct(id).name;
    const Price = request.body.price || await shopService.getProduct(id).price;
    const Stock = request.body.stock || await shopService.getProduct(id).stock;
    const Unit = request.body.unit || await shopService.getProduct(id).unit;
    const Desc = request.body.desc || await shopService.getProduct(id).desc;

    // Name must be unique
    const nameIsRegistered = await shopService.nameIsRegistered(request.body.name);
    if (nameIsRegistered) {
      throw errorResponder(
        errorTypes.NAME_ALREADY_TAKEN,
        'Name is already registered'
      );
    }

    const success = await shopService.updateProduct(id, Name, Price, Stock, Unit, Desc);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product'
      );
    }

    return response.status(200).json({ 
      product_id: id,
      info: "SUCCESS UPDATE PRODUCT",
      name: Name,
      price: Price,
      stock: Stock,
      unit: Unit,
      desc: Desc,
     });
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
async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;

    const success = await shopService.deleteProduct(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ 
      id: id,
      info: "PRODUCT SUCCESSFULLY DELETED"
    });
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
  updateProduct,
  deleteProduct,
  changePassword,
}; 
