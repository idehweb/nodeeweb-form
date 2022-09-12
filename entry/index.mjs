
import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "entry",
    "model": model,
    "modelName": "Entry",
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