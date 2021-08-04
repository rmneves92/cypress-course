/// <reference types="cypress" />

import loc from '../../support/locators';
import '../../support/commandsAccounts';

describe('Should test at a functional level', () => {
  after(() => {
    cy.clearLocalStorage();
  });

  before(() => {
    cy.server();
    cy.route({
      method: 'POST',
      url: '/signin',
      response: {
        id: 1000,
        nome: 'Usuario falso',
        token: 'Uma string muito grande que nao deveria ser aceita mas na verdade, vai',
      },
    }).as('signin');

    cy.route({
      method: 'GET',
      url: '/saldo',
      response: [
        {
          conta_id: 999,
          conta: 'Carteira',
          saldo: '100.00',
        },
        {
          conta_id: 9909,
          conta: 'Banco',
          saldo: '10000000.00',
        },
      ],
    }).as('saldo');

    cy.login('teste@email.com', 'Senha errada');
  });

  beforeEach(() => {
    cy.get(loc.MENU.HOME).click();
    cy.resetApp();
  });

  it('Should create a new account', () => {
    cy.accessMenuAccount();
    cy.insertAccount('Conta de teste');
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });

  it('Should update an account', () => {
    cy.accessMenuAccount();

    cy.xpath(loc.ACCOUNTS.FN_XP_BTN_UPDATE('Conta para alterar')).click();
    cy.get(loc.ACCOUNTS.NAME).clear();
    cy.get(loc.ACCOUNTS.NAME).type('Conta alterada');
    cy.get(loc.ACCOUNTS.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso');
  });

  it('Should not create an account with same name', () => {
    cy.accessMenuAccount();
    cy.insertAccount('Conta mesmo nome');
    cy.get(loc.ACCOUNTS.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'code 400');
  });

  it('Should create a transaction', () => {
    cy.get(loc.MENU.TRANSACTION).click();
    cy.get(loc.TRANSACTION.DESCRIPTION).type('Descrição teste');
    cy.get(loc.TRANSACTION.VALUE).type('123', { force: true });
    cy.get(loc.TRANSACTION.INVOLVED).type('Inter');
    cy.get(loc.TRANSACTION.ACCOUNT).select('Conta com movimentacao');
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
