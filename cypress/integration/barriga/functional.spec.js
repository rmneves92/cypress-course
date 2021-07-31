/// <reference types="cypress" />

import loc from '../../support/locators';
import '../../support/commandsAccounts';

describe('Should test at a functional level', () => {
  before(() => {
    cy.login('rafa.mneves@hotmail.com', 'Rafa@Teste49');
    cy.resetApp();
  });

  it('Should create a new account', () => {
    cy.accessMenuAccount();
    cy.insertAccount('Conta de teste');
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });

  it('Should update an account', () => {
    cy.accessMenuAccount();

    cy.xpath(loc.ACCOUNTS.FN_XP_BTN_UPDATE('Conta de teste')).click();
    cy.get(loc.ACCOUNTS.NAME).clear();
    cy.get(loc.ACCOUNTS.NAME).type('Conta alterada');
    cy.get(loc.ACCOUNTS.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso');
  });

  it('Should not create an account with same name', () => {
    cy.accessMenuAccount();
    cy.insertAccount('Conta para alterar');
    cy.get(loc.MESSAGE).should('contain', 'code 400');
  });

  it('Should create a transaction', () => {
    cy.get(loc.MENU.TRANSACTION).click();
    cy.get(loc.TRANSACTION.DESCRIPTION).type('Descrição teste');
    cy.get(loc.TRANSACTION.VALUE).type('123');
    cy.get(loc.TRANSACTION.INVOLVED).type('Inter');
    cy.get(loc.TRANSACTION.ACCOUNT).select('Conta alterada');
    cy.get(loc.TRANSACTION.STATUS).click();
    cy.get(loc.TRANSACTION.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');

    cy.get(loc.STATEMENT.LINES).should('have.length', 7);
    cy.xpath(loc.STATEMENT.FN_XP_QUERY_ELEMENT('Desc', '123')).should('exist');
  });

  it('Should get balance', () => {
    cy.get(loc.MENU.HOME).click();
    cy.xpath(loc.BALANCE.FN_XP_BALANCE_ACCOUNT('Conta alterada')).should('contain', '123,00');
  });
});
