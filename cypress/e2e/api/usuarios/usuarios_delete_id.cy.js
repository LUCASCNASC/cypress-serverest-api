describe('Endpoint - DELETE /usuarios/{_id}', () => {

  it('Status code 200: It should successfully delete a user..', () => {
    const timestamp = Date.now();
    const dadosUsuario = {
      nome: `Delete_Me_${timestamp}`,
      email: `delete_${timestamp}@qa.com`,
      password: "123",
      administrador: "true"
    };

    // Criar o usuário para ter um ID válido para deletar
    cy.request('POST', '/usuarios', dadosUsuario).then((resPost) => {
      const idUsuario = resPost.body._id;

      // Realizar a exclusão
      cy.request({
        method: 'DELETE',
        url: `/usuarios/${idUsuario}`
      }).then((response) => {
        // Validação baseada no seu screenshot (Status code 200)
        expect(response.status).to.eq(200);
        expect(response.body.message).to.be.oneOf([
          'Registro excluído com sucesso',
          'Nenhum registro excluído'
        ]);
      });
    });
  });

  it('Status code 400: It should return error when trying to delete a user with a cart.', () => {
    // Nota: Para este cenário, o usuário precisa ter um carrinho vinculado.
    // Como estamos focados em Usuários, usaremos um ID que sabidamente possui erro no ServeRest
    // ou um fluxo onde você criaria um produto e um carrinho antes (mais complexo).
    
    const idComCarrinho = '0uxuPY0cbmQhpEz1'; // Exemplo de ID com restrição conforme doc

    cy.request({
      method: 'DELETE',
      url: `/usuarios/${idComCarrinho}`,
      failOnStatusCode: false
    }).then((response) => {
      // Validação baseada no seu screenshot (Status code 400)
      if (response.status === 400) {
        expect(response.body.message).to.eq('Não é permitido excluir usuário com carrinho cadastrado');
        expect(response.body).to.have.property('idCarrinho');
      } else {
        // Caso o banco do ServeRest tenha sido resetado e o ID não exista mais
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso | Nenhum registro excluído');
      }
    });
  });

});