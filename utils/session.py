import random

def generate_uuid4():
    characters = '0123456789abcdef'
    uuid = ''
    
    for i in range(32):
        uuid += characters[random.randint(0, 15)]
    
    return str(uuid)

def generate_session_id():
    return generate_uuid4()
