describe('Cenários de Teste: GET /produtos/{_id}', () => {
  let token;

  before(() => {
    // Criando usuário dinâmico para garantir o login
    const emailAdmin = `admin_${Date.now()}@qa.com`;
    
    cy.request('POST', '/usuarios', {
      nome: "Admin Teste",
      email: emailAdmin,
      password: "teste",
      administrador: "true"
    }).then(() => {
      cy.request('POST', '/login', { 
        email: emailAdmin, 
        password: "teste" 
      }).then(res => {
        token = res.body.authorization;
      });
    });
  });

  it('Deve buscar um produto por ID com sucesso (Status 200)', () => {
    const nomeProd = `Produto_${Date.now()}`;

    // Criar o produto para garantir que o ID exista
    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: { authorization: token },
      body: {
        nome: nomeProd,
        preco: 100,
        descricao: "Teclado",
        quantidade: 50
      }
    }).then((resPost) => {
      const id = resPost.body._id;

      cy.request('GET', `/produtos/${id}`).then((resGet) => {
        expect(resGet.status).to.eq(200);
        expect(resGet.body).to.have.property('_id', id);
        expect(resGet.body).to.have.property('nome', nomeProd);
      });
    });
  });

  it('Deve retornar erro ao buscar um produto com ID inexistente (Status 400)', () => {
    // Usando um ID no formato que o MongoDB/ServeRest espera, mas que não existe
    const idInexistente = '0uxuPY0cbmQhpEz1'; 

    cy.request({
      method: 'GET',
      url: `/produtos/${idInexistente}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      // Validando a mensagem conforme o seu screenshot da documentação
      expect(response.body.message).to.eq('Produto não encontrado');
    });
  });
});