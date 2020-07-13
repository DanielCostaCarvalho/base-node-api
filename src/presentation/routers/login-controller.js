module.exports = () => {
  return async (httpRequest) => {
    if (!httpRequest.body.email || !httpRequest.body.senha) {
      return { statusCode: 400 }
    }
  }
}
