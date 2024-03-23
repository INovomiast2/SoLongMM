from flask import Flask, render_template, request, send_from_directory, redirect, url_for
from utils import db_connect as db
from utils import session as sess
import os

app = Flask(__name__)

# Favicon Route
@app.route('/favicon.ico')
def favicon():
    return send_from_directory('public', 'images/so_long_map_maker_v2.png')

# Home Route
@app.route('/')
def home():
    return render_template('./html/index.html')

# Editor Route
@app.route('/editor/')
def editor():
    return render_template('./html/editor/index.html')

# Public Route
@app.route('/public/<path:path>')
def public(path):
    return send_from_directory('public', path)

# Auth Route
@app.route('/auth/')
def auth_page():
    return render_template('./html/auth/index.html')

# User Logout Route
@app.route('/user/dashboard/<username>/logout')
def auth_logout(username):
    return render_template('./html/auth/logout.html', username=username)

# User Route
@app.route('/user/')
def user():
    # Send to dashboard route
    return redirect(url_for('dashboard'))
    
# User Dashboard Route
@app.route('/user/dashboard/<username>')
def dashboard(username):
    user = db.conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    project = db.conn.execute("SELECT * FROM projects WHERE author = ?", (username,)).fetchall()
    
    # We check if the user exists
    if user == None:
        return {'error': 'User not found'}
    else:
        # Send as a json and render the dashboard page
        return render_template('./html/user/dashboard/index.html', user=user, project=project)

# User Tools Route (Redirect)
@app.route('/user/dashboard/')
def redirect_dashboard():
    return render_template('./html/user/tools/redir_to_user.html')

# User Profile Route
@app.route('/user/profile/<username>')
def profile(username):
    if username != '':
        # Check if the user exists
        user = db.conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        if user == None:
            return {'error': 'User not found'}
        else:
            # Send as a json and render the profile page
            return render_template('./html/user/profile/index.html', user=user)
        

# This route is going to manage the login
@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    
    print(data)
    
    # This is going to be the query to the database
    # to check if the user exists
    user = db.conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    pwd = db.conn.execute("SELECT password FROM users WHERE username = ?", (username,)).fetchone()
    
    if user == None:
        return {'error': 'User not found'}
    else:
        if password == pwd[0]:
            return {'status': 'success'}
        else:
            return {'error': 'invalid_password', 'status': 'failed'}

# This route is for the session ID generation
@app.route('/auth/session/generate_id', methods=['POST'])
def generate_session_id():
    data = request.get_json()
    username = data['username']
    
    user = db.conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    
    if user == None:
        # Close the connection
        return {'error': 'User not found'}
    else:
        session_id = str(sess.generate_session_id())  # Generate session ID
        return {'session_id': session_id}

# This route is going to manage the user projects
@app.route('/user/dashboard/<username>/myprojects')
def projects(username):
    user = db.conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    projects = db.conn.execute("SELECT * FROM projects WHERE author = ?", (username,)).fetchall()
    
    if user == None:
        return {'error': 'User not found'}
    else:
        return render_template('./html/user/dashboard/projects/index.html', user=user, projects=projects)

# This route is going to manage the user settings
@app.route('/user/dashboard/<username>/settings')
def settings(username):
    user = db.conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    
    if user == None:
        return {'error': 'User not found'}
    else:
        return render_template('./html/user/dashboard/settings/index.html', user=user)

# New Editor Route
@app.route('/editor/<project_id>/')
def new_editor(project_id):
    project = db.conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
    
    if project == None:
        return {'error': 'Project not found'}
    else:
        return render_template('./html/editor/index.html', project=project)
    
# Project Creation POST Route
@app.route('/user/dashboard/<username>/create_project', methods=['POST'])
def create_project(username):
    try:
        user = db.conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        if user == None:
            return {'error': 'User not found'}
        else:
            data = request.get_json()
            project_id = data['id']
            project_name = data['name']
            project_author = username

            db.conn.execute("INSERT INTO projects (id, name, author) VALUES (?, ?, ?)", (project_id, project_name, project_author))
            db.conn.commit()

            return {'status': 'success'}
    except Exception as e:
        return {'error': str(e)}
    
@app.route('/comunity')
def comunity():
    return render_template('./html/comunity/index.html')

@app.route('/comunity/<project_id>')
def comunity_project(project_id):
    project = db.conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
    
    if project == None:
        return {'error': 'Project not found'}
    else:
        return render_template('./html/comunity/project/index.html', project=project)
    
@app.route('/comunity/<project_id>/download')
def download_project(project_id):
    project = db.conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
    
    if project == None:
        return {'error': 'Project not found'}
    else:
        return render_template('./html/comunity/project/download.html', project=project)

@app.route('/about')
def about():
    return render_template('./html/about/index.html')

app.run(debug=True, port=os.getenv('PORT'))