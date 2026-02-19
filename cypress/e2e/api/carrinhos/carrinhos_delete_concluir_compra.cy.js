describe('DELETE /carrinhos/concluir-compra', () => {
  let tokenValido;

  beforeEach(() => {
    const timestamp = Date.now();
    const emailAdmin = `admin_compra_${timestamp}@qa.com`;
    const emailUser = `user_compra_${timestamp}@qa.com`;

    // Criar e logar com Admin para preparar o produto com estoque
    cy.request('POST', '/usuarios', {
      nome: "Admin", email: emailAdmin, password: "teste", administrador: "true"
    }).then(() => {
      cy.request('POST', '/login', { email: emailAdmin, password: "teste" }).then(res => {
        const tokenAdmin = res.body.authorization;

        // Cadastrar produto necessário para o carrinho
        cy.request({
          method: 'POST',
          url: '/produtos',
          headers: { authorization: tokenAdmin },
          body: { nome: `Prod_Concluir_${timestamp}`, preco: 50, descricao: "D", quantidade: 100 }
        }).then(resProd => {
          const idProd = resProd.body._id;

          // Criar usuário que fará a compra e logar
          cy.request('POST', '/usuarios', {
            nome: "Comprador", email: emailUser, password: "teste", administrador: "false"
          }).then(() => {
            cy.request('POST', '/login', { email: emailUser, password: "teste" }).then(resLog => {
              tokenValido = resLog.body.authorization;

              // Criar o carrinho para o usuário para que haja o que concluir
              cy.request({
                method: 'POST',
                url: '/carrinhos',
                headers: { authorization: tokenValido },
                body: { produtos: [{ idProduto: idProd, quantidade: 2 }] }
              });
            });
          });
        });
      });
    });
  });

  it('Status 200: It should complete the purchase successfully.', () => {
    cy.request({
      method: 'DELETE',
      url: '/carrinhos/concluir-compra',
      headers: { authorization: tokenValido }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Registro excluído com sucesso');
    });
  });

  it('Status 401: It should return an error when trying to complete without an access token.', () => {
    cy.request({
      method: 'DELETE',
      url: '/carrinhos/concluir-compra',
      headers: { authorization: '' }, // Token ausente
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.contain('Token de acesso ausente, inválido, expirado');
    });
  });
});