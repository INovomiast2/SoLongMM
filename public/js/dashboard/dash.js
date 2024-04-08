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

const generateProjectId = () => {
    // UUID Generator
    const uuid = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return `${uuid()}${uuid()}-${uuid()}${uuid()}-${uuid()}${uuid()}-${uuid()}${uuid()}`;
}

document.onclick = (e) => {
    if (e.target.id === 'new-project') {
        // Ask the user if they want to create a new project
        if (!confirm('Are you sure you want to create a new project?')) return;
        // Generate a new project session
        const projectSession = {
            id: generateProjectId(),
            name: `${sessionId.username}'s Project`,
            author: sessionId.username
        };
        localStorage.setItem('project', JSON.stringify(projectSession));
        // Generate the project on the database
        fetch(`/user/dashboard/${sessionId.username}/create_project`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectSession)
        }).then(res => {
            if (res.ok) {
                location.href = `/editor/${projectSession.id}/`;
            } else {
                Error('Failed to create project');
            }
        }).catch(err => console.error(err));
    }
    
    if (e.target.id === 'logout-link') {
        localStorage.removeItem('session');
        location.href = '/auth';
    }
    console.log(e.target.id);
    if (e.target.id === `project-${e.target.dataset.id}`) {
        window.location.href = `/editor/${e.target.dataset.id}`;
    }
}