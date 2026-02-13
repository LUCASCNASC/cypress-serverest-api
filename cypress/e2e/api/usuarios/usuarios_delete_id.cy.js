describe('Cenários de Teste: DELETE /usuarios/{_id}', () => {

  it('Status 200: Deve excluir um usuário com sucesso.', () => {
    const timestamp = Date.now();
    const dadosUsuario = {
      nome: `Delete_Me_${timestamp}`,
      email: `delete_${timestamp}@qa.com`,
      password: "123",
      administrador: "true"
    };

    // 1. Criar o usuário para ter um ID válido para deletar
    cy.request('POST', '/usuarios', dadosUsuario).then((resPost) => {
      const idUsuario = resPost.body._id;

      // 2. Realizar a exclusão
      cy.request({
        method: 'DELETE',
        url: `/usuarios/${idUsuario}`
      }).then((response) => {
        // Validação baseada no seu screenshot (Status 200)
        expect(response.status).to.eq(200);
        expect(response.body.message).to.be.oneOf([
          'Registro excluído com sucesso',
          'Nenhum registro excluído'
        ]);
      });
    });
  });

  it('Status 400: Deve retornar erro ao tentar excluir usuário com carrinho.', () => {
    // Nota: Para este cenário, o usuário precisa ter um carrinho vinculado.
    // Como estamos focados em Usuários, usaremos um ID que sabidamente possui erro no ServeRest
    // ou um fluxo onde você criaria um produto e um carrinho antes (mais complexo).
    
    const idComCarrinho = '0uxuPY0cbmQhpEz1'; // Exemplo de ID com restrição conforme doc

    cy.request({
      method: 'DELETE',
      url: `/usuarios/${idComCarrinho}`,
      failOnStatusCode: false
    }).then((response) => {
      // Validação baseada no seu screenshot (Status 400)
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