const validator = require('validator')

module.exports = () => {
  return (email) => {
    return validator.isEmail(email)
  }
}
