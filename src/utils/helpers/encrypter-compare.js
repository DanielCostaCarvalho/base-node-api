const bcrypt = require('bcrypt')
const MissingParamError = require('../errors/missing-param-error')

module.exports = () => {
  return async (valor, hash) => {
    if (!valor) {
      throw new MissingParamError('valor')
    }
    if (!hash) {
      throw new MissingParamError('hash')
    }

    const isValid = await bcrypt.compare(valor, hash)
    return isValid
  }
}
