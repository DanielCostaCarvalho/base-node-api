const makeLoginController = require('./login-controller')

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
  })
})
