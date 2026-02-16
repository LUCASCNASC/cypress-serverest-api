describe('Cenários de Teste: GET /usuarios', () => {

  it('Status 200: It should list all successfully registered users.', () => {
    cy.request({
      method: 'GET',
      url: '/usuarios'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('quantidade');
      expect(response.body).to.have.property('usuarios');
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