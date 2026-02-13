describe('Cenários de Teste: PUT /usuarios/{_id}', () => {

  it('Status 200: Deve alterar um usuário com sucesso.', () => {
    const timestamp = Date.now();
    const dadosIniciais = {
      nome: `Original_${timestamp}`,
      email: `original_${timestamp}@qa.com`,
      password: "123",
      administrador: "true"
    };

    // 1. Cria o usuário para garantir que o ID existe
    cy.request('POST', '/usuarios', dadosIniciais).then((resPost) => {
      const idUsuario = resPost.body._id;

      // 2. Realiza o PUT para editar os dados
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

  it('Status 201: Deve cadastrar um novo usuário via PUT caso o ID não exista.', () => {
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

  it('Status 400: Deve retornar erro ao tentar usar e-mail de outro usuário.', () => {
    const timestamp = Date.now();
    const emailJaEmUso = `ja_existe_${timestamp}@qa.com`;

    // 1. Cria usuário A
    cy.request('POST', '/usuarios', {
      nome: "Usuario A",
      email: emailJaEmUso,
      password: "123",
      administrador: "true"
    });

    // 2. Cria usuário B
    cy.request('POST', '/usuarios', {
      nome: "Usuario B",
      email: `temp_${timestamp}@qa.com`,
      password: "123",
      administrador: "true"
    }).then((resB) => {
      const idUsuarioB = resB.body._id;

      // 3. Tenta editar o usuário B usando o e-mail do usuário A
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