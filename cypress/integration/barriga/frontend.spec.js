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

  it.only('Should create a transaction', () => {
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
    cy.get(loc.MENU.HOME).click();
    cy.xpath(loc.BALANCE.FN_XP_BALANCE_ACCOUNT('Conta para saldo')).should('contain', '534,00');

    cy.get(loc.MENU.STATEMENT).click();
    cy.xpath(loc.STATEMENT.FN_XP_EDIT_ELEMENT('Movimentacao 1, calculo saldo')).click();

    // cy.wait(1000);
    cy.get(loc.TRANSACTION.DESCRIPTION).should('have.value', 'Movimentacao 1, calculo saldo');

    cy.get(loc.TRANSACTION.STATUS).click();
    cy.get(loc.TRANSACTION.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');

    cy.wait(1000);

    cy.get(loc.MENU.HOME).click();
    cy.xpath(loc.BALANCE.FN_XP_BALANCE_ACCOUNT('Conta para saldo')).should('contain', '4.034,00');
  });

  it('Should remove a transaction', () => {
    cy.get(loc.MENU.STATEMENT).click();
    cy.xpath(loc.STATEMENT.FN_XP_REMOVE_ELEMENT('Movimentacao para exclusao')).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');
  });
});
