/// <reference types="cypress" />

describe('Should test at a functional level', () => {
  before(() => {
    cy.getToken('rafa.mneves@hotmail.com', 'Rafa@Teste49');
  });

  beforeEach(() => {
    cy.resetRest();
  });

  it('Should create an account', () => {
    cy.request({
      url: '/contas',
      method: 'POST',
      body: {
        nome: 'Conta via rest',
      },
    }).as('response');

    cy.get('@response').then(res => {
      expect(res.status).to.be.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('nome', 'Conta via rest');
    });
  });

  it('Should update an account', () => {
    cy.getAccountByName('Conta para alterar').then(accountId => {
      cy.request({
        url: `/contas/${accountId}`,
        method: 'PUT',
        body: {
          nome: 'Conta alterada via rest',
        },
      }).as('response');
    });

    cy.get('@response').its('status').should('be.equal', 200);
  });

  it('Should not create an account with same name', () => {
    cy.request({
      url: '/contas',
      method: 'POST',
      body: {
        nome: 'Conta mesmo nome',
      },
      failOnStatusCode: false,
    }).as('response');

    cy.get('@response').then(res => {
      expect(res.status).to.be.equal(400);
      expect(res.body.error).to.be.equal('Já existe uma conta com esse nome!');
    });
  });

  it('Should create a transaction', () => {
    cy.getAccountByName('Conta para movimentacoes').then(accountId => {
      cy.request({
        method: 'POST',
        url: '/transacoes',
        body: {
          conta_id: accountId,
          data_pagamento: Cypress.moment().add({ days: 1 }).format('DD/MM/YYYY'),
          data_transacao: Cypress.moment().format('DD/MM/YYYY'),
          descricao: 'desc',
          envolvido: 'inter',
          status: true,
          tipo: 'REC',
          valor: '123',
        },
      }).as('response');
    });

    cy.get('@response').its('status').should('be.equal', 201);
    cy.get('@response').its('body.id').should('exist');
  });

  it('Should get balance', () => {
    cy.request({
      url: '/saldo',
      method: 'GET',
    }).then(res => {
      let accountBalance = null;
      res.body.forEach(c => {
        if (c.conta === 'Conta para saldo') accountBalance = c.saldo;
      });

      expect(accountBalance).to.be.equal('534.00');
    });

    cy.getTransactionByDescription('Movimentacao 1, calculo saldo').then(transaction => {
      cy.request({
        url: `/transacoes/${transaction.id}`,
        method: 'PUT',
        body: {
          status: true,
          data_transacao: Cypress.moment(transaction.data_transacao).format('DD/MM/YYYY'),
          data_pagamento: Cypress.moment(transaction.data_pagamento).format('DD/MM/YYYY'),
          descricao: transaction.descricao,
          envolvido: transaction.envolvido,
          valor: transaction.valor,
          conta_id: transaction.conta_id,
        },
      })
        .its('status')
        .should('be.equal', 200);
    });

    cy.request({
      url: '/saldo',
      method: 'GET',
    }).then(res => {
      let accountBalance = null;
      res.body.forEach(c => {
        if (c.conta === 'Conta para saldo') accountBalance = c.saldo;
      });

      expect(accountBalance).to.be.equal('4034.00');
    });
  });

  it('Should remove a transaction', () => {
    cy.getTransactionByDescription('Movimentacao para exclusao')
      .then(transaction => {
        cy.request({
          url: `/transacoes/${transaction.id}`,
          method: 'DELETE',
        });
      })
      .its('status')
      .should('be.equal', 204);
  });
});
