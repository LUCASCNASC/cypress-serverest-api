describe('Cenários de Teste: POST /carrinhos', () => {
  let tokenValido;
  let idProduto;

  before(() => {
    // 1. Criar um Admin para cadastrar um produto (estoque necessário para o carrinho)
    const emailAdmin = `admin_car_${Date.now()}@qa.com`;
    cy.request('POST', '/usuarios', {
      nome: "Admin", email: emailAdmin, password: "teste", administrador: "true"
    }).then(() => {
      cy.request('POST', '/login', { email: emailAdmin, password: "teste" })
        .then(res => {
          const tokenAdmin = res.body.authorization;
          
          // 2. Cadastrar um produto com estoque para ser usado nos carrinhos
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
    // 3. Criar um usuário novo para cada teste (Garante que não tenha carrinho prévio)
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

  it('Deve cadastrar um carrinho com sucesso (Status 201)', () => {
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

  it('Deve validar erro ao tentar ter mais de 1 carrinho (Status 400)', () => {
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

  it('Deve validar erro de token ausente ou inválido (Status 401)', () => {
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