// const theApp = require('nodeeweb-backenkend');

// import Server from '@nodeeweb/server'
// import NodeewebShop from 'NodeewebShop'
import order from './order/index.mjs'
import product from './product/index.mjs'
import productCategory from './productCategory/index.mjs'
import attributes from './attributes/index.mjs'
import discount from './discount/index.mjs'
import transaction from './transaction/index.mjs'

export default [attributes,discount,order,product,productCategory,transaction];

//set config ==
//theme=akbar
// route= customer, admin ,
// model
//run server