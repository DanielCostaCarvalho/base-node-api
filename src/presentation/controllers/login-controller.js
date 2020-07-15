const HttpResponse = require('../helpers/http-response')
const MissingParamError = require('../helpers/missing-param-error')

module.exports = (authUseCase) => {
  return async (httpRequest) => {
    if (!httpRequest || !httpRequest.body || !authUseCase) {
      return HttpResponse.serverError()
    }

    const { email, senha } = httpRequest.body

    if (!email) {
      return HttpResponse.badRequest(new MissingParamError('email'))
    }

    if (!senha) {
      return HttpResponse.badRequest(new MissingParamError('senha'))
    }

    const accessToken = await authUseCase(email, senha)

    if (!accessToken) {
      return HttpResponse.unauthorizedError()
    }

    return HttpResponse.ok({ accessToken })
  }
}
