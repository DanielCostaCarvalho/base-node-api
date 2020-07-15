module.exports = class InvalidParamError extends Error {
  constructor (paramName) {
    super(`Parâmetro inválido: ${paramName}`)
    this.name = 'InvalidParamError'
  }
}
