/// <reference types="cypress" />

describe('Should test at a functional level', () => {
  before(() => {});

  beforeEach(() => {
    // cy.get(loc.MENU.HOME).click();
    // cy.resetApp();
  });

  it('Should create an account', () => {
    cy.request({
      method: 'POST',
      url: 'https://barrigarest.wcaquino.me/signin',
      body: {
        email: 'rafa.mneves@hotmail.com',
        redirecionar: false,
        senha: 'Rafa@Teste49',
      },
    })
      .its('body.token')
      .should('not.be.empty');
  });

  it('Should update an account', () => {});

  it('Should not create an account with same name', () => {});

  it('Should create a transaction', () => {});

  it('Should get balance', () => {});

  it('Should remove a transaction', () => {});
});
