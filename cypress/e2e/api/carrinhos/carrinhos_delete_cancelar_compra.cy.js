describe('Serverest Endpoint - DELETE /carrinhos/cancelar-compra', () => {
  let tokenValido;

  beforeEach(() => {
    const timestamp = Date.now();
    const emailAdmin = `admin_compra_${timestamp}@qa.com`;
    const emailUser = `user_compra_${timestamp}@qa.com`;

    // Create and log in with Admin to provide product with stock
    cy.request('POST', '/usuarios', {
      nome: "Admin", email: emailAdmin, password: "teste", administrador: "true"
    }).then(() => {
      cy.request('POST', '/login', { email: emailAdmin, password: "teste" }).then(res => {
        const tokenAdmin = res.body.authorization;

        // Register product necessary for the cart
        cy.request({
          method: 'POST',
          url: '/produtos',
          headers: { authorization: tokenAdmin },
          body: { nome: `Produto_Compra_${timestamp}`, preco: 50, descricao: "D", quantidade: 100 }
        }).then(resProd => {
          const idProd = resProd.body._id;

          // Create user comprador and to log in
          cy.request('POST', '/usuarios', {
            nome: "Comprador", email: emailUser, password: "teste", administrador: "false"
          }).then(() => {
            cy.request('POST', '/login', { email: emailUser, password: "teste" }).then(resLog => {
              tokenValido = resLog.body.authorization;

              // Create the cart to the user
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

  it('Status code 200: It should complete the purchase successfully.', () => {
    cy.request({
      method: 'DELETE',
      url: '/carrinhos/concluir-compra',
      headers: { authorization: tokenValido }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Registro excluído com sucesso');
    });
  });

  it('Status code 401: It should return an error when trying to complete without an access token.', () => {
    cy.request({
      method: 'DELETE',
      url: '/carrinhos/concluir-compra',
      headers: { authorization: '' }, // Token empty
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
    });
  });
});
