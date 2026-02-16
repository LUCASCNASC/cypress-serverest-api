describe('Cenários de Teste: PUT /produtos/{_id}', () => {
  let tokenAdmin;
  let tokenComum;

  before(() => {
    const emailAdmin = `admin_put_${Date.now()}@qa.com`;
    const emailComum = `comum_put_${Date.now()}@qa.com`;

    // Criar e Logar com Admin
    cy.request('POST', '/usuarios', {
      nome: "Admin", email: emailAdmin, password: "teste", administrador: "true"
    }).then(() => {
      cy.request('POST', '/login', { email: emailAdmin, password: "teste" })
        .then(res => tokenAdmin = res.body.authorization);
    });

    // Criar e Logar com Comum
    cy.request('POST', '/usuarios', {
      nome: "Comum", email: emailComum, password: "teste", administrador: "false"
    }).then(() => {
      cy.request('POST', '/login', { email: emailComum, password: "teste" })
        .then(res => tokenComum = res.body.authorization);
    });
  });

  it('Status 200: It should successfully modify a product.', () => {
    const nomeOriginal = `Prod_Original_${Date.now()}`;
    
    // Primeiro cria um produto para ter um ID real
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: { authorization: tokenAdmin },
      body: { nome: nomeOriginal, preco: 10, descricao: "Desc", quantidade: 1 }
    }).then((resPost) => {
      const id = resPost.body._id;

      // Realiza o PUT para editar
      cy.request({
        method: 'PUT',
        url: `/produtos/${id}`,
        headers: { authorization: tokenAdmin },
        body: {
          nome: `Prod_Alterado_${Date.now()}`,
          preco: 50,
          descricao: "Nova Descrição",
          quantidade: 100
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro alterado com sucesso');
      });
    });
  });

  it('Status 201: It should successfully register a new product if the ID does not exist.', () => {
    // Gerando um ID aleatório com exatamente 16 caracteres alfanuméricos
    const idValidoMasInexistente = Math.random().toString(36).substring(2, 10) + 
                                   Math.random().toString(36).substring(2, 10);
    
    cy.request({
      method: 'PUT',
      url: `/produtos/${idValidoMasInexistente}`,
      headers: { authorization: tokenAdmin },
      failOnStatusCode: false, // Boa prática para capturar a resposta mesmo se houver erro
      body: {
        nome: `Prod_Novo_PUT_${Date.now()}`,
        preco: 99,
        descricao: "Criado via PUT com ID de 16 chars",
        quantidade: 5
      }
    }).then((response) => {
      // Agora o status deve ser 201 conforme a documentação
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(response.body).to.have.property('_id');
    });
  });

  it('Status 400: It should validate error of existing product name.', () => {
    const nomeEmUso = `Nome_Ocupado_${Date.now()}`;

    // Cadastra Produto A (Dono do nome)
    cy.request({
      method: 'POST', 
      url: '/produtos', 
      headers: { authorization: tokenAdmin },
      body: { nome: nomeEmUso, preco: 1, descricao: "D", quantidade: 1 }
    });

    // Cadastra Produto B (O produto que tentaremos alterar)
    // Adicionamos failOnStatusCode: false para evitar quebras se o nome "Produto B" já existir
    cy.request({
      method: 'POST', 
      url: '/produtos', 
      headers: { authorization: tokenAdmin },
      failOnStatusCode: false, 
      body: { nome: `Prod_B_${Date.now()}`, preco: 1, descricao: "D", quantidade: 1 }
    }).then((resB) => {
      const idB = resB.body._id;

      // Tenta editar o Produto B usando o nome do Produto A
      cy.request({
        method: 'PUT',
        url: `/produtos/${idB}`,
        headers: { authorization: tokenAdmin },
        failOnStatusCode: false, // OBRIGATÓRIO aqui para validar o 400
        body: { 
          nome: nomeEmUso, // Aqui gera o conflito
          preco: 2, 
          descricao: "Alterando para nome duplicado", 
          quantidade: 1 
        }
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Já existe produto com esse nome');
      });
    });
  });

  it('Status 401: It should validate error of missing or invalid token.', () => {
    cy.request({
      method: 'PUT',
      url: '/produtos/qualquer_id',
      headers: { authorization: '' },
      failOnStatusCode: false,
      body: { nome: "X", preco: 1, descricao: "X", quantidade: 1 }
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.contain('Token de acesso ausente');
    });
  });

  it('Status 403: It should validate forbidden access for non-admin.', () => {
    cy.request({
      method: 'PUT',
      url: '/produtos/qualquer_id',
      headers: { authorization: tokenComum },
      failOnStatusCode: false,
      body: { nome: "X", preco: 1, descricao: "X", quantidade: 1 }
    }).then((response) => {
      expect(response.status).to.eq(403);
      expect(response.body.message).to.eq('Rota exclusiva para administradores');
    });
  });
});