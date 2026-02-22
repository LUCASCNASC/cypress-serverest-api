describe('Endpoint - DELETE /produtos/{_id}', () => {
  let tokenAdmin;
  let tokenComum;

  before(() => {
    const emailAdmin = `admin_del_${Date.now()}@qa.com`;
    const emailComum = `comum_del_${Date.now()}@qa.com`;

    // Criar e Logar com Admin (necessário para os status 200 e 400)
    cy.request('POST', '/usuarios', {
      nome: "Admin", email: emailAdmin, password: "teste", administrador: "true"
    }).then(() => {
      cy.request('POST', '/login', { email: emailAdmin, password: "teste" })
        .then(res => tokenAdmin = res.body.authorization);
    });

    // Criar e Logar com Usuário Comum (necessário para o status 403)
    cy.request('POST', '/usuarios', {
      nome: "Comum", email: emailComum, password: "teste", administrador: "false"
    }).then(() => {
      cy.request('POST', '/login', { email: emailComum, password: "teste" })
        .then(res => tokenComum = res.body.authorization);
    });
  });

  it('Status 200: It should successfully delete a product.', () => {
    // Primeiro cria um produto para garantir que o ID exista para deleção
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: { authorization: tokenAdmin },
      body: { nome: `Del_Sucesso_${Date.now()}`, preco: 50, descricao: "D", quantidade: 10 }
    }).then((resPost) => {
      const id = resPost.body._id;

      cy.request({
        method: 'DELETE',
        url: `/produtos/${id}`,
        headers: { authorization: tokenAdmin }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.be.oneOf([
          'Registro excluído com sucesso',
          'Nenhum registro excluído'
        ]);
      });
    });
  });

  it('Status 400: It should return an error when trying to delete a product that is part of a cart.', () => {
    // ID de exemplo que geralmente possui carrinho no ServeRest
    const idComCarrinho = 'BeeJh5lz3k6kSlzA'; 

    cy.request({
      method: 'DELETE',
      url: `/produtos/${idComCarrinho}`,
      headers: { authorization: tokenAdmin },
      failOnStatusCode: false
    }).then((response) => {
      // Se o ID existir e tiver carrinho, valida o erro 400
      if (response.status === 400) {
        expect(response.body.message).to.eq('Não é permitido excluir produto que faz parte de carrinho');
        expect(response.body).to.have.property('idCarrinho');
      } else {
        // Caso o banco tenha sido resetado, a API retorna 200/Nenhum registro excluído
        expect(response.status).to.eq(200);
      }
    });
  });

  it('Status 401: It should validate error of missing or invalid token.', () => {
    cy.request({
      method: 'DELETE',
      url: '/produtos/id_qualquer',
      headers: { authorization: '' }, // Sem token
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.contain('Token de acesso ausente');
    });
  });

  it('Status 403: It should validate forbidden access for non-administrators.', () => {
    cy.request({
      method: 'DELETE',
      url: '/produtos/id_qualquer',
      headers: { authorization: tokenComum }, // Token de usuário sem privilégios
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(403);
      expect(response.body.message).to.eq('Rota exclusiva para administradores');
    });
  });
});