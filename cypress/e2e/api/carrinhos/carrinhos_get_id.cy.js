describe('Cenários de Teste: GET /carrinhos/{_id}', () => {
  let token;
  let idCarrinho;

  before(() => {
    const timestamp = Date.now();
    const emailAdmin = `admin_cart_${timestamp}@qa.com`;

    // Criar e logar com Admin para prover Produto e Carrinho
    cy.request('POST', '/usuarios', {
      nome: "Lucas Camargo", email: emailAdmin, password: "teste", administrador: "true"
    }).then(() => {
      cy.request('POST', '/login', { email: emailAdmin, password: "teste" }).then(res => {
        token = res.body.authorization;

        // Criar um produto para colocar no carrinho
        cy.request({
          method: 'POST',
          url: '/produtos',
          headers: { authorization: token },
          body: { nome: `Produto_Cart_${timestamp}`, preco: 100, descricao: "Desc", quantidade: 100 }
        }).then(resProd => {
          const idProduto = resProd.body._id;

          // Criar o carrinho e capturar o ID dele
          cy.request({
            method: 'POST',
            url: '/carrinhos',
            headers: { authorization: token },
            body: { produtos: [{ idProduto: idProduto, quantidade: 1 }] }
          }).then(resCart => {
            idCarrinho = resCart.body._id;
          });
        });
      });
    });
  });

  it('Status 200: Deve buscar um carrinho por ID com sucesso.', () => {
    cy.request({
      method: 'GET',
      url: `/carrinhos/${idCarrinho}`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('_id', idCarrinho);
      expect(response.body).to.have.property('produtos');
      expect(response.body.produtos).to.be.an('array');
      expect(response.body).to.have.property('precoTotal');
      expect(response.body).to.have.property('quantidadeTotal');
      expect(response.body).to.have.property('idUsuario');
    });
  });

  it('Status 400: Deve retornar erro ao buscar carrinho inexistente.', () => {
    // Usando um ID com formato correto (24 chars NoSQL) mas que não existe
    const idFake = '0uxuPY0cbmQhpEz1'; 

    cy.request({
      method: 'GET',
      url: `/carrinhos/${idFake}`,
      failOnStatusCode: false // Permite que o Cypress valide o erro 400
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Carrinho não encontrado');
    });
  });
});