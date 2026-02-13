describe('Cenários de Teste: GET /usuarios', () => {

  it('Status 200: Deve listar todos os usuários cadastrados com sucesso.', () => {
    cy.request({
      method: 'GET',
      url: '/usuarios'
    }).then((response) => {
      // Validações baseadas no seu screenshot da documentação
      expect(response.status).to.eq(200);
      
      // Verifica se as propriedades principais existem na resposta
      expect(response.body).to.have.property('quantidade');
      expect(response.body).to.have.property('usuarios');
      
      // Valida se 'usuarios' é um array e se a quantidade condiz com o tamanho do array
      expect(response.body.usuarios).to.be.an('array');
      expect(response.body.quantidade).to.eq(response.body.usuarios.length);

      // Validação de contrato: verifica se o primeiro usuário da lista tem os campos esperados
      if (response.body.quantidade > 0) {
        const usuario = response.body.usuarios[0];
        expect(usuario).to.have.all.keys('nome', 'email', 'password', 'administrador', '_id');
      }
    });
  });

});