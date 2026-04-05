"""
Авторизация и регистрация пользователей MEMEX.
POST /register — регистрация
POST /login — вход
GET  /me — получить текущего пользователя по токену
POST /logout — выход
"""
import json
import os
import hashlib
import secrets
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_schema():
    return os.environ.get("MAIN_DB_SCHEMA", "public")


def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")
    path = "/" + action if action else (event.get("path") or "/")
    method = event.get("httpMethod", "GET")
    schema = get_schema()

    # GET /me
    if method == "GET" and path.endswith("/me"):
        token = event.get("headers", {}).get("X-Session-Token") or event.get("headers", {}).get("x-session-token")
        if not token:
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Токен не передан"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, username, email, bio, created_at FROM {schema}.users WHERE session_token = %s",
            (token,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Недействительный токен"})}
        user = {"id": row[0], "username": row[1], "email": row[2], "bio": row[3], "created_at": str(row[4])}
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"user": user})}

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    # POST /register
    if method == "POST" and path.endswith("/register"):
        username = (body.get("username") or "").strip()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not username or not email or not password:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Заполните все поля"})}
        if len(username) < 3:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Имя минимум 3 символа"})}
        if len(password) < 6:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Пароль минимум 6 символов"})}

        pw_hash = hash_password(password)
        token = secrets.token_hex(32)

        conn = get_conn()
        cur = conn.cursor()
        try:
            cur.execute(
                f"INSERT INTO {schema}.users (username, email, password_hash, session_token) VALUES (%s, %s, %s, %s) RETURNING id, username, email, bio",
                (username, email, pw_hash, token)
            )
            row = cur.fetchone()
            conn.commit()
        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            conn.close()
            return {"statusCode": 409, "headers": headers, "body": json.dumps({"error": "Пользователь уже существует"})}
        finally:
            conn.close()

        user = {"id": row[0], "username": row[1], "email": row[2], "bio": row[3]}
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"token": token, "user": user})}

    # POST /login
    if method == "POST" and path.endswith("/login"):
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Заполните все поля"})}

        pw_hash = hash_password(password)
        token = secrets.token_hex(32)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, username, email, bio FROM {schema}.users WHERE email = %s AND password_hash = %s",
            (email, pw_hash)
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Неверный email или пароль"})}

        cur.execute(f"UPDATE {schema}.users SET session_token = %s WHERE id = %s", (token, row[0]))
        conn.commit()
        conn.close()

        user = {"id": row[0], "username": row[1], "email": row[2], "bio": row[3]}
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"token": token, "user": user})}

    # POST /logout
    if method == "POST" and path.endswith("/logout"):
        token = event.get("headers", {}).get("X-Session-Token") or event.get("headers", {}).get("x-session-token")
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {schema}.users SET session_token = NULL WHERE session_token = %s", (token,))
            conn.commit()
            conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

    return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Не найдено"})}