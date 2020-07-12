module.exports = () => {
  return async (httpRequest) => {
    if (!httpRequest.body.email) {
      return { statusCode: 400 }
    }
  }
}
