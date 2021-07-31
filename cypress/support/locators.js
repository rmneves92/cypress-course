const locators = {
  LOGIN: {
    USER: '[data-test=email]',
    PASSWORD: '[data-test=passwd]',
    BTN_LOGIN: '.btn',
  },
  MENU: {
    SETTINGS: '[data-test=menu-settings]',
    ACCOUNTS: '[href="/contas"]',
    RESET: '[href="/reset"]',
  },
  ACCOUNTS: {
    NAME: '[data-test=nome]',
    BTN_SAVE: '.btn',
    XP_BTN_UPDATE: "//table//td[contains(., 'Conta de teste')]/..//i[@class='far fa-edit']",
  },

  MESSAGE: '.toast-message',
};

export default locators;
