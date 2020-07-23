const jwt = require('jsonwebtoken')

module.exports = () => {
  return (params) => {
    const token = jwt.sign(params, 'segredo')

    return token
  }
}
