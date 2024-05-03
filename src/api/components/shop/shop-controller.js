const shopService = require('./shop-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { Product } = require('../../../models');

/**
 * Handle get list of products request
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
      Math.abs(Math.ceil((await Product.countDocuments({}))  / page_size))
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

    // get products
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
 * Handle get product detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    // get product sesuai id
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
 * Handle create product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function inputProduct(request, response, next) {
  try {
    // mengambil variabel dari request body
    const name = request.body.name;
    const category = request.body.category;
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

    // succes jika berhasil menginputkan produk
    const success = await shopService.inputProduct(name, category, price, stock, unit, desc);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to input product'
      );
    }

    // mengembalikan response
    return response.status(200).json({ 
      info: "INPUT PRODUCT SUCCESSFULLY",
      name: name,
      category: category,
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
 * Handle update product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    // mengambil variabel dari params dan body
    const id = request.params.id;
    const Name = request.body.name || await shopService.getProduct(id).name;
    const Category = request.body.category || await shopService.getProduct(id).category;
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

    // jika succes mengupdate produk mengembalikan true
    const success = await shopService.updateProduct(id, Name, Category, Price, Stock, Unit, Desc);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product'
      );
    }

    // mengembalikan response
    return response.status(200).json({ 
      product_id: id,
      info: "SUCCESS UPDATE PRODUCT",
      name: Name,
      category: Category,
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
 * Handle delete product request
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
 * Handle order product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function orderProduct(request, response, next) {
  try {
    // mengambil id dan quantity yang ingin dipesan
    const id = request.body.id;
    const produk = await shopService.getProduct(id);
    const quantity = request.body.quantity;

    // jika melebihi jumlah stok kembalikan error respon
    if(quantity > produk.stock) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'order exceeds stock quantity, reduce order quantity'
      );
    }

    const orderSuccess = await shopService.orderProduct(id, produk.stok);

    if (!orderSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to order product'
      );
    }

    // jika succes kembalikan response
    return response.status(200).json({ 
      id: id,
      info: "ORDER SUCCESS",
      name: produk.name,
      category: produk.category,
      price: produk.price,
      order_quantity: quantity,
      unit: produk.unit,
     });
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
  orderProduct,
}; 
