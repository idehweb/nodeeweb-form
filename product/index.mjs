
import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "product",
    "model": model,
    "modelName": "Product",
    "routes": routes,

    "admin": {
        "list": {
            "header":[{"name":"thumbnail","type":"image"},{"name":"title","type":"object","key":"fa"},{"name":"category"},{"name":"createdAt"},{"name":"updatedAt"}]
        },
        "create": {
            "fields":[{"name":"title"},]
        },
        "edit": {

        },
    },
    "views": [{
        "func": (req, res, next) => {
        }
    }],
    "edits": [{
        "func": (req, res, next) => {
        }
    }],

}