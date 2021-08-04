/// <reference types="cypress" />

describe('Work with basic elements', () => {
  before(() => {
    cy.visit('https://wcaquino.me/cypress/componentes.html');
  });

  it('Going back to the past', () => {
    // cy.get('#buttonNow').click();
    // cy.get('#resultado > span').should('contain', '30/07/2021');

    // cy.clock();
    // cy.get('#buttonNow').click();
    // cy.get('#resultado > span').should('contain', '31/12/1969');

    const dt = new Date(2012, 3, 10, 15, 23, 50);

    cy.clock(dt.getTime());

    cy.get('#buttonNow').click();
    cy.get('#resultado > span').should('contain', '10/04/2012');
  });

  it('Goes to the future', () => {
    cy.get('#buttonTimePassed').click();
    cy.get('#resultado > span').should('contain', '16276');
    cy.get('#resultado > span').invoke('text').should('gt', 1627698375176);

    cy.clock();
    cy.get('#buttonTimePassed').click();
    cy.get('#resultado > span').invoke('text').should('lte', 0);

    // cy.wait(1000);
    // cy.get('#buttonTimePassed').click();
    // cy.get('#resultado > span').invoke('text').should('lte', 1000);

    cy.tick(5000);

    cy.get('#buttonTimePassed').click();
    cy.get('#resultado > span').invoke('text').should('gte', 5000);
  });
});
