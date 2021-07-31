/// <reference types="cypress" />

import loc from '../../support/locators';
import '../../support/commandsAccounts';

describe('Should test at a functional level', () => {
  before(() => {
    cy.login('rafa.mneves@hotmail.com', 'Rafa@Teste49');
    cy.resetApp();
  });

  it('Should create a new account', () => {
    cy.accessAccountMenu();
    cy.insertAccount('Conta de teste');
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });

  it('Should update an account', () => {
    cy.accessAccountMenu();

    cy.xpath(loc.ACCOUNTS.XP_BTN_UPDATE).click();
    cy.get(loc.ACCOUNTS.NAME).clear();
    cy.get(loc.ACCOUNTS.NAME).type('Conta alterada');
    cy.get(loc.ACCOUNTS.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso');
  });
});
