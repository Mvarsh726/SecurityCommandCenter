from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import socket

app = Flask(__name__)
CORS(app)

@app.route("/scan")
def scan():
    target = request.args.get("target", "")

    if not target:
        return jsonify({
            "status": "error",
            "message": "No target provided"
        }), 400

    if not target.startswith(("http://", "https://")):
        target = "https://" + target

    try:
        ip_address = socket.gethostbyname(target.replace("https://", "").replace("http://", "").split("/")[0])
        response = requests.get(target, timeout=5)


        security_headers = {
            "Strict-Transport-Security": response.headers.get("Strict-Transport-Security"),
            "Content-Security-Policy": response.headers.get("Content-Security-Policy"),
            "X-Frame-Options": response.headers.get("X-Frame-Options"),
            "X-Content-Type-Options": response.headers.get("X-Content-Type-Options"),
            "Referrer-Policy": response.headers.get("Referrer-Policy")
        }

        return jsonify({
            "status": "success",
            "target": target,
            "ip_address": ip_address,
            "uses_https": target.startswith("https://"),
            "http_status": response.status_code,
            "response_time": round(response.elapsed.total_seconds(), 2),
            "security_headers": security_headers
        })

    except requests.RequestException:
        return jsonify({
            "status": "error",
            "target": target,
            "message": "Target could not be reached"
        }), 400

if __name__ == "__main__":
    app.run(port=5000, debug=True)