// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

//gerar dados de usuário
Cypress.Commands.add('generateUserData', () => {
  const timestamp = Date.now()
  return {
    userName: `usuario${timestamp}`,
    password: `Test@123${timestamp}`
  }
})

//  Criar usuário
Cypress.Commands.add('createUser', (userData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}${Cypress.env('apiUser')}`,
    body: userData,
    headers: {
      'Content-Type': 'application/json'
    }
  })
})

// gerar token
Cypress.Commands.add('generateToken', (userData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}${Cypress.env('apiGenerateToken')}`,
    body: userData,
    headers: {
      'Content-Type': 'application/json'
    }
  })
})


Cypress.Commands.add('requestWithRetry', (options, maxRetries = 3) => {
  const makeRequest = (attempt = 1) => {
    return cy.request({
      ...options,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 502 && attempt < maxRetries) {
        cy.log(`⚠️ Tentativa ${attempt} falhou (502). Tentando novamente...`)
        cy.wait(2000) // Aguardar 2 segundos
        return makeRequest(attempt + 1)
      }
      return response
    })
  }
  return makeRequest()
})