const jwt = require('jsonwebtoken')

module.exports = (secret) => {
  return (params) => {
    const token = jwt.sign(params, secret)

    return token
  }
}
