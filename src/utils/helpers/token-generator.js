const jwt = require('jsonwebtoken')
const MissingParamError = require('../errors/missing-param-error')

module.exports = (secret) => {
  return async (params) => {
    if (!secret) {
      throw new MissingParamError('segredo')
    }

    if (!params) {
      throw new MissingParamError('parâmetros')
    }

    const token = await jwt.sign(params, secret)

    return token
  }
}
