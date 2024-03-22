// Dashboard JS - IN PROGRESS

// First of all, when the page loads, we need to check if the user is logged in
// and if the user is on the correct profile, so, if the link param has other username
// than the session username, we need to redirect the user to the correct profile.

// Check if the user is already logged in (Session ID)
const sessionId = JSON.parse(localStorage.getItem('session'));
if (!sessionId) {
    location.href = '/auth';
} else {
    // Check if the user is on the correct profile
    const username = location.pathname.split('/')[3];
    if (username !== sessionId.username) {
        location.href = `/user/dashboard/${sessionId.username}`;
    }
}