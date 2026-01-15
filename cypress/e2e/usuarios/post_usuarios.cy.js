import { faker } from '@faker-js/faker'

describe('API Usuários - POST /usuarios', () => {

  const endpoint = '/usuarios'

  context('Positive scenarios', () => {

    it('create a new user administrator', () => {

        const usuario = {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(10),
        administrador: 'true'
        }

        cy.request({
        method: 'POST',
        url: endpoint,
        body: usuario
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.message).to.eq('Cadastro realizado com sucesso')
        expect(response.body).to.have.property('_id')
      })
      
    })

    it('Não deve permitir cadastro com e-mail já cadastrado', () => {

        const usuario = {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(10),
        administrador: 'true'
        }

        //Primeiro cadastro (sucesso)
        cy.request({
        method: 'POST',
        url: '/usuarios',
        body: usuario
        }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.message).to.eq('Cadastro realizado com sucesso')
        })

        //Segundo cadastro com o MESMO email (erro esperado)
        cy.request({
        method: 'POST',
        url: '/usuarios',
        failOnStatusCode: false,
        body: usuario
        }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.message).to.eq('Este email já está sendo usado')
        })

    })

    it('to try create a new user administrator without name', () => {

        const usuarioSemNome = {
            email: faker.internet.email(),
            password: faker.internet.password(10),
            administrador: 'true'
        }

        cy.request({
        method: 'POST',
        url: endpoint,
        failOnStatusCode: false,
        body: usuarioSemNome
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.message).to.eq('undefined')
      })
      
    })


  })

})