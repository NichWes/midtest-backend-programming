const shopService = require('./shop-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { Product } = require('../../../models');
const { Order } = require('../../../models');

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
        'failed to delete product, insert a valid id'
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
  try{
    // mengambil variabel dari request body
    const id = request.body.id;
    const quantity = request.body.quantity;
    const product = await shopService.getProduct(id);

    // succes jika berhasil meng-order produk
    const success = await shopService.orderProduct(product.name, id, product.category, product.price, quantity);

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to order product'
      );
    }

    // mengembalikan response
    return response.status(200).json({ 
      info: "ORDER PRODUCT SUCCESSFULLY",
      product_Name: product.name,
      product_Id: id,
      category: product.category,
      price: product.price,
      quantity_Order: quantity,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get list of orders request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getOrders(request, response, next) {
  try {
    // Validasi input query yang masuk
    const page_number = request.query.page_number || 1;
    const page_size =
      request.query.page_size || (await Order.countDocuments({}));
    if (
      page_number >
      Math.abs(Math.ceil((await Order.countDocuments({}))  / page_size))
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

    // get orders
    const orders = await shopService.getOrders(request);

    if (!orders) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown orders');
    }

    return response.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get order detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getOrder(request, response, next) {
  try {
    // get product sesuai id
    const order = await shopService.getOrder(request.params.id);

    if (!order) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown order');
    }

    return response.status(200).json(order);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update order request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateOrder(request, response, next) {
  try {
    // mengambil variabel dari params dan body
    const id = request.params.id;
    const Name = request.body.product_Name || await shopService.getOrder(id).product_Name;
    const Product_Id = await shopService.getOrder(id).product_Id;
    const Category = request.body.category || await shopService.getOrder(id).category;
    const Price = request.body.price || await shopService.getOrder(id).price;
    const quantity_Order = request.body.quantity_Order || await shopService.getOrder(id).quantity_Order;

    // Name must be unique
    const nameIsRegistered = await shopService.nameIsRegistered(request.body.product_Name);
    if (nameIsRegistered) {
      throw errorResponder(
        errorTypes.NAME_ALREADY_TAKEN,
        'Name is already registered'
      );
    }

    // jika succes mengupdate produk mengembalikan true
    const success = await shopService.updateOrder(id, Name, Product_Id, Category, Price, quantity_Order);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update order'
      );
    }

    // mengembalikan response
    return response.status(200).json({ 
      order_id: id,
      info: "SUCCESS UPDATE ORDER",
      product_Name: Name,
      product_Id: Product_Id,
      category: Category,
      price: Price,
      quantity_Order: quantity_Order,
     });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete order request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteOrder(request, response, next) {
  try {
    const id = request.params.id;
  
    const success = await shopService.deleteOrder(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'failed to delete order, insert a valid id'
      );
    }

    return response.status(200).json({ 
      id: id,
      info: "ORDER SUCCESSFULLY DELETED"
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
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
}; 
