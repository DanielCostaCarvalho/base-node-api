const makeLoginController = require('./login-controller')

describe('Login router', () => {
  test('Retorn 400 se não for enviado email', async () => {
    const loginController = makeLoginController()
    const httpRequest = {
      body: {
        senha: 'senha'
      }
    }

    const response = await loginController(httpRequest)

    expect(response.statusCode).toBe(400)
  })
})
