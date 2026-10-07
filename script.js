const STORAGE_KEY = 'busgo_demo_user';

const authPage = document.getElementById('authPage');
const welcomePage = document.getElementById('welcomePage');
const loginPanel = document.getElementById('loginPanel');
const registerPanel = document.getElementById('registerPanel');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const welcomeText = document.getElementById('welcomeText');
const welcomeHeading = document.getElementById('welcomeHeading');

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

function setMessage(element, message, type) {
  element.textContent = message;
  element.className = `form-message ${type}`;
}

function clearMessages() {
  setMessage(loginMessage, '', '');
  setMessage(registerMessage, '', '');
}

function showLogin() {
  loginPanel.classList.remove('hidden');
  registerPanel.classList.add('hidden');
  clearMessages();
}

function showRegister() {
  registerPanel.classList.remove('hidden');
  loginPanel.classList.add('hidden');
  clearMessages();
}

function showWelcome(user) {
  authPage.classList.add('hidden');
  welcomePage.classList.remove('hidden');
  welcomeHeading.textContent = `Thank You for Registering, ${user.name}`;
  welcomeText.textContent = 'Your account has been created and you have successfully logged in to BusGo.';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('showRegister').addEventListener('click', showRegister);
document.getElementById('showLogin').addEventListener('click', showLogin);

document.getElementById('logoutButton').addEventListener('click', () => {
  welcomePage.classList.add('hidden');
  authPage.classList.remove('hidden');
  document.getElementById('loginPassword').value = '';
  showLogin();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearMessages();

  const name = document.getElementById('registerName').value.trim();
  const identifier = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirm = document.getElementById('registerConfirm').value;

  if (!name || !identifier || !password || !confirm) {
    setMessage(registerMessage, 'Please fill in all fields.', 'error');
    return;
  }

  if (password.length < 4) {
    setMessage(registerMessage, 'Password must contain at least 4 characters.', 'error');
    return;
  }

  if (password !== confirm) {
    setMessage(registerMessage, 'Passwords do not match.', 'error');
    return;
  }

  const existingUser = getUser();
  if (existingUser && existingUser.identifier.toLowerCase() === identifier.toLowerCase()) {
    setMessage(registerMessage, 'An account with this email or phone already exists.', 'error');
    return;
  }

  const user = { name, identifier, password };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

  registerForm.reset();
  document.getElementById('loginEmail').value = identifier;
  showLogin();
  setMessage(loginMessage, 'Registration successful. Please log in with your new account.', 'success');
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearMessages();

  const identifier = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const user = getUser();

  if (!identifier || !password) {
    setMessage(loginMessage, 'Please enter your email/phone and password.', 'error');
    return;
  }

  if (!user) {
    setMessage(loginMessage, 'No account found. Please register first.', 'error');
    return;
  }

  if (identifier.toLowerCase() !== user.identifier.toLowerCase() || password !== user.password) {
    setMessage(loginMessage, 'Incorrect email/phone or password.', 'error');
    return;
  }

  showWelcome(user);
});
