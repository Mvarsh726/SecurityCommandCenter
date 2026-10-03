# Security Command Center

A web-based cybersecurity dashboard for scanning websites, analyzing HTTP security headers, monitoring network information, and reviewing security findings.

## Overview

**Security Command Center (SCC)** is a full-stack web application designed to provide a simple interface for performing basic website security checks.

The application allows users to enter a website URL and run a passive scan that retrieves network information, checks HTTP response details, detects HTTPS usage, and analyzes important security headers.

The project was developed to demonstrate practical implementation of **web development, REST API integration, HTTP security analysis, and frontend-backend communication**.

## Features

* Scan websites using a target URL
* Detect IP address through DNS resolution
* Check HTTP response status
* Measure response time
* Detect HTTPS usage
* Analyze HTTP security headers
* Calculate security coverage
* Display security findings
* Monitor network information
* Maintain scan history and logs
* Persist scan data using browser local storage
* Provide a dashboard for viewing the latest scan results

## Security Checks

The scanner currently checks the following HTTP security headers:

* `Strict-Transport-Security`
* `Content-Security-Policy`
* `X-Frame-Options`
* `X-Content-Type-Options`
* `Referrer-Policy`

Missing headers are reported as security findings and contribute to the overall security coverage calculation.

## Dashboard Sections

### Dashboard

Provides an overview of:

* Security Findings
* Active Alerts
* Systems Monitored
* Security Coverage
* Latest Scan

### Network

Displays information collected during the latest scan:

* Target
* IP Address
* HTTP Status
* HTTPS Status
* Response Time

### Security Findings

Displays the security headers detected during the latest scan and identifies headers that require review.

### Logs

Maintains a history of previously performed scans, including:

* Target
* HTTP status
* HTTPS status
* Security coverage
* Number of findings
* Scan time

### Scanner

Provides the main interface for entering a target website and performing the security scan.

## How It Works

```text
User enters target URL
        ↓
React Frontend
        ↓
Flask REST API
        ↓
DNS Resolution + HTTP Request
        ↓
Security Header Analysis
        ↓
JSON Response
        ↓
Dashboard / Network / Findings / Logs
```

## Project Structure

```text
SecurityCommandCenter/
│
├── backend/
│   └── scanner.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
└── README.md
```

## Technologies Used

### Frontend

* React
* Vite
* Node.js
* JavaScript
* CSS

### Backend

* Python
* Flask
* Flask-CORS
* Requests
* Socket / DNS resolution

### Other

* REST API
* Browser Local Storage

## Requirements

* Python 3.x
* Node.js
* npm
* Modern web browser

## How to Run

### 1. Start the Backend

Open a terminal in the project directory:

```bash
cd backend
py scanner.py
```

The Flask backend runs on:

```text
http://127.0.0.1:5000
```

### 2. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local Vite URL displayed in the terminal, usually:

```text
http://localhost:5173
```

### 3. Run a Scan

Enter a website such as:

```text
https://example.com
```

and start the scan to view the results.

## Future Enhancements

Possible future improvements include:

* Improved UI/UX
* Additional security header and configuration checks
* More detailed vulnerability analysis
* Exportable security reports
* Authentication and user roles
* Database-backed scan history
* Additional network and security analysis

## Author

**Varshini M**

Computer Science & Engineering
