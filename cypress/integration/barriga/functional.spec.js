/// <reference types="cypress" />

import loc from '../../support/locators';

describe('Should test at a functional level', () => {
  before(() => {
    cy.login('rafa.mneves@hotmail.com', 'Rafa@Teste49');
    cy.resetApp();
  });

  it('Should create a new account', () => {
    cy.get(loc.MENU.SETTINGS).click();
    cy.get(loc.MENU.ACCOUNTS).click();
    cy.get(loc.ACCOUNTS.NAME).type('Conta de teste');
    cy.get(loc.ACCOUNTS.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });

  it('Should update an account', () => {
    cy.get(loc.MENU.SETTINGS).click();
    cy.get(loc.MENU.ACCOUNTS).click();
    cy.xpath(loc.ACCOUNTS.XP_BTN_UPDATE).click();
    cy.get(loc.ACCOUNTS.NAME).clear();
    cy.get(loc.ACCOUNTS.NAME).type('Conta alterada');
    cy.get(loc.ACCOUNTS.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso');
  });
});
