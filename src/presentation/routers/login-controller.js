module.exports = () => {
  return async (httpRequest) => {
    if (!httpRequest || !httpRequest.body) {
      return { statusCode: 500 }
    }

    const { email, senha } = httpRequest.body
    if (!email || !senha) {
      return { statusCode: 400 }
    }
  }
}
