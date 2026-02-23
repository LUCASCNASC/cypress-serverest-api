describe('Endpoint - GET /carrinhos', () => {
  let idProduto;
  let token;

  before(() => {
    const timestamp = Date.now();
    const emailAdmin = `admin_list_${timestamp}@qa.com`;

    // Criar e logar com Admin para preparar a massa de dados
    cy.request('POST', '/usuarios', {
      nome: "Lucas Camargo", 
      email: emailAdmin, 
      password: "teste", 
      administrador: "true"
    }).then(() => {
      cy.request('POST', '/login', { email: emailAdmin, password: "teste" }).then(res => {
        token = res.body.authorization;

        // Cadastrar um produto necessário para o carrinho
        cy.request({
          method: 'POST',
          url: '/produtos',
          headers: { authorization: token },
          body: { 
            nome: `Teclado Mecânico ${timestamp}`, 
            preco: 150, 
            descricao: "RGB", 
            quantidade: 100 
          }
        }).then(resProd => {
          idProduto = resProd.body._id;

          // Cadastrar um carrinho para garantir que a lista tenha ao menos um item
          cy.request({
            method: 'POST',
            url: '/carrinhos',
            headers: { authorization: token },
            body: { 
              produtos: [{ idProduto: idProduto, quantidade: 1 }] 
            }
          });
        });
      });
    });
  });

  it('Status code 200: It should successfully list all carts.', () => {
    cy.request({
      method: 'GET',
      url: '/carrinhos'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('quantidade');
      expect(response.body).to.have.property('carrinhos');
      expect(response.body.carrinhos).to.be.an('array');

      // Se houver carrinhos, validamos as chaves obrigatórias do primeiro item
      if (response.body.quantidade > 0) {
        const carrinho = response.body.carrinhos[0];
        expect(carrinho).to.have.all.keys(
          'produtos', 
          'precoTotal', 
          'quantidadeTotal', 
          'idUsuario', 
          '_id'
        );
        expect(carrinho.produtos).to.be.an('array');
      }
    });
  });
});