/// <reference types="cypress" />

describe('Should test at a functional level', () => {
  before(() => {
    cy.visit('https://barrigareact.wcaquino.me');

    cy.get('[data-test=email]').clear();
    cy.get('[data-test=passwd]').clear();

    cy.get('[data-test=email]').type('rafa.mneves@hotmail.com');
    cy.get('[data-test=passwd]').type('Rafa@Teste49');
    cy.get('.btn').click();
    cy.get('.toast-message').should('contain', 'Bem vindo');

    cy.get('[data-test=menu-settings]').click();
    cy.get('[href="/reset"]').click();
  });

  it('Should create a new account', () => {
    cy.get('[data-test=menu-settings]').click();
    cy.get('[href="/contas"]').click();
    cy.get('[data-test=nome]').type('Conta de teste');
    cy.get('.btn').click();
    cy.get('.toast-message').should('contain', 'Conta inserida com sucesso');
  });

  it('Should update an account', () => {
    cy.get('[data-test=menu-settings]').click();
    cy.get('[href="/contas"]').click();
    cy.xpath("//table//td[contains(., 'Conta de teste')]/..//i[@class='far fa-edit']").click();
    cy.get('[data-test=nome]').clear();
    cy.get('[data-test=nome]').type('Conta alterada');
    cy.get('.btn').click();
    cy.get('.toast-message').should('contain', 'Conta atualizada com sucesso');
  });
});
