describe('Cenários de Teste: GET /produtos', () => {

  it('Status 200: It should list all successfully registered products.', () => {
    cy.request({
      method: 'GET',
      url: '/produtos'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('quantidade');
      expect(response.body).to.have.property('produtos');
      expect(response.body.produtos).to.be.an('array');
      expect(response.body.quantidade).to.be.a('number');
      expect(response.body.quantidade).to.eq(response.body.produtos.length);

      // Validação de Contrato: verifica a estrutura do primeiro item se a lista não estiver vazia
      if (response.body.quantidade > 0) {
        const produto = response.body.produtos[0];
        expect(produto).to.have.all.keys('nome', 'preco', 'descricao', 'quantidade', '_id');
      }
    });
  });

});