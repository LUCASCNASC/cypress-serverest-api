describe('Cenários de Teste: POST /usuarios', () => {

  it('Status 201: It should successfully register a user - Dynamic Data', () => {
    // Gerando sufixo único baseado no timestamp atual
    const timestamp = Date.now();
    
    const dadosUsuario = {
      nome: `User_${timestamp}`,
      email: `email_${timestamp}@qa.com`,
      password: `pass_${timestamp}`,
      administrador: "true"
    };

    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: dadosUsuario
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(response.body).to.have.property('_id');
      
      // Armazenando o ID para os próximos testes de GET, PUT e DELETE
      Cypress.env('lastUserId', response.body._id);
    });
  });

  it('Status 400: It should validate that it is not allowed to register a user with an email already in use.', () => {
    // Definimos uma massa de dados única para este teste
    const dadosUsuario = {
      nome: "Lucas Teste Duplicado",
      email: `lucas_burn_${Date.now()}@qa.com`,
      password: "teste",
      administrador: "true"
    };

    // Primeiro cadastro: Criamos o usuário para garantir que ele existe
    cy.request('POST', '/usuarios', dadosUsuario).then((resCadastro) => {
      expect(resCadastro.status).to.eq(201);

      // Segundo cadastro: Tentamos enviar EXATAMENTE os mesmos dados
      cy.request({
        method: 'POST',
        url: '/usuarios',
        failOnStatusCode: false,
        body: dadosUsuario
      }).then((resDuplicado) => {
        expect(resDuplicado.status).to.eq(400);
        expect(resDuplicado.body.message).to.eq('Este email já está sendo usado');
      });
    });
  });

});