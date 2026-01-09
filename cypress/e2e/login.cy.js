describe('API Login - ServeRest', () => {

  const endpoint = '/login'

  const emailValid = Cypress.env('EMAIL_USER_VALID')
  const senhaValid = Cypress.env('SENHA_USER_VALID')

  describe('Positive scenarios', () => {

    it('login sucess', () => {

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

  describe('Negative Scenarios - Invalid credentials', () => {

    it('To try login with invalid email', () => {
      
    })

    it('To try login with invalid password', () => {
      
    })

    it('To try login with invalid email and password', () => {
      
    })

  })

  describe('Negative Scenarios - Required fields empty', () => {

    it('To try login with empty email', () => {
      
    })

    it('To try login with empty password', () => {
      
    })

    it('To try login with empty email and password', () => {
      
    })

  })

})
