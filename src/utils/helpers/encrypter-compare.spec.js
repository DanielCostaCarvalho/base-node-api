const makeEncrypterCompare = require('./encrypter-compare')
const bcrypt = require('bcrypt')

describe('encrypterCompare', () => {
  test('Chama bcrypt com os valores corretos', async () => {
    const encrypterCompare = makeEncrypterCompare()
    encrypterCompare('valor', 'hash')

    expect(bcrypt.value).toBe('valor')
    expect(bcrypt.hashedValue).toBe('hash')
  })

  test('Retorna true se bcrypt retornar true', async () => {
    const encrypterCompare = makeEncrypterCompare()
    const isValid = await encrypterCompare('valor', 'hash')

    expect(isValid).toBe(true)
  })

  test('Retorna false se bcrypt retornar false', async () => {
    const encrypterCompare = makeEncrypterCompare()
    bcrypt.isValid = false
    const isValid = await encrypterCompare('valor', 'hash_invalido')

    expect(isValid).toBe(false)
  })
})
