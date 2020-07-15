const HttpResponse = require('../helpers/http-response')
const MissingParamError = require('../helpers/missing-param-error')
const InvalidParamError = require('../helpers/invalid-param-error')

module.exports = (authUseCase, emailValidator) => {
  return async (httpRequest) => {
    try {
      const { email, senha } = httpRequest.body

      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }

      if (!senha) {
        return HttpResponse.badRequest(new MissingParamError('senha'))
      }

      if (!emailValidator(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }

      const accessToken = await authUseCase(email, senha)

      if (!accessToken) {
        return HttpResponse.unauthorizedError()
      }

      return HttpResponse.ok({ accessToken })
    } catch {
      return HttpResponse.serverError()
    }
  }
}
