param(
    [int]$Port = 8000,
    [switch]$OpenBrowser,
    [int]$DebugPort = 9222
)

# Start a Python simple HTTP server in a new window (keeps running)
Write-Host "Starting Python HTTP server on port $Port..."
Start-Process -FilePath "python" -ArgumentList "-m", "http.server", $Port -WindowStyle Normal

Start-Sleep -Milliseconds 500

if ($OpenBrowser) {
    Write-Host "Launching Chrome with remote debugging on port $DebugPort..."
    Start-Process "chrome" -ArgumentList "--remote-debugging-port=$DebugPort", "http://localhost:$Port"
} else {
    Write-Host "Open http://localhost:$Port in your browser to view the app."
}
