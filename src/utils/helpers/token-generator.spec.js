const jwt = require('jsonwebtoken')

const makeTokenGenerator = require('./token-generator')

describe('TokenGenerator', () => {
  test('Retorna null se o JWT retornar null', async () => {
    const tokenGenerator = makeTokenGenerator()
    jwt.token = null
    const token = await tokenGenerator({ userId: 'id' })

    expect(token).toBeNull()
  })

  test('Retorna token se o JWT retornar token', async () => {
    const tokenGenerator = makeTokenGenerator()
    jwt.token = 'valid_token'
    const token = await tokenGenerator({ userId: 'id' })

    expect(token).toBe('valid_token')
  })
})
