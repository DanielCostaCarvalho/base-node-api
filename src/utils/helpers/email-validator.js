const validator = require('validator')
const MissingParamError = require('../errors/missing-param-error')

module.exports = () => {
  return (email) => {
    if (!email) {
      throw new MissingParamError('email')
    }

    return validator.isEmail(email)
  }
}
