const shopRepository = require('./shop-repository');
const { Product } = require('../../../models');

/**
 * Get list of products
 * @returns {Array}
 */ 
async function getProducts(request) {
  // pengecekan query yang masuk
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

  // masukkan data yang di cari ke array of object
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    data.push({
      id: product.id,
      category: product.category,
      name: product.name,
      price: product.price,
      stock: product.stock,
      unit: product.unit,
      desc: product.desc,
    });
  }

  // masukkan semua variabel yang dibutuhkan agar sesuai dengan template yang diinginkan
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
 * Get product detail
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
    category: product.category,
    name: product.name,
    price: product.price,
    stock: product.stock,
    unit: product.unit,
    desc: product.desc
  };
}

/**
 * Create new product
 * @param {string} name - Name
 * @param {string} category - Category
 * @param {string} price - Price
 * @param {string} stock - Stock
 * @param {string} unit - Unit
 * @param {string} desc - Desc
 * @returns {boolean}
 */
async function inputProduct(name, category, price, stock, unit, desc) {
  try {
    await shopRepository.inputProduct(name, category, price, stock, unit, desc);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing product
 * @param {string} id - product Id
 * @param {string} name - Name
 * @param {string} category - Category
 * @param {string} price - Price
 * @param {string} stock - Stock
 * @param {string} unit - Unit
 * @param {string} desc - Desc
 * @returns {boolean}
 */
async function updateProduct(id, name, category, price, stock, unit, desc) {
  const product = await shopRepository.getProduct(id);

  // check if Product not found
  if (!product) {
    return null;
  }

  try {
    await shopRepository.updateProduct(id, name, category, price, stock, unit, desc);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete product
 * @param {string} id - Product Id
 * @returns {boolean}
 */
async function deleteProduct(id) {
  const product = await shopRepository.deleteProduct(id);

  // check if Product not found
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
 * Check whether the name is registered
 * @param {string} name - Name
 * @returns {boolean}
 */
async function nameIsRegistered(name) {
  const product = await shopRepository.getProductByName(name);

  if (product) {
    return true;
  }

  return false;
}

/**
 * order product
 * @param {string} id - Product ID
 * @param {string} quantity - Quantity
 * @returns {boolean}
 */
async function orderProduct(id, quantity) {
  const product = await shopRepository.getProduct(id);

  // Check if product not found
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
