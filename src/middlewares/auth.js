const wrapper = require('../helpers/wrapper')
const jwt = require('jsonwebtoken')

module.exports = {

  authentication: (req, res, next) => {
    let token = req.headers.authorization

    if (token) {
      token = token.split(' ')[1]
      jwt.verify(token, 'secret', (error, result) => {
        if (
          (error && error.name === 'JSONWebTokenError') ||
          (error && error.name === 'TokenExpiredError')) {
          return wrapper.response(res, 403, error.message)
        } else {
          req.decodeToken = result
          next()
        }
      })
    }
  },

  adminAuthorization: (req, res, next) => {
    req.decodeToken.user_role === 'admin'
      ? next()
      : (wrapper.response(res, 401, 'Admin-only page'))
  }

}
