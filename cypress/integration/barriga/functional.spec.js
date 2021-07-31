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

    cy.xpath(loc.ACCOUNTS.XP_BTN_UPDATE).click();
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
});
