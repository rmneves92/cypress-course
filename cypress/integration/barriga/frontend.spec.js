/// <reference types="cypress" />

import loc from '../../support/locators';
import '../../support/commandsAccounts';
import buildEnv from '../../support/buildEnv';

describe('Should test at a functional level', () => {
  after(() => {
    cy.clearLocalStorage();
  });

  beforeEach(() => {
    buildEnv();
    cy.login('teste@email.com', 'Senha errada');

    cy.get(loc.MENU.HOME).click();
  });

  it('Should create an account', () => {
    cy.route({
      method: 'POST',
      url: '/contas',
      response: { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
    }).as('saveConta');

    cy.accessMenuAccount();

    // Redefinindo a rota...
    cy.route({
      method: 'GET',
      url: '/contas',
      response: [
        { id: 1, nome: 'Carteira', visivel: true, usuario_id: 1 },
        { id: 2, nome: 'Banco', visivel: true, usuario_id: 1 },
        { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
      ],
    }).as('contasSave');

    cy.insertAccount('Conta de teste');
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });

  it('Should update an account', () => {
    cy.route({
      method: 'PUT',
      url: '/contas/**',
      response: {
        id: 1,
        nome: 'Conta alterada',
        visivel: true,
        usuario_id: 1,
      },
    });

    cy.accessMenuAccount();

    cy.xpath(loc.ACCOUNTS.FN_XP_BTN_UPDATE('Carteira')).click();
    cy.get(loc.ACCOUNTS.NAME).clear();
    cy.get(loc.ACCOUNTS.NAME).type('Conta alterada');
    cy.get(loc.ACCOUNTS.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso');
  });

  it('Should not create an account with same name', () => {
    cy.route({
      method: 'POST',
      url: '/contas',
      response: { error: 'Já existe uma conta com esse nome!' },
      status: 400,
    }).as('saveContaMesmoNome');

    cy.accessMenuAccount();

    cy.insertAccount('Conta mesmo nome');
    cy.get(loc.ACCOUNTS.BTN_SAVE).click({ force: true });
    cy.get(loc.MESSAGE).should('contain', 'code 400');
  });

  it('Should create a transaction', () => {
    cy.route({
      method: 'POST',
      url: '/transacoes',
      response: {
        id: 674324,
        descricao: 'teste',
        envolvido: 'teste',
        observacao: null,
        tipo: 'REC',
        data_transacao: '2021-08-04T03:00:00.000Z',
        data_pagamento: '2021-08-04T03:00:00.000Z',
        valor: '123.00',
        status: false,
        conta_id: 724356,
        usuario_id: 23948,
        transferencia_id: null,
        parcelamento_id: null,
      },
    });

    cy.route({
      method: 'GET',
      url: '/extrato/**',
      response: 'fixture:transactionSave',
    });

    cy.get(loc.MENU.TRANSACTION).click();
    cy.get(loc.TRANSACTION.DESCRIPTION).type('Descrição teste');
    cy.get(loc.TRANSACTION.VALUE).type('123', { force: true });
    cy.get(loc.TRANSACTION.INVOLVED).type('Inter');
    cy.get(loc.TRANSACTION.ACCOUNT).select('Banco');
    cy.get(loc.TRANSACTION.STATUS).click();
    cy.get(loc.TRANSACTION.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');

    cy.get(loc.STATEMENT.LINES).should('have.length', 7);
    cy.xpath(loc.STATEMENT.FN_XP_QUERY_ELEMENT('Desc', '123')).should('exist');
  });

  it('Should get balance', () => {
    cy.route({
      method: 'GET',
      url: '/transacoes/**',
      response: {
        conta: 'Conta para saldo',
        id: 674327,
        descricao: 'Movimentacao 1, calculo saldo',
        envolvido: 'CCC',
        observacao: null,
        tipo: 'REC',
        data_transacao: '2021-08-04T03:00:00.000Z',
        data_pagamento: '2021-08-04T03:00:00.000Z',
        valor: '3500.00',
        status: false,
        conta_id: 726589,
        usuario_id: 23948,
        transferencia_id: null,
        parcelamento_id: null,
      },
    });

    cy.route({
      method: 'PUT',
      url: '/transacoes/**',
      response: {
        conta: 'Conta para saldo',
        id: 674327,
        descricao: 'Movimentacao 1, calculo saldo',
        envolvido: 'CCC',
        observacao: null,
        tipo: 'REC',
        data_transacao: '2021-08-04T03:00:00.000Z',
        data_pagamento: '2021-08-04T03:00:00.000Z',
        valor: '3500.00',
        status: false,
        conta_id: 726589,
        usuario_id: 23948,
        transferencia_id: null,
        parcelamento_id: null,
      },
    });

    cy.get(loc.MENU.HOME).click();
    cy.xpath(loc.BALANCE.FN_XP_BALANCE_ACCOUNT('Carteira')).should('contain', '100,00');

    cy.get(loc.MENU.STATEMENT).click();
    cy.xpath(loc.STATEMENT.FN_XP_EDIT_ELEMENT('Movimentacao 1, calculo saldo')).click();

    // cy.wait(1000);
    cy.get(loc.TRANSACTION.DESCRIPTION).should('have.value', 'Movimentacao 1, calculo saldo');

    cy.get(loc.TRANSACTION.STATUS).click();
    cy.get(loc.TRANSACTION.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');

    cy.route({
      method: 'GET',
      url: '/saldo',
      response: [
        {
          conta_id: 999,
          conta: 'Carteira',
          saldo: '4034.00',
        },
        {
          conta_id: 9909,
          conta: 'Banco',
          saldo: '10000000.00',
        },
      ],
    }).as('saldoFinal');

    cy.wait(1000);

    cy.get(loc.MENU.HOME).click();
    cy.xpath(loc.BALANCE.FN_XP_BALANCE_ACCOUNT('Carteira')).should('contain', '4.034,00');
  });

  it('Should remove a transaction', () => {
    cy.route({
      method: 'DELETE',
      url: '/transacoes/**',
      response: {},
      status: 204,
    }).as('del');

    cy.get(loc.MENU.STATEMENT).click();
    cy.xpath(loc.STATEMENT.FN_XP_REMOVE_ELEMENT('Movimentacao para exclusao')).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');
  });

  it.only('Should create an account', () => {
    const reqStub = cy.stub();

    cy.route({
      method: 'POST',
      url: '/contas',
      response: { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
      // onRequest: req => {
      //   expect(req.request.body.nome).to.be.empty;
      //   expect(req.request.headers).to.have.property('Authorization');
      // },
      onRequest: reqStub,
    }).as('saveConta');

    cy.accessMenuAccount();

    // Redefinindo a rota...
    cy.route({
      method: 'GET',
      url: '/contas',
      response: [
        { id: 1, nome: 'Carteira', visivel: true, usuario_id: 1 },
        { id: 2, nome: 'Banco', visivel: true, usuario_id: 1 },
        { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
      ],
    }).as('contasSave');

    cy.insertAccount('{CONTROL}');
    // cy.wait('@saveConta').its('request.body.nome').should('not.be.empty');
    cy.wait('@saveConta').then(() => {
      console.log(reqStub.args[0][0]);
      expect(reqStub.args[0][0].request.body.nome).to.be.empty;
      expect(reqStub.args[0][0].request.headers).to.have.property('Authorization');
    });
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });
});
