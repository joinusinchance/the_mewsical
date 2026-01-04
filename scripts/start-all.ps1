param(
    [int]$GamePort = 8000,
    [int]$ProxyPort = 3000,
    [switch]$OpenBrowser
)

Write-Host "Starting proxy server on port $ProxyPort..." -ForegroundColor Cyan
$env:PORT = $ProxyPort
Start-Process -FilePath "node" -ArgumentList "./scripts/proxy.js" -NoNewWindow

Start-Sleep -Seconds 1

Write-Host "Starting game server on port $GamePort..." -ForegroundColor Cyan
Start-Process -FilePath "python" -ArgumentList "-m", "http.server", $GamePort -WindowStyle Normal

Start-Sleep -Milliseconds 500

if ($OpenBrowser) {
    Write-Host "Launching Chrome..." -ForegroundColor Cyan
    Start-Process "chrome" -ArgumentList "--remote-debugging-port=9222", "http://localhost:$GamePort?cachebust=$((Get-Date).Ticks)"
} else {
    Write-Host "Game running at http://localhost:$GamePort" -ForegroundColor Green
    Write-Host "Proxy running at http://localhost:$ProxyPort -> https://lb.yogurtthehor.se/api/v1" -ForegroundColor Green
}
