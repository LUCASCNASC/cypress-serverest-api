describe('Cenários de Teste: GET /usuarios/{_id}', () => {

  it('Deve buscar um usuário pelo ID com sucesso (Status 200)', () => {
    // 1. Criar um novo usuário para garantir que o ID existe
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

      // 2. Utilizar o ID capturado para fazer o GET específico
      cy.request('GET', `/usuarios/${idUsuario}`).then((response) => {
        // Validações baseadas no seu screenshot (Status 200)
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('nome', dadosUsuario.nome);
        expect(response.body).to.have.property('email', dadosUsuario.email);
        expect(response.body).to.have.property('password', dadosUsuario.password);
        expect(response.body).to.have.property('administrador', dadosUsuario.administrador);
        expect(response.body).to.have.property('_id', idUsuario);
      });
    });
  });

  it('Deve retornar erro ao buscar um ID inexistente (Status 400)', () => {
    const idInexistente = '0aaaAA0aaaAaaAa0';

    cy.request({
      method: 'GET',
      url: `/usuarios/${idInexistente}`,
      failOnStatusCode: false // Necessário para validar o erro 400
    }).then((response) => {
      // Validações baseadas no seu screenshot (Status 400)
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Usuário não encontrado');
    });
  });

  it('Deve retornar erro ao buscar um ID inexistente, burlando a quantidade (Status 400)', () => {
    const idIerrado = 'ID_QUE_NAO_EXISTE_123';

    cy.request({
      method: 'GET',
      url: `/usuarios/${idIerrado}`,
      failOnStatusCode: false // Necessário para validar o erro 400
    }).then((response) => {
      // Validações baseadas no seu screenshot (Status 400)
      expect(response.status).to.eq(400);
      expect(response.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos');
    });
  });

});