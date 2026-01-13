describe('API Usuários - GET /usuarios', () => {

    const endpoint = '/usuarios'

    it('Deve listar todos os usuários com sucesso', () => {
        cy.request({
        method: 'GET',
        url: endpoint
        }).then((response) => {
        expect(response.status).to.eq(200)

        // valida estrutura principal
        expect(response.body).to.have.property('quantidade')
        expect(response.body).to.have.property('usuarios')
        expect(response.body.usuarios).to.be.an('array')

        // valida estrutura do primeiro usuário (se existir)
        if (response.body.usuarios.length > 0) {
            const usuario = response.body.usuarios[0]

            expect(usuario).to.have.property('_id')
            expect(usuario).to.have.property('nome')
            expect(usuario).to.have.property('email')
            expect(usuario).to.have.property('password')
            expect(usuario).to.have.property('administrador')
        }
        })
    })

    it('Deve buscar usuário por email', () => {
        cy.request({
        method: 'GET',
        url: endpoint,
        qs: {
            email: Cypress.env('EMAIL_USER_VALID')
        }
        }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.be.greaterThan(0)

        response.body.usuarios.forEach((usuario) => {
            expect(usuario.email).to.eq(Cypress.env('EMAIL_USER_VALID'))
        })
        })
    })

    it('Deve buscar usuários administradores', () => {
        cy.request({
        method: 'GET',
        url: endpoint,
        qs: {
            administrador: 'true'
        }
        }).then((response) => {
        expect(response.status).to.eq(200)

        response.body.usuarios.forEach((usuario) => {
            expect(usuario.administrador).to.eq('true')
        })
        })
    })

    it('Deve buscar usuário por nome', () => {
        cy.request({
        method: 'GET',
        url: endpoint,
        qs: {
            nome: 'Usuario'
        }
        }).then((response) => {
        expect(response.status).to.eq(200)

        response.body.usuarios.forEach((usuario) => {
            expect(usuario.nome).to.include('Usuario')
        })
        })
    })

    it('Deve retornar lista vazia quando filtro não encontrar usuários', () => {
        cy.request({
        method: 'GET',
        url: endpoint,
        qs: {
            email: `inexistente_${Date.now()}@qa.com`
        }
        }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.eq(0)
        expect(response.body.usuarios).to.be.an('array').that.is.empty
        })
    })

})
