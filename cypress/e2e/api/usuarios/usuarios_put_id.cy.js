describe('Endpoint - PUT /usuarios/{_id}', () => {

  it('Status 200: It should successfully change a user.', () => {
    const timestamp = Date.now();
    const dadosIniciais = {
      nome: `Original_${timestamp}`,
      email: `original_${timestamp}@qa.com`,
      password: "123",
      administrador: "true"
    };

    // Cria o usuário para garantir que o ID existe
    cy.request('POST', '/usuarios', dadosIniciais).then((resPost) => {
      const idUsuario = resPost.body._id;

      // Realiza o PUT para editar os dados
      cy.request({
        method: 'PUT',
        url: `/usuarios/${idUsuario}`,
        body: {
          nome: `Alterado_${timestamp}`,
          email: `alterado_${timestamp}@qa.com`,
          password: "new_password",
          administrador: "false"
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro alterado com sucesso');
      });
    });
  });

  it('Status 201: It should register a new user via PUT if the ID does not exist.', () => {
    const idInexistente = `id_fake_${Date.now()}`;
    
    cy.request({
      method: 'PUT',
      url: `/usuarios/${idInexistente}`,
      body: {
        nome: "Novo via PUT",
        email: `put_new_${Date.now()}@qa.com`,
        password: "teste",
        administrador: "true"
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(response.body).to.have.property('_id');
    });
  });

  it('Status 400: It should return error when trying to use an email already in use.', () => {
    const timestamp = Date.now();
    const emailJaEmUso = `ja_existe_${timestamp}@qa.com`;

    // Cria usuário A
    cy.request('POST', '/usuarios', {
      nome: "Usuario A",
      email: emailJaEmUso,
      password: "123",
      administrador: "true"
    });

    // Cria usuário B
    cy.request('POST', '/usuarios', {
      nome: "Usuario B",
      email: `temp_${timestamp}@qa.com`,
      password: "123",
      administrador: "true"
    }).then((resB) => {
      const idUsuarioB = resB.body._id;

      // Tenta editar o usuário B usando o e-mail do usuário A
      cy.request({
        method: 'PUT',
        url: `/usuarios/${idUsuarioB}`,
        failOnStatusCode: false,
        body: {
          nome: "Usuario B Alterado",
          email: emailJaEmUso, // Conflito aqui
          password: "123",
          administrador: "true"
        }
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Este email já está sendo usado');
      });
    });
  });

});