const HttpResponse = require('../helpers/http-response')

module.exports = (authUseCase) => {
  return async (httpRequest) => {
    if (!httpRequest || !httpRequest.body || !authUseCase) {
      return HttpResponse.serverError()
    }

    const { email, senha } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest('email')
    }

    if (!senha) {
      return HttpResponse.badRequest('senha')
    }

    const accessToken = authUseCase(email, senha)

    if (!accessToken) {
      return HttpResponse.unauthorizedError()
    }

    return {
      statusCode: 200,
      body: { accessToken }
    }
  }
}
