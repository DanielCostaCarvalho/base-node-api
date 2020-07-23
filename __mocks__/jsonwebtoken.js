module.exports = {
  token: '',
  userId: '',
  secret: '',
  async sign (params, secret) {
    this.userId = params.userId
    this.secret = secret
    return this.token
  }
}
