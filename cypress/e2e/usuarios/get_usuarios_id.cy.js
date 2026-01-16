import { faker } from '@faker-js/faker'

describe('API Produtos - Validações 200 e 400', () => {

  const endpoint = '/produtos'
  let token

  before(() => {
    cy.request({
      method: 'POST',
      url: '/login',
      body: {
        email: Cypress.env('EMAIL_USER_VALID'),
        password: Cypress.env('SENHA_USER_VALID')
      }
    }).then((response) => {
      token = response.body.authorization
    })
  })

  it('Deve cadastrar produto com sucesso - status 201', () => {

    const produto = {
      nome: faker.commerce.productName(),
      preco: faker.number.int({ min: 10, max: 500 }),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 1, max: 20 })
    }

    cy.request({
      method: 'POST',
      url: endpoint,
      headers: {
        Authorization: token
      },
      body: produto
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.message).to.eq('Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id')
    })
  })

  it('Deve retornar 400 ao tentar cadastrar produto com nome duplicado', () => {

    const produtoDuplicado = {
      nome: faker.commerce.productName(),
      preco: 100,
      descricao: 'Teste produto duplicado',
      quantidade: 5
    }

    // Primeiro cadastro
    cy.request({
      method: 'POST',
      url: endpoint,
      headers: {
        Authorization: token
      },
      body: produtoDuplicado
    }).then((response) => {
      expect(response.status).to.eq(201)
    })

    // Segundo cadastro com o mesmo nome → erro esperado
    cy.request({
      method: 'POST',
      url: endpoint,
      failOnStatusCode: false,
      headers: {
        Authorization: token
      },
      body: produtoDuplicado
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.message).to.eq('Já existe produto com esse nome')
    })
  })

})
