describe('Cenários de Teste: POST /carrinhos', () => {
  let tokenValido;
  let idProduto;

  before(() => {
    // Criar um Admin para cadastrar um produto (estoque necessário para o carrinho)
    const emailAdmin = `admin_car_${Date.now()}@qa.com`;
    cy.request('POST', '/usuarios', {
      nome: "Admin", email: emailAdmin, password: "teste", administrador: "true"
    }).then(() => {
      cy.request('POST', '/login', { email: emailAdmin, password: "teste" })
        .then(res => {
          const tokenAdmin = res.body.authorization;
          
          // Cadastrar um produto com estoque para ser usado nos carrinhos
          cy.request({
            method: 'POST',
            url: '/produtos',
            headers: { authorization: tokenAdmin },
            body: { 
              nome: `Produto_Cart_${Date.now()}`, 
              preco: 100, 
              descricao: "Item de Teste", 
              quantidade: 1000 
            }
          }).then(resProd => {
            idProduto = resProd.body._id;
          });
        });
    });
  });

  beforeEach(() => {
    // Criar um usuário novo para cada teste (Garante que não tenha carrinho prévio)
    const emailUser = `user_car_${Date.now()}@qa.com`;
    cy.request('POST', '/usuarios', {
      nome: "User Teste", email: emailUser, password: "teste", administrador: "false"
    }).then(() => {
      cy.request('POST', '/login', { email: emailUser, password: "teste" })
        .then(res => {
          tokenValido = res.body.authorization;
        });
    });
  });

  it('Status 201: It should successfully register a cart.', () => {
    cy.request({
      method: 'POST',
      url: '/carrinhos',
      headers: { authorization: tokenValido },
      body: {
        produtos: [
          { idProduto: idProduto, quantidade: 1 }
        ]
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(response.body).to.have.property('_id');
    });
  });

  it('Status 400: It should validate error when trying to have more than 1 cart.', () => {
    const payload = {
      produtos: [{ idProduto: idProduto, quantidade: 1 }]
    };

    // Cadastra o primeiro carrinho
    cy.request({
      method: 'POST',
      url: '/carrinhos',
      headers: { authorization: tokenValido },
      body: payload
    }).then(() => {
      // Tenta cadastrar o segundo para o mesmo usuário/token
      cy.request({
        method: 'POST',
        url: '/carrinhos',
        headers: { authorization: tokenValido },
        failOnStatusCode: false,
        body: payload
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Não é permitido ter mais de 1 carrinho');
      });
    });
  });

  it('Status 401: It should validate error of missing or invalid token.', () => {
    cy.request({
      method: 'POST',
      url: '/carrinhos',
      headers: { authorization: 'Bearer token_invalido' },
      failOnStatusCode: false,
      body: {
        produtos: [{ idProduto: idProduto, quantidade: 1 }]
      }
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.contain('Token de acesso ausente, inválido, expirado');
    });
  });
});