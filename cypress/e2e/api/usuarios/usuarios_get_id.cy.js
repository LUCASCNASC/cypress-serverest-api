describe('Cenários de Teste: GET /usuarios/{_id}', () => {

  it('Status 200: Deve buscar um usuário pelo ID com sucesso.', () => {
    // Criar um novo usuário para garantir que o ID existe
    const timestamp = Date.now();
    const dadosUsuario = {
      nome: `Busca_${timestamp}`,
      email: `busca_${timestamp}@qa.com`,
      password: `pass_${timestamp}`,
      administrador: "true"
    };

    cy.request('POST', '/usuarios', dadosUsuario).then((resPost) => {
      expect(resPost.status).to.eq(201);
      const idUsuario = resPost.body._id;

      // Utilizar o ID capturado para fazer o GET específico
      cy.request('GET', `/usuarios/${idUsuario}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('nome', dadosUsuario.nome);
        expect(response.body).to.have.property('email', dadosUsuario.email);
        expect(response.body).to.have.property('password', dadosUsuario.password);
        expect(response.body).to.have.property('administrador', dadosUsuario.administrador);
        expect(response.body).to.have.property('_id', idUsuario);
      });
    });
  });

  it('Status 400: Deve retornar erro ao buscar um ID inexistente.', () => {
    const idInexistente = '0aaaAA0aaaAaaAa0';

    cy.request({
      method: 'GET',
      url: `/usuarios/${idInexistente}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Usuário não encontrado');
    });
  });

  it('Status 400: Deve retornar erro ao buscar um ID inexistente, burlando a quantidade.', () => {
    const idIerrado = 'ID_QUE_NAO_EXISTE_123';

    cy.request({
      method: 'GET',
      url: `/usuarios/${idIerrado}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos');
    });
  });

});