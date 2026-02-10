describe('Cenários de Teste: GET /produtos', () => {

  it('Deve listar todos os produtos cadastrados com sucesso (Status 200)', () => {
    cy.request({
      method: 'GET',
      url: '/produtos'
    }).then((response) => {
      // Validações baseadas no seu screenshot da documentação
      expect(response.status).to.eq(200);
      
      // Verifica se as propriedades principais estão presentes
      expect(response.body).to.have.property('quantidade');
      expect(response.body).to.have.property('produtos');
      
      // Valida se 'produtos' é um array e se a quantidade condiz com o tamanho do array
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