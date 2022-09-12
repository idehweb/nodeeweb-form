import controller from './controller.mjs'

export default [
    {
        'path': '/4',
        'method': 'get',
        'access':'admin, customer',
        'controller': controller.get4
    },
    {
        'path': '/2',
        'method': 'get',
        'access':'admin, customer',
        'controller': controller.get2
    }
]