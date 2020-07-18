const MissingParamError = require('../../utils/errors/missing-param-error')

module.exports = (loadUsuarioPorEmail) => {
  return async (email, senha) => {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!senha) {
      throw new MissingParamError('senha')
    }

    loadUsuarioPorEmail(email)
  }
}
