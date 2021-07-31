/// <reference types="cypress" />

describe('Should test at a functional level', () => {
  before(() => {
    cy.visit('https://barrigareact.wcaquino.me');

    cy.get('[data-test=email]').type('rafa.mneves@hotmail.com');
    cy.get('[data-test=passwd]').type('Rafa@Teste49');
    cy.get('.btn').click();
    cy.get('.toast-message').should('contain', 'Bem vindo');
  });

  it('...', () => {});
});
