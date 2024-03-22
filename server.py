from flask import Flask, render_template, request, send_from_directory
from utils import db_connect as db
from utils import session as sess

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('./html/index.html')

@app.route('/editor/')
def editor():
    return render_template('./html/editor/index.html')

@app.route('/public/<path:path>')
def public(path):
    return send_from_directory('public', path)

@app.route('/auth/')
def auth_page():
    return render_template('./html/auth/index.html')

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
            return {'error': 'Invalid password'}
        
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

app.run(debug=True, port=5500)