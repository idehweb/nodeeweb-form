import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "form",
    "model": model,
    "modelName": 'Form',
    "routes": routes,
    "admin": {
        "list": {
            "header":[{"name":"formNumber","type":"image"}]
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