module.exports = class MissingParamError extends Error {
  constructor (paramName) {
    super(`Parâmetro ausente: ${paramName}`)
    this.name = 'MissingParamError'
  }
}
