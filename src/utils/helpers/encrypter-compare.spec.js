const bcrypt = require('bcrypt')
const makeEncrypterCompare = require('./encrypter-compare')

const MissingParamError = require('../errors/missing-param-error')

describe('encrypterCompare', () => {
  test('Chama bcrypt com os valores corretos', () => {
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

  test('Lança erro se não forem lançados parâmetros', async () => {
    const encrypterCompare = makeEncrypterCompare()
    const isValid = encrypterCompare()

    await expect(isValid).rejects.toThrow(new MissingParamError('valor'))
  })

  test('Lança erro se não receber hash', async () => {
    const encrypterCompare = makeEncrypterCompare()
    const isValid = encrypterCompare('valor')

    await expect(isValid).rejects.toThrow(new MissingParamError('hash'))
  })
})
