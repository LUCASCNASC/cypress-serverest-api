describe('Cenários de Teste: POST /usuarios', () => {

  it('Status 201: Deve cadastrar um usuário com sucesso - Dados Dinâmicos', () => {
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
      // Validações de sucesso conforme a documentação
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(response.body).to.have.property('_id');
      
      // Armazenando o ID para os próximos testes de GET, PUT e DELETE
      Cypress.env('lastUserId', response.body._id);
    });
  });

  it('Status 400: Deve validar que não é permitido cadastrar usuário com e-mail já utilizado.', () => {
    // 1. Definimos uma massa de dados única para este teste
    const dadosUsuario = {
      nome: "Lucas Teste Duplicado",
      email: `lucas_burn_${Date.now()}@qa.com`,
      password: "teste",
      administrador: "true"
    };

    // 2. Primeiro cadastro: Criamos o usuário para garantir que ele existe
    cy.request('POST', '/usuarios', dadosUsuario).then((resCadastro) => {
      expect(resCadastro.status).to.eq(201);

      // 3. Segundo cadastro: Tentamos enviar EXATAMENTE os mesmos dados
      cy.request({
        method: 'POST',
        url: '/usuarios',
        failOnStatusCode: false, // Permite que o Cypress capture o erro 400
        body: dadosUsuario
      }).then((resDuplicado) => {
        // Validações baseadas no screenshot da documentação
        expect(resDuplicado.status).to.eq(400);
        expect(resDuplicado.body.message).to.eq('Este email já está sendo usado');
      });
    });
  });

});