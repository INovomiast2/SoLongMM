setTimeout(() => {
    Promise.all([
        import('./login.js'),
        import('./register.js'),
    ]).then(() => {
        loadingSpinner.style.display = 'none';
        loginForm.style.display = 'flex';
        // Add fade in animation
        loginForm.classList.add('auth-anim--fade-in');
    }).catch(err => {
        console.error(err);
        loginForm.innerHTML = '<h1>Failed to load the login form</h1>';
    })
}, 3500);

console.log('General Auth JS Loaded');

// General Auth
const loginForm = document.querySelector('.login-form');
const loginDiv = document.querySelector('#auth-form-signin');
const registerForm = document.querySelector('#auth-form-signup');
const loadingSpinner = document.querySelector('.loading-spinner');

const changeForm = document.querySelector('#auth-form__change-form');

changeForm.addEventListener('click', () => {
    console.log('Change form')
    loginDiv.style.display = 'none';
    registerForm.style.display = 'flex';
    registerForm.classList.add('auth-anim--fade-in');
});