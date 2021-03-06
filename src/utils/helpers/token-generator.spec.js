const jwt = require('jsonwebtoken')

const MissingParamError = require('../errors/missing-param-error')

const makeTokenGenerator = require('./token-generator')

const makeSut = () => {
  const secret = 'segredo'
  const tokenGenerator = makeTokenGenerator(secret)
  return {
    secret,
    tokenGenerator
  }
}

describe('TokenGenerator', () => {
  test('Retorna null se o JWT retornar null', async () => {
    const { tokenGenerator } = makeSut()
    jwt.token = null
    const token = await tokenGenerator({ userId: 'id' })

    expect(token).toBeNull()
  })

  test('Retorna token se o JWT retornar token', async () => {
    const { tokenGenerator } = makeSut()
    jwt.token = 'valid_token'
    const token = await tokenGenerator({ userId: 'id' })

    expect(token).toBe('valid_token')
  })

  test('Chama JWT com valores corretos', async () => {
    const { tokenGenerator } = makeSut()
    await tokenGenerator({ userId: 'id' })

    expect(jwt.userId).toBe('id')
  })

  test('Chama JWT com segredo correto', async () => {
    const { tokenGenerator, secret } = makeSut()
    await tokenGenerator({ userId: 'id' })

    expect(jwt.secret).toBe(secret)
  })

  test('Lança erro se não for passado segredo', async () => {
    const tokenGenerator = makeTokenGenerator()
    const token = tokenGenerator({ userId: 'id' })

    await expect(token).rejects.toThrow(new MissingParamError('segredo'))
  })

  test('Lança erro se não forem passados os parâmetros ', async () => {
    const { tokenGenerator } = makeSut()
    const token = tokenGenerator()

    await expect(token).rejects.toThrow(new MissingParamError('parâmetros'))
  })
})
