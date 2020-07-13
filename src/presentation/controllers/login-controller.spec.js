const makeLoginController = require('./login-controller')
const MissingParamError = require('../helpers/missing-param-error')

describe('Login controller', () => {
  test('Retorna 400 se não for enviado email', async () => {
    const loginController = makeLoginController()
    const httpRequest = {
      body: {
        senha: 'senha'
      }
    }

    const response = await loginController(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })

  test('Retorna 400 se não for enviada senha', async () => {
    const loginController = makeLoginController()
    const httpRequest = {
      body: {
        email: 'email_qualquer'
      }
    }

    const response = await loginController(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('senha'))
  })

  test('Retorna 500 se não for passado request', async () => {
    const loginController = makeLoginController()

    const response = await loginController()

    expect(response.statusCode).toBe(500)
  })

  test('Retorna 500 se for passado um request sem body', async () => {
    const loginController = makeLoginController()
    const httpRequest = {}

    const response = await loginController(httpRequest)

    expect(response.statusCode).toBe(500)
  })
})
