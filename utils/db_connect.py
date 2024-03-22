import libsql_experimental as libsql
import os
import dotenv

dotenv.load_dotenv()

url = os.getenv("DB_URI")
auth_token = os.getenv("DB_AUTH_TOKEN")

if url is None or auth_token is None:
    print("Error: Environment variables TURSO_DATABASE_URL or TURSO_AUTH_TOKEN not set!")
else:
    conn = libsql.connect("so-long-mm-userdb.db", sync_url=url, auth_token=auth_token)
    conn.sync()
