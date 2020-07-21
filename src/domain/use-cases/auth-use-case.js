const MissingParamError = require('../../utils/errors/missing-param-error')

module.exports = ({ loadUsuarioPorEmail, encrypterCompare, tokenGenerator, updateAccessTokenRepository } = {}) => {
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
    if (!encrypterCompare) {
      throw new MissingParamError('encrypterCompare')
    }
    if (!tokenGenerator) {
      throw new MissingParamError('tokenGenerator')
    }
    if (!updateAccessTokenRepository) {
      throw new MissingParamError('updateAccessTokenRepository')
    }

    const usuario = await loadUsuarioPorEmail(email)

    const isValid = usuario && await encrypterCompare(senha, usuario.senha)

    if (!isValid) {
      return null
    }

    const token = await tokenGenerator({ userId: usuario.id })

    await updateAccessTokenRepository(usuario.id, token)

    return token
  }
}
