describe('API Login - ServeRest', () => {

  const endpoint = '/login'
  const usersEndpoint = '/usuarios'

  let emailValid
  let senhaValid

  before(() => {
    // Criar usuário antes dos testes
    const timestamp = Date.now()
    emailValid = `qa_${timestamp}@test.com`
    senhaValid = 'Teste123!'

    cy.request({
      method: 'POST',
      url: usersEndpoint,
      body: {
        nome: 'Usuário Login Teste',
        email: emailValid,
        password: senhaValid,
        administrador: 'true'
      }
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.message).to.eq('Cadastro realizado com sucesso')
    })
  })

  context('Positive scenarios', () => {

    it('Login success', () => {
      cy.request({
        method: 'POST',
        url: endpoint,
        body: {
          email: emailValid,
          password: senhaValid
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('Login realizado com sucesso')
        expect(response.body).to.have.property('authorization')
        expect(response.body.authorization).to.be.a('string')
        expect(response.body.authorization).to.contain('Bearer')
      })
    })

  })

  context('Negative Scenarios - Invalid credentials', () => {

    it('Try login with invalid email', () => {
      cy.request({
        method: 'POST',
        url: endpoint,
        failOnStatusCode: false,
        body: {
          email: 'email_invalido@qa.com',
          password: senhaValid
        }
      }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body.message).to.eq('Email e/ou senha inválidos')
      })
    })

    it('Try login with invalid password', () => {
      cy.request({
        method: 'POST',
        url: endpoint,
        failOnStatusCode: false,
        body: {
          email: emailValid,
          password: 'senhaErrada123'
        }
      }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body.message).to.eq('Email e/ou senha inválidos')
      })
    })

    it('Try login with invalid email and password', () => {
      cy.request({
        method: 'POST',
        url: endpoint,
        failOnStatusCode: false,
        body: {
          email: 'email_invalido@qa.com',
          password: 'senhaErrada123'
        }
      }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body.message).to.eq('Email e/ou senha inválidos')
      })
    })

  })

  context('Negative Scenarios - Required fields empty', () => {

    it('Try login with empty email', () => {
      cy.request({
        method: 'POST',
        url: endpoint,
        failOnStatusCode: false,
        body: {
          password: senhaValid
        }
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.email).to.eq('email é obrigatório')
      })
    })

    it('Try login with empty password', () => {
      cy.request({
        method: 'POST',
        url: endpoint,
        failOnStatusCode: false,
        body: {
          email: emailValid
        }
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.password).to.eq('password é obrigatório')
      })
    })

    it('Try login with empty email and password', () => {
      cy.request({
        method: 'POST',
        url: endpoint,
        failOnStatusCode: false,
        body: {}
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.email).to.eq('email é obrigatório')
        expect(response.body.password).to.eq('password é obrigatório')
      })
    })

  })
  
})
