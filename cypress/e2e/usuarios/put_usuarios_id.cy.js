import { faker } from '@faker-js/faker'

describe('API Usuários - Validações do endpoint /usuarios', () => {

  const endpoint = '/usuarios'

  it('Deve cadastrar usuário com sucesso - status 201', () => {

    const novoUsuario = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: 'true'
    }

    cy.request({
      method: 'POST',
      url: endpoint,
      body: novoUsuario
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.message).to.eq('Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id')
    })
  })

  it('Deve retornar 400 ao tentar cadastrar email já existente', () => {

    const usuario = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123456',
      administrador: 'true'
    }

    // Primeiro cadastro
    cy.request({
      method: 'POST',
      url: endpoint,
      body: usuario
    }).then((response) => {
      expect(response.status).to.eq(201)
    })

    // Segundo cadastro com mesmo email
    cy.request({
      method: 'POST',
      url: endpoint,
      failOnStatusCode: false,
      body: usuario
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.message).to.eq('Este email já está sendo usado')
    })
  })

  it('Deve retornar 400 ao tentar cadastrar sem email', () => {

    const usuarioSemEmail = {
      nome: faker.person.fullName(),
      password: '123456',
      administrador: 'true'
    }

    cy.request({
      method: 'POST',
      url: endpoint,
      failOnStatusCode: false,
      body: usuarioSemEmail
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.email).to.eq('email é obrigatório')
    })
  })

  it('Deve retornar 400 ao tentar cadastrar sem senha', () => {

    const usuarioSemSenha = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      administrador: 'true'
    }

    cy.request({
      method: 'POST',
      url: endpoint,
      failOnStatusCode: false,
      body: usuarioSemSenha
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.password).to.eq('password é obrigatório')
    })
  })

  it('Deve retornar 400 ao tentar cadastrar sem nome', () => {

    const usuarioSemNome = {
      email: faker.internet.email(),
      password: '123456',
      administrador: 'true'
    }

    cy.request({
      method: 'POST',
      url: endpoint,
      failOnStatusCode: false,
      body: usuarioSemNome
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.nome).to.eq('nome é obrigatório')
    })
  })

  it('Deve retornar 400 ao enviar payload vazio', () => {

    cy.request({
      method: 'POST',
      url: endpoint,
      failOnStatusCode: false,
      body: {}
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('nome')
      expect(response.body).to.have.property('email')
      expect(response.body).to.have.property('password')
    })
  })

})
