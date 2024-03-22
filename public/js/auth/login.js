// Login Manager for the login page

const serverRoute = '/auth/login';

console.log('Login JS Loaded');

// Login form
const loginForm = document.querySelector('form');
const usernameInput = document.querySelector('input[name="username"]');
const passwordInput = document.querySelector('input[name="password"]');

loginForm.addEventListener('submit', async (e) => {
    alert('Login form submitted');
    e.preventDefault();
    fetch(serverRoute, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value
        })
    }).then(async res => {
        if (res.ok) {
            const data = await res.json();
            console.info(data['status']);
            if (data['status'] === 'success') {
                console.info('Now we genera')
                // Fecth for the session id
                fetch('/auth/session/generate_id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: usernameInput.value
                    })
                }).then(async res => {
                    console.info("Status:", res.ok)
                    if (res.ok) {
                        const data = await res.json();
                        console.log(data)
                        if (data != null || data != '') {
                            console.log('Session ID:', data['session_id']);
                            // Append the session id to the local storage
                            localStorage.setItem('session', JSON.stringify({'id': data['session_id'], 'username': usernameInput.value}));
                            // Redirect to the dashboard
                            window.location.href = '/user/dashboard';
                        }
                    }
                }).catch(err => {
                    console.error(err);
                })
            }
        }
    }).catch(err => {
        console.error(err);
    });
});