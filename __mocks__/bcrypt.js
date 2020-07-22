module.exports = {
  isValid: true,
  value: '',
  hashedValue: '',
  compare (value, hashedValue) {
    this.value = value
    this.hashedValue = hashedValue
    return this.isValid
  }
}
