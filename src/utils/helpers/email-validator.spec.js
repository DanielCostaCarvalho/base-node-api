const validator = require('validator')
const makeEmailValidator = require('./email-validator')

const MissingParamError = require('../errors/missing-param-error')

const makeSut = () => {
  return {
    isValid: makeEmailValidator()
  }
}

describe('Email Validator', () => {
  test('Retorna true se o validator retornar true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_mail')

    expect(isEmailValid).toBe(true)
  })

  test('Retorna false se o validator retornar false', () => {
    const sut = makeSut()
    validator.isEmailValid = false
    const isEmailValid = sut.isValid('invalid_mail')

    expect(isEmailValid).toBe(false)
  })

  test('Chama validator com email recebico', () => {
    const sut = makeSut()
    sut.isValid('email')

    expect(validator.email).toBe('email')
  })

  test('Lança erro se não receber email', () => {
    const sut = makeSut()

    expect(() => sut.isValid()).toThrow(new MissingParamError('email'))
  })
})
