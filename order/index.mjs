import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "order",
    "model": model,
    "modelName": 'Order',
    "routes": routes,
    "admin": {
        "list": {
            "header":[{"name":"orderNumber","type":"image"}]
        },
        "create": {
            "fields":[{"name":"title"},]
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