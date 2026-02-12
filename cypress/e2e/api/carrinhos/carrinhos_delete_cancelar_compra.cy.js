describe('Cenários de Teste: Concluir Compra', () => {
  let tokenValido;

  beforeEach(() => {
    const timestamp = Date.now();
    const emailAdmin = `admin_compra_${timestamp}@qa.com`;
    const emailUser = `user_compra_${timestamp}@qa.com`;

    // 1. Criar e logar com Admin para prover produto com estoque
    cy.request('POST', '/usuarios', {
      nome: "Admin", email: emailAdmin, password: "teste", administrador: "true"
    }).then(() => {
      cy.request('POST', '/login', { email: emailAdmin, password: "teste" }).then(res => {
        const tokenAdmin = res.body.authorization;

        // 2. Cadastrar produto necessário para o carrinho
        cy.request({
          method: 'POST',
          url: '/produtos',
          headers: { authorization: tokenAdmin },
          body: { nome: `Produto_Compra_${timestamp}`, preco: 50, descricao: "D", quantidade: 100 }
        }).then(resProd => {
          const idProd = resProd.body._id;

          // 3. Criar usuário comprador e logar
          cy.request('POST', '/usuarios', {
            nome: "Comprador", email: emailUser, password: "teste", administrador: "false"
          }).then(() => {
            cy.request('POST', '/login', { email: emailUser, password: "teste" }).then(resLog => {
              tokenValido = resLog.body.authorization;

              // 4. Criar o carrinho para o usuário
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

  it('Deve concluir a compra com sucesso (Status 200)', () => {
    cy.request({
      method: 'DELETE',
      url: '/carrinhos/concluir-compra',
      headers: { authorization: tokenValido }
    }).then((response) => {
      // Validação baseada no seu screenshot
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Registro excluído com sucesso');
    });
  });

  it('Deve retornar erro ao tentar concluir sem token de acesso (Status 401)', () => {
    cy.request({
      method: 'DELETE',
      url: '/carrinhos/concluir-compra',
      headers: { authorization: '' }, // Token ausente
      failOnStatusCode: false
    }).then((response) => {
      // Validação baseada na documentação de erro
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
    });
  });
});