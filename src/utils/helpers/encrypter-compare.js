const bcrypt = require('bcrypt')

module.exports = () => {
  return async (valor, hash) => {
    const isValid = await bcrypt.compare(valor, hash)
    return isValid
  }
}
