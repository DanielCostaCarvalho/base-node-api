const HttpResponse = require('../helpers/http-response')

module.exports = () => {
  return async (httpRequest) => {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }

    const { email, senha } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest('email')
    }

    if (!senha) {
      return HttpResponse.badRequest('senha')
    }
  }
}
