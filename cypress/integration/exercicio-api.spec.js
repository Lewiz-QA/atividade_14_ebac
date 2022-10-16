/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

     let id
     var faker = require('faker');
     let nameFaker = faker.name.firstName() + " " + faker.name.lastName()
     let mailFaker = faker.internet.email(nameFaker, '2022', 'mailtest.com.br', { allowSpecialCharacters: false })

     it('Deve validar contrato de usuários', () => {
          cy.listarUsuarios().then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.listarUsuarios('Fulano da Silva', 'fulano@qa.com', 'teste', 'true', '0uxuPY0cbmQhpEz1').then((response) => {
               expect(response.body.usuarios[0].nome).to.contains('Silva')
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(20)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          cy.cadastrarUsuario(nameFaker, mailFaker, 'teste', "true").then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               expect(response.body._id).to.be.not.empty
               expect(response.duration).to.be.lessThan(20)
               id = response.body._id
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario('Luiz', 'fulano@qa.com', 'teste', 'true').then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('Este email já está sendo usado')
               expect(response.duration).to.be.lessThan(20)
          })

          cy.cadastrarUsuario('Luiz', 'emailteste.com', 'teste', 'true').then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.email).to.equal('email deve ser um email válido')
               expect(response.duration).to.be.lessThan(20)
          })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let pwd = `${Math.floor(Math.random() * 10000)}`
          cy.editarUsuario(id, nameFaker, mailFaker, 'teste' + pwd, 'true').then((response) => {
               expect(response.status).to.be.oneOf([200, 201])
               expect(response.body.message).to.be.oneOf(['Registro alterado com sucesso', 'Cadastro realizado com sucesso'])
               expect(response.duration).to.be.lessThan(20)
          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          cy.deletarUsuario(id).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body.message).to.be.oneOf(['Registro excluído com sucesso', 'Nenhum registro excluído'])
               expect(response.duration).to.be.lessThan(20)
          })
     });
});