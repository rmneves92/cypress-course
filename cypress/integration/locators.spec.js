/// <reference types="cypress" />

describe('Work with basic elements', () => {
  before(() => {
    cy.visit('https://wcaquino.me/cypress/componentes.html');
  });

  beforeEach(() => {
    cy.reload();
  });

  it('Using Xpath', () => {
    cy.xpath("//input[contains(@click, 'Francisco')]");
  });
});
