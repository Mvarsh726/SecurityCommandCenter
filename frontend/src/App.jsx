import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [target, setTarget] = useState('')
  const [scanMessage, setScanMessage] = useState('')
  const [securityHeaders, setSecurityHeaders] = useState(() => {
  const savedHeaders = localStorage.getItem('securityHeaders')
  return savedHeaders ? JSON.parse(savedHeaders) : {}
})
useEffect(() => {
  localStorage.setItem('securityHeaders', JSON.stringify(securityHeaders))
}, [securityHeaders])
  const [usesHttps, setUsesHttps] = useState(false)
  const [securityFindings, setSecurityFindings] = useState(() => {
  const savedHeaders = localStorage.getItem('securityHeaders')

  if (!savedHeaders) {
    return 0
  }

  const headers = JSON.parse(savedHeaders)

  return Object.values(headers).filter((value) => !value).length
})
  const [activeAlerts, setActiveAlerts] = useState(() => {
  const savedHeaders = localStorage.getItem('securityHeaders')

  if (!savedHeaders) {
    return 0
  }

  const headers = JSON.parse(savedHeaders)

  return Object.values(headers).filter((value) => !value).length
})
  const [scanHistory, setScanHistory] = useState(() => {
  const savedHistory = localStorage.getItem('scanHistory')
  return savedHistory ? JSON.parse(savedHistory) : []
})
useEffect(() => {
  localStorage.setItem('scanHistory', JSON.stringify(scanHistory))
}, [scanHistory])
  const [networkInfo, setNetworkInfo] = useState({})

  const handleScan = async () => {
    if (!target.trim()) {
      setScanMessage('Please enter a target.')
      return
    }

    setScanMessage('Scanning...')

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/scan?target=${encodeURIComponent(target)}`
      )

      const data = await response.json()

      if (data.status === 'success') {
    
        setUsesHttps(data.uses_https)

        const missingHeaders = Object.values(data.security_headers).filter(
          (value) => !value
        ).length

        setSecurityFindings(missingHeaders)
        setActiveAlerts(missingHeaders)

        setScanHistory((history) => [
          ...history,
          {
            target: data.target,
            httpStatus: data.http_status,
            https: data.uses_https,
            coverage: Math.round(((5 - missingHeaders) / 5) * 100),
            findings: missingHeaders,
            time: new Date().toLocaleTimeString()
          }
        ])

        setScanMessage(
          `HTTP Status: ${data.http_status} | Response Time: ${data.response_time}s`
        )
        setNetworkInfo({
            ip: data.ip_address,
            target: data.target,
            httpStatus: data.http_status,
            https: data.uses_https,
            responseTime: data.response_time
        })
        setSecurityHeaders(data.security_headers)
      } else {
        setScanMessage(data.message)
      }
    } catch (error) {
      setScanMessage('Could not connect to scanner backend')
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>🛡 Security Center</h2>

        <nav>
          <button
            className={activePage === 'Dashboard' ? 'active' : ''}
            onClick={() => setActivePage('Dashboard')}
          >
            Dashboard
          </button>

          <button
            className={activePage === 'Network' ? 'active' : ''}
            onClick={() => setActivePage('Network')}
          >
            Network
          </button>

          <button
            className={activePage === 'Threats' ? 'active' : ''}
            onClick={() => setActivePage('Threats')}
          >
            Security Findings
          </button>

          <button
            className={activePage === 'Logs' ? 'active' : ''}
            onClick={() => setActivePage('Logs')}
          >
            Logs
          </button>

          <button
            className={activePage === 'Scanner' ? 'active' : ''}
            onClick={() => setActivePage('Scanner')}
          >
            Scanner
          </button>
        </nav>
      </aside>

      <main className="main">
      <h1>{activePage}</h1>

      <p className="subtitle">
        You are viewing the {activePage} section.
      </p>

        {activePage === 'Dashboard' && (
          <section className="overview">
            <h2>Security Overview</h2>

            <div className="cards">
  <div className="card findings-card">
    <h3>Security Findings</h3>
    <p>{securityFindings}</p>
    <small>Headers requiring review</small>
  </div>

  <div className="card alerts-card">
    <h3>Active Alerts</h3>
    <p>{activeAlerts}</p>
    <small>Current security findings</small>
  </div>

  <div className="card systems-card">
    <h3>Systems Monitored</h3>
    <p>{new Set(scanHistory.map((scan) => scan.target)).size}</p>
    <small>Unique scanned targets</small>
  </div>

<div
  className={`card coverage-card ${
    scanHistory.length === 0
      ? ''
      : scanHistory[scanHistory.length - 1].coverage === 100
      ? 'coverage-good'
      : scanHistory[scanHistory.length - 1].coverage > 0
      ? 'coverage-partial'
      : 'coverage-low'
  }`}
>
  <h3>Security Coverage</h3>

  <p>
    {scanHistory.length > 0
      ? `${scanHistory[scanHistory.length - 1].coverage}%`
      : '0%'}
  </p>

  <small>
    {scanHistory.length === 0
      ? 'No scan yet'
      : scanHistory[scanHistory.length - 1].coverage === 100
      ? 'All checks passed'
      : scanHistory[scanHistory.length - 1].coverage === 0
      ? 'Review recommended'
      : 'Partial coverage'}
  </small>
</div>
</div>

            {scanHistory.length > 0 && (
  <div className="scan-result">
    <div className="scan-header">
      <div>
        <h3>Last Scan</h3>
        <p className="scan-target">
          {scanHistory[scanHistory.length - 1].target}
        </p>
      </div>

      <span
        className={
          scanHistory[scanHistory.length - 1].coverage === 100
            ? 'scan-status passed'
            : 'scan-status review'
        }
      >
        {scanHistory[scanHistory.length - 1].coverage === 100
          ? 'All checks passed'
          : 'Review recommended'}
      </span>
    </div>

    <div className="scan-details">
      <div>
        <span>HTTP Status</span>
        <strong>{scanHistory[scanHistory.length - 1].httpStatus}</strong>
      </div>

      <div>
        <span>HTTPS</span>
        <strong>
          {scanHistory[scanHistory.length - 1].https
            ? 'Enabled'
            : 'Not detected'}
        </strong>
      </div>

      <div>
        <span>Coverage</span>
        <strong>{scanHistory[scanHistory.length - 1].coverage}%</strong>
      </div>

      <div>
        <span>Findings</span>
        <strong>{scanHistory[scanHistory.length - 1].findings}</strong>
      </div>

      <div>
        <span>Scan Time</span>
        <strong>{scanHistory[scanHistory.length - 1].time}</strong>
      </div>
    </div>
  </div>
)}
          </section>
        )}

        {activePage === 'Scanner' && (
          <section className="overview">
            <h2>Security Scanner</h2>
            <p>Scan a target for basic security information.</p>

            <div className="scanner-box">
              <input
                type="text"
                placeholder="Enter domain or IP address"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />

              <button onClick={handleScan}>Start Scan</button>
            </div>

            {scanMessage && (
              <div className="scan-result">
                <h3>Scan Result</h3>

                <p>Target: {target}</p>

                <p>{scanMessage}</p>

                <p>
                  HTTPS:{' '}
                  {usesHttps ? 'Enabled' : 'Not detected'}
                </p>

                <h3>Security Header Checks</h3>

                <p>
                  Headers detected:{' '}
                  {Object.values(securityHeaders).filter((value) => value).length}
                  {' / '}
                  {Object.keys(securityHeaders).length}
                </p>

                <p>
                  Coverage:{' '}
                  {Object.keys(securityHeaders).length
                    ? Math.round(
                        (Object.values(securityHeaders).filter(
                          (value) => value
                        ).length /
                          Object.keys(securityHeaders).length) *
                          100
                      )
                    : 0}
                  %
                </p>

                <p>
                  Status:{' '}
                  {Object.values(securityHeaders).filter((value) => value)
                    .length === Object.keys(securityHeaders).length
                    ? 'All checks passed'
                    : 'Review recommended'}
                </p>

                {Object.entries(securityHeaders).map(([header, value]) => (
                  <div key={header} className="header-result">
                    <p>
                      {header}
                    </p>

                    <span className="header-value">
                      {value
                        ? `Present: ${value}`
                        : 'Not detected — review recommended'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        {activePage === 'Network' && (
          <section className="overview">
            <h2>Network Information</h2>

            {networkInfo.ip ? (
              <div className="network-grid">
                <div className="network-card">
                    <h3>Target</h3>
                    <p>{networkInfo.target}</p>
                </div>

                <div className="network-card">
                  <h3>IP Address</h3>
                  <p>{networkInfo.ip}</p>
                </div>

                <div className="network-card">
                  <h3>HTTP Status</h3>
                  <p>{networkInfo.httpStatus}</p>
                </div>

                <div className="network-card">
                  <h3>HTTPS</h3>
                  <p>{networkInfo.https ? 'Enabled' : 'Not detected'}</p>
                </div>

                <div className="network-card">
                  <h3>Response Time</h3>
                  <p>{networkInfo.responseTime}s</p>
                </div>
            </div>
            ) : (
              <p>Run a scan to view network information.</p>
          )}
              </section>
        )}

        {activePage === 'Threats' && (
          <section className="overview">
            <h2>Security Findings</h2>

            <p>
              Findings: {Object.values(securityHeaders).filter((value) => !value).length}
            </p>

            {Object.keys(securityHeaders).length === 0 ? (
              <p>Run a scan to view security findings.</p>
            ) : (
              <div className="scan-history">
                {Object.entries(securityHeaders).map(([header, value]) => (
                  <div className="history-item" key={header}>
                    <h3>{header}</h3>
                    <p>
                      {value
                        ? ' Header detected'
                        : ' Header not detected — review recommended'}
                    </p>
                  </div>
                ))}
              </div>
          )}
          </section>
)}
        {activePage === 'Logs' && (
          <section className="overview">
            <h2>Scan History</h2>

            {scanHistory.length === 0 ? (
              <p>No scans recorded yet.</p>
            ) : (
              <div className="scan-history">
                {scanHistory.map((scan, index) => (
                  <div className="history-item" key={index}>
                    <h3>{scan.target}</h3>
                    <p>HTTP Status: {scan.httpStatus}</p>
                    <p>HTTPS: {scan.https ? 'Enabled' : 'Not detected'}</p>
                    <p>Coverage: {scan.coverage}%</p>
                    <p>Security Findings: {scan.findings}</p>
                    <p>Scan Time: {scan.time}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default App