describe('API Login - ServeRest', () => {

  const endpoint = '/login'

  const emailValid = Cypress.env('EMAIL_USER_VALID')
  const senhaValid = Cypress.env('SENHA_USER_VALID')

  describe('Positive scenarios', () => {

    it('login sucess', () => {
      
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
