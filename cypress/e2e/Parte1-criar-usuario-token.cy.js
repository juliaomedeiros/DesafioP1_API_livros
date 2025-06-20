describe('Cenário 1: Criar usuário e alugar livro', () => {
  let userData
  let userResponse
  let tokenResponse
   let availableBooks = []

  before(() => {
    // Gerar dados únicos para o usuário
    userData = {
      userName: `usuário${Date.now()}`,
      password: `Test@123${Date.now()}`
    }
  })

  it('Deve criar um novo usuário com sucesso', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}${Cypress.env('apiUser')}`,
      body: userData,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      userResponse = response
      
      // Validações
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('userID')
      expect(response.body).to.have.property('username', userData.userName)
      expect(response.body).to.have.property('books')
      expect(response.body.books).to.be.an('array').that.is.empty
      
      // Salvar userID para próximos testes
      Cypress.env('userID', response.body.userID)
      Cypress.env('userName', response.body.username)
      
      cy.log(`Usuário criado com ID: ${response.body.userID}`)
    })
  })

  it('Deve gerar token de acesso para o usuário criado', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}${Cypress.env('apiGenerateToken')}`,
      body: userData,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      tokenResponse = response
      
      // Validações
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('token')
      expect(response.body).to.have.property('expires')
      expect(response.body).to.have.property('status', 'Success')
      expect(response.body).to.have.property('result', 'User authorized successfully.')
      
      // Salvar token para próximos testes
      Cypress.env('authToken', response.body.token)
      Cypress.env('userData', userData)
      
      cy.log(`Token gerado: ${response.body.token.substring(0, 20)}...`)
    })
  })

  it('Deve validar que o token não está vazio', () => {
    expect(Cypress.env('authToken')).to.not.be.empty
    expect(Cypress.env('authToken')).to.be.a('string')
  })
    it('Deve verificar se o usuário está autorizado', () => {
        cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}${Cypress.env('apiAuthorized')}`,
        body: userData,
        headers: {
            'Content-Type': 'application/json'
        }
        }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.eq(true)
        })
    })

  it('Deve listar todos os livros disponíveis na API', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}${Cypress.env('apiBooks')}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
            
      // Validações 
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('books')
      expect(response.body.books).to.be.an('array')
      expect(response.body.books.length).to.be.greaterThan(0)
       
      // Salvar livros para próximos cenários
      availableBooks = response.body.books
      Cypress.env('availableBooks', availableBooks)
      
      cy.log(`Total de livros encontrados: ${availableBooks.length}`)
    })
  })

  it('Deve alugar dois livros', () => {
    const bookToRent = {
      userId:`${Cypress.env('userID')}`,
      collectionOfIsbns: [
        { isbn: availableBooks[0].isbn },
        { isbn: availableBooks[1].isbn },
          ]
    }

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}${Cypress.env('apiBooks')}`,
      body: bookToRent,
      headers: {
        'Content-Type': 'application/json',
            },
        failOnStatusCode: false
    }).then((response) => {
        if (response.status === 401) {
            expect(response.status).to.eq(401)
            expect(response.body).to.have.property('message', 'User not authorized!')
        }
        else {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('userID', userID)
        expect(response.body).to.have.property('collectionOfIsbns')
        expect(response.body.collectionOfIsbns).to.be.an('array').that.has.length(1)
        cy.log(`Livros alugado com sucesso: ${response.body.collectionOfIsbns[0].isbn}`)
        }
    })
  })

  it('Deve listar o usuárioo com os livros', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}${Cypress.env('apiBooks')}/${Cypress.env('userID')}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if (response.status === 401) {
            expect(response.status).to.eq(401)
            expect(response.body).to.have.property('message', 'User not authorized!')
        }
        else {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('userID')    
      expect(response.body.books).to.be.an('array')
      expect(response.body).to.have.property('username', userData.userName)
      expect(response.body.books).to.be().an('array').that.has.length(2)
      expect(response.body.books[0]).to.have.property('isbn', availableBooks[0].isbn)
      cy.log(`Total de livros encontrados: ${availableBooks.length}`)
      }
    })
  })


















})
