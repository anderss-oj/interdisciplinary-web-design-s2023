//CONSTANTS & VARIABLES
const storageKey = 'savedAccount';

// empty account state
let state = ({
  account: null,
});

// button id
const ADD_TRANSACTION_BUTTON_ID = 'addTransaction';

// template IDs
const LOGIN_TEMPLATE_ID = 'login';
const DASHBOARD_TEMPLATE_ID = 'dashboard'; 
const TRANSACTION_TEMPLATE_ID = 'transaction';
const ADD_TRANSACTION_TEMPLATE_ID = 'addTransForm';

// pageTitle IDs
const LOGIN_PAGE_TITLE = 'Login Page';
const DASHBOARD_PAGE_TITLE = 'Your Dashboard';

// urls
const LOGIN_URL = '/login';
const DASHBOARD_URL = '/dashboard';
const ACCOUNTS_API_URL = '//localhost:5000/api/accounts/';

// map object
const routes = {
  '/login': { templateId: LOGIN_TEMPLATE_ID, pageTitle: LOGIN_PAGE_TITLE },
  '/dashboard': { templateId: DASHBOARD_TEMPLATE_ID, pageTitle: DASHBOARD_PAGE_TITLE, init: refresh },
  '/addTransForm': {templateId: ADD_TRANSACTION_TEMPLATE_ID},
};

// referenced functions

// title updater
function updateTitle(title) {
  document.querySelector('title').textContent = title;
}

// PAGE NAVIGATION

// navigate templates function
function navigate(path) {
  window.history.pushState({}, path, window.location.origin + path);
  console.log(path);
  updateRoute();
}

// template updater
function updateRoute() {
    const path = window.location.pathname;
    const route = routes[path];
  
    if (!route) {
      console.log('updateRoute, !route')
      return logout();
    }


    const template = document.getElementById(route.templateId);
    const view = template.content.cloneNode(true);
    const app = document.getElementById('app');
    
    app.innerHTML = '';
    app.appendChild(view);

    updateTitle(route.pageTitle);

    console.log(route.templateId + ' is shown');
    
    if (typeof route.init === 'function') {
      route.init();
    }
}

// go back to login page function
function onLinkClick(event) {
  event.preventDefault();
  logout();
}

// REGISTRATION FORM STUFF

// creating & retrieving user data
const userData = {
  // create user data
  async createAccount(account) {
    try {
      const response = await fetch(ACCOUNTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: account,
      });
      return await response.json();
    } catch (error) {
      return { error: error.message || 'Unknown error' };
    }
  },

  // retrieve user data
  async getAccount(user) {
    try {
      const response = await fetch(
        ACCOUNTS_API_URL + encodeURIComponent(user)
      );
      return await response.json();
    } catch (error) {
      return { error: error.message || 'Unknown error' };
    }
  }
};

// form function
async function register() {
  const registerForm = document.getElementById('registerForm');
  const formData = new FormData(registerForm);
  const jsonData = JSON.stringify(Object.fromEntries(formData));
  const result = await userData.createAccount(jsonData);

  // error message
  if (result.error) {
    return updateElement('registerError', result.error);
  }

  console.log('Account created!', result);
  updateState('account', result);
  navigate(DASHBOARD_URL);
}

// login function
async function login() {
  const loginForm = document.getElementById('loginForm');
  const user = loginForm.user.value;
  const data = await userData.getAccount(user);

  // error message
  if (data.error) {
    return updateElement('loginError', data.error);
  }

  updateState('account', data);
  navigate(DASHBOARD_URL);
}

// transactions table
function createTransactionRow(transaction) {
  const template = document.getElementById(TRANSACTION_TEMPLATE_ID);
  const transactionRow = template.content.cloneNode(true);
  const tr = transactionRow.querySelector('tr');
  tr.children[0].textContent = transaction.date;
  tr.children[1].textContent = transaction.object;
  tr.children[2].textContent = transaction.amount.toFixed(2);

  return transactionRow;
}

// dashboard updater
function updateDashboard() {
  const account = state.account;

  if (!account) {
    return logout();
  }

  updateElement('description', account.description);
  updateElement('balance', account.balance.toFixed(2));
  updateElement('currency', account.currency);

  const transactionsRows = document.createDocumentFragment();

for (const transaction of account.transactions) {
  const transactionRow = createTransactionRow(transaction);
  transactionsRows.appendChild(transactionRow);
}

updateElement('transactions', transactionsRows);
}

async function updateAccountData() {
  const account = state.account;
  if (!account) {
    return logout();
  }

  const data = await userData.getAccount(account.user);
  if (data.error) {
    return logout();
  }

  updateState('account', data);
}

async function refresh() {
  await updateAccountData();
  updateDashboard();
}

const addTransactionButton = document.getElementById(ADD_TRANSACTION_BUTTON_ID);

addTransactionButton.addEventListener('click', function() {
  // Clone the form template
  const addTransForm = ADD_TRANSACTION_TEMPLATE_ID.content.cloneNode(true);
  const transactionsSection = document.getElementById('transactions');
  // Append the cloned form to the section element
  transactionsSection.appendChild(addTransForm);
})

// function addTransaction() {

// }

// 
function updateState(property, newData) {
  state = Object.freeze({
    ...state,
    [property]: newData,
  });
  localStorage.setItem(storageKey, JSON.stringify(state.account));
}

function logout() {
  updateState('account', null);
  console.log('logoutFunction')
  navigate(LOGIN_URL);
}

//utilities

// element helper
function updateElement(id, textOrNode) {
  const element = document.getElementById(id);
  element.textContent = ''; // Removes all children
  element.append(textOrNode);
}

//init

function init() {
  const savedAccount = localStorage.getItem(storageKey);

  if (savedAccount) {
    updateState('account', JSON.parse(savedAccount));
  }

  // Our previous initialization code
  window.onpopstate = () => updateRoute();
  updateRoute();
}

init();