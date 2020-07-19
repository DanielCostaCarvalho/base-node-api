const MissingParamError = require('../../utils/errors/missing-param-error')

module.exports = (loadUsuarioPorEmail, encrypterCompare) => {
  return async (email, senha) => {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!senha) {
      throw new MissingParamError('senha')
    }
    if (!loadUsuarioPorEmail) {
      throw new MissingParamError('loadUsuarioPorEmail')
    }

    const usuario = await loadUsuarioPorEmail(email)

    if (!usuario) {
      return null
    }

    await encrypterCompare(senha, usuario.senha)

    return null
  }
}
