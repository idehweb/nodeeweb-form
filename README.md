# [Nodeeweb Form | Form Plugin For Nodeeweb](https://idehweb.com/product/creare-website-or-application-with-nodeeweb/)

The plugin add form functionality to your nodeeweb core.

You can create forms and manage their entries with this plugin.

## Table of contents

* [Usage](#usage)
* [Documentation](#documentation)
* [API](#api)
* [License](#license)
* [Changelogs](#Changelogs)




## Usage

### 1. install using command
```bash
npm install @nodeeweb/form
```
or
```bash
yarn add @nodeeweb/form
```

### 2. use it in your server function like below:
(you imported Server function from @nodeeweb/server)
```jsx static
import Server from '@nodeeweb/server'
import Shop from '@nodeeweb/form'
Server({entity:[...Form]});
```
### 3. start your mongoDB server:
```bash
sudo systemctl start mongod
```
### 4. check if the server is up and running:
```bash
sudo systemctl status mongod
```

### 5. now your shop is ready, just type command:
```bash
npm start
```
or
```bash
yarn start
```
or
```bash
node index.mjs
```
### 6. after that .env.local will be created

after you start server for first time, .env.local will be created, you can change configurations in it and restart server

## Documentation

Check the getting started guide here: [Documentation]


## presets , examples , demo


## Support

If you like the project and you wish to see it grow, please consider supporting us with a donation of your choice or become a backer/sponsor via [Open Collective](https://idehweb.com/)

we used these modules:

shards

grapesjs

mongoose


## License

Nodeeweb is licensed under the GNU GENERAL PUBLIC LICENSE, sponsored and supported by [https://idehweb.com](idehweb.com)

[Documentation]: <https://idehweb.com/nodeeweb/>
[API-Reference]: <https://idehweb.com/nodeeweb/api/>
[CMS]: <https://en.wikipedia.org/wiki/Content_management_system>

## Changelogs

== 0.0.5
    update readme file and docs
== 0.0.1 
    stable
