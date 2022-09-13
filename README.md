# [Nodeeweb Shop | How to create online shop with nodejs reactjs mongodb](https://idehweb.com/product/creare-website-or-application-with-nodeeweb/)

The plugin add shop functionality to your nodeeweb core.

You can create and online shop, website or application, handle products, orders, transactions with this plugin.

Here we are creating an example of usage


## Table of contents

* [Usage](#usage)
* [Documentation](#documentation)
* [API](#api)
* [License](#license)
* [Changelogs](#changelogs)



## Usage

### 1. install using command
```bash
# If you use npm:
npm install @nodeeweb/shop

# Or if you use Yarn:
yarn add @nodeeweb/shop
```

### 2. use it in your server function like below:
(you imported Server function from @nodeeweb/server)
```jsx static
import Server from '@nodeeweb/server'
import Shop from '@nodeeweb/shop'
Server({entity:[...Shop]});
```

### 3. now your shop is ready, just type command:
```bash
# If you use npm:
npm start

# Or if you use Yarn:
yarn start
```
### 3. after that .env.local will be created

after you start server for first time, .env.local will be created, you can change configurations in it and restart server

## Documentation

Check the getting started guide here: [Documentation]


## API
You can find full list of Apis on: [API-Reference]

These routes have been added to your server after installing shop:
<details>
    <summary>API List</summary>

    GET      /customer/attributes
    GET      /customer/attributes/count
    GET      /customer/attributes/:offset/:limit
    GET      /customer/attributes/:id
    POST     /customer/attributes
    PUT      /customer/attributes/:id
    DELETE   /customer/attributes/:id
    GET      /admin/attributes
    GET      /admin/attributes/count
    GET      /admin/attributes/:offset/:limit
    GET      /admin/attributes/:id
    POST     /admin/attributes
    PUT      /admin/attributes/:id
    DELETE   /admin/attributes/:id
    GET      /customer/discount
    GET      /customer/discount/count
    GET      /customer/discount/:offset/:limit
    GET      /customer/discount/:id
    POST     /customer/discount
    PUT      /customer/discount/:id
    DELETE   /customer/discount/:id
    GET      /admin/discount
    GET      /admin/discount/count
    GET      /admin/discount/:offset/:limit
    GET      /admin/discount/:id
    POST     /admin/discount
    PUT      /admin/discount/:id
    DELETE   /admin/discount/:id
    GET      /customer/order
    GET      /customer/order/count
    GET      /customer/order/:offset/:limit
    GET      /customer/order/:id
    POST     /customer/order
    PUT      /customer/order/:id
    DELETE   /customer/order/:id
    GET      /admin/order
    GET      /admin/order/count
    GET      /admin/order/:offset/:limit
    GET      /admin/order/:id
    POST     /admin/order
    PUT      /admin/order/:id
    DELETE   /admin/order/:id
    GET      /customer/product
    GET      /customer/product/count
    GET      /customer/product/:offset/:limit
    GET      /customer/product/:id
    POST     /customer/product
    PUT      /customer/product/:id
    DELETE   /customer/product/:id
    GET      /admin/product
    GET      /admin/product/count
    GET      /admin/product/:offset/:limit
    GET      /admin/product/:id
    POST     /admin/product
    PUT      /admin/product/:id
    DELETE   /admin/product/:id
    GET      /customer/productCategory
    GET      /customer/productCategory/count
    GET      /customer/productCategory/:offset/:limit
    GET      /customer/productCategory/:id
    POST     /customer/productCategory
    PUT      /customer/productCategory/:id
    DELETE   /customer/productCategory/:id
    GET      /admin/productCategory
    GET      /admin/productCategory/count
    GET      /admin/productCategory/:offset/:limit
    GET      /admin/productCategory/:id
    POST     /admin/productCategory
    PUT      /admin/productCategory/:id
    DELETE   /admin/productCategory/:id
    GET      /customer/transaction
    GET      /customer/transaction/count
    GET      /customer/transaction/:offset/:limit
    GET      /customer/transaction/:id
    POST     /customer/transaction
    PUT      /customer/transaction/:id
    DELETE   /customer/transaction/:id
    GET      /admin/transaction
    GET      /admin/transaction/count
    GET      /admin/transaction/:offset/:limit
    GET      /admin/transaction/:id
    POST     /admin/transaction
    PUT      /admin/transaction/:id
    DELETE   /admin/transaction/:id
</details>


## presets , examples , demo


## Support

If you like the project and you wish to see it grow, please consider supporting us with a donation of your choice or become a backer/sponsor via [Open Collective](https://idehweb.com/)

we used these modules:

- [shards](https://github.com/DesignRevision/shards-react)

- [grapesjs](https://grapesjs.com)

- [mongoose](https://mongoosejs.com)


## License
Nodeeweb is licensed under the GNU GENERAL PUBLIC LICENSE, sponsored and supported by [https://idehweb.com](https://idehweb.com)

[Documentation]: <https://idehweb.com/nodeeweb/>
[API-Reference]: <https://idehweb.com/nodeeweb/api/>
[CMS]: <https://en.wikipedia.org/wiki/Content_management_system>

## Changelogs

- 0.0.5
    update readme file and docs
- 0.0.1 
    stable
