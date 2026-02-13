describe('Cenários de Teste: POST /produtos', () => {
  let tokenAdmin;
  let tokenComum;

  before(() => {
    const emailAdmin = `admin_${Date.now()}@qa.com`;
    const emailComum = `comum_${Date.now()}@qa.com`;

    // 1. Criar e Logar com Administrador (para status 201 e 400)
    cy.request('POST', '/usuarios', {
      nome: "Admin", email: emailAdmin, password: "teste", administrador: "true"
    }).then(() => {
      cy.request('POST', '/login', { email: emailAdmin, password: "teste" })
        .then(res => tokenAdmin = res.body.authorization);
    });

    // 2. Criar e Logar com Usuário Comum (para status 403)
    cy.request('POST', '/usuarios', {
      nome: "Comum", email: emailComum, password: "teste", administrador: "false"
    }).then(() => {
      cy.request('POST', '/login', { email: emailComum, password: "teste" })
        .then(res => tokenComum = res.body.authorization);
    });
  });

  it('Status 201: Deve cadastrar um produto com sucesso.', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: { authorization: tokenAdmin },
      body: {
        nome: `Produto_${Date.now()}`,
        preco: 100,
        descricao: "Novo Produto",
        quantidade: 10
      }
    }).then(res => {
      expect(res.status).to.eq(201);
      expect(res.body.message).to.eq('Cadastro realizado com sucesso');
    });
  });

  it('Status 400: Deve validar erro de nome já existente.', () => {
    const nomeFixo = `Repetido_${Date.now()}`;
    
    // Cadastra o primeiro
    cy.request({
      method: 'POST', url: '/produtos', headers: { authorization: tokenAdmin },
      body: { nome: nomeFixo, preco: 10, descricao: "D", quantidade: 1 }
    });

    // Tenta cadastrar o segundo com mesmo nome
    cy.request({
      method: 'POST', url: '/produtos', headers: { authorization: tokenAdmin },
      failOnStatusCode: false,
      body: { nome: nomeFixo, preco: 10, descricao: "D", quantidade: 1 }
    }).then(res => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.eq('Já existe produto com esse nome');
    });
  });

  it('Status 401; Deve validar erro de token ausente ou inválido.', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: { authorization: 'invalid_token' },
      failOnStatusCode: false,
      body: { nome: "Sem Token", preco: 1, descricao: "D", quantidade: 1 }
    }).then(res => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
    });
  });

  it('Status 403: Deve validar acesso proibido para usuários não admin.', () => {
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: { authorization: tokenComum },
      failOnStatusCode: false,
      body: { nome: "Proibido", preco: 1, descricao: "D", quantidade: 1 }
    }).then(res => {
      expect(res.status).to.eq(403);
      expect(res.body.message).to.eq('Rota exclusiva para administradores');
    });
  });
});