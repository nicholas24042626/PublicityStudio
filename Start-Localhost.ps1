$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$projectRoot = [System.IO.Path]::GetFullPath($PSScriptRoot)
$siteUrl = 'http://localhost:5173/'
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($siteUrl)

function Get-ContentType([string]$extension) {
    switch ($extension.ToLowerInvariant()) {
        '.html' { 'text/html; charset=utf-8' }
        '.css'  { 'text/css; charset=utf-8' }
        '.js'   { 'text/javascript; charset=utf-8' }
        '.json' { 'application/json; charset=utf-8' }
        '.svg'  { 'image/svg+xml' }
        '.png'  { 'image/png' }
        '.jpg'  { 'image/jpeg' }
        '.jpeg' { 'image/jpeg' }
        '.webp' { 'image/webp' }
        '.ico'  { 'image/x-icon' }
        default { 'application/octet-stream' }
    }
}

function Split-TranslationText([string]$text, [int]$maximumBytes = 450) {
    $parts = [System.Collections.Generic.List[string]]::new()
    $remaining = $text.Trim()
    while ([System.Text.Encoding]::UTF8.GetByteCount($remaining) -gt $maximumBytes) {
        $cut = [Math]::Min($remaining.Length, $maximumBytes)
        while ($cut -gt 1 -and [System.Text.Encoding]::UTF8.GetByteCount($remaining.Substring(0, $cut)) -gt $maximumBytes) { $cut-- }
        $candidate = $remaining.Substring(0, $cut)
        $sentenceCut = [Math]::Max($candidate.LastIndexOf('. '), [Math]::Max($candidate.LastIndexOf('! '), $candidate.LastIndexOf('? ')))
        if ($sentenceCut -gt 80) { $cut = $sentenceCut + 1 }
        elseif ($candidate.LastIndexOf(' ') -gt 40) { $cut = $candidate.LastIndexOf(' ') }
        $parts.Add($remaining.Substring(0, $cut).Trim())
        $remaining = $remaining.Substring($cut).Trim()
    }
    if (-not [string]::IsNullOrWhiteSpace($remaining)) { $parts.Add($remaining) }
    return $parts
}

try {
    $listener.Start()
    Write-Host ''
    Write-Host 'Publicity Material Generator is running at:' -ForegroundColor Green
    Write-Host $siteUrl -ForegroundColor Cyan
    Write-Host 'Keep this window open. Press Ctrl+C to stop the website.' -ForegroundColor Yellow
    Write-Host ''
    Start-Process $siteUrl

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        if ($context.Request.Url.AbsolutePath -eq '/api/translate' -and $context.Request.HttpMethod -eq 'POST') {
            $context.Response.ContentType = 'application/json; charset=utf-8'
            try {
                $reader = [System.IO.StreamReader]::new($context.Request.InputStream, $context.Request.ContentEncoding)
                $requestData = $reader.ReadToEnd() | ConvertFrom-Json
                $reader.Close()
                $languageCodes = @{ Chinese = 'zh-CN' }
                $targetCode = $languageCodes[$requestData.language]
                if ([string]::IsNullOrWhiteSpace($targetCode)) { throw 'Unsupported language.' }
                $translations = @{}
                foreach ($property in $requestData.texts.PSObject.Properties) {
                    $sourceText = [string]$property.Value
                    if ([string]::IsNullOrWhiteSpace($sourceText)) {
                        $translations[$property.Name] = ''
                        continue
                    }
                    $translatedParts = foreach ($part in (Split-TranslationText $sourceText)) {
                        $encodedText = [Uri]::EscapeDataString($part)
                        $translationUrl = "https://api.mymemory.translated.net/get?q=$encodedText&langpair=en%7C$targetCode"
                        $translationResponse = Invoke-RestMethod -Uri $translationUrl -Method Get -TimeoutSec 30
                        if ([int]$translationResponse.responseStatus -ne 200) { throw [string]$translationResponse.responseDetails }
                        $translatedText = [System.Net.WebUtility]::HtmlDecode([string]$translationResponse.responseData.translatedText)
                        if ([string]::IsNullOrWhiteSpace($translatedText)) { throw "Could not translate $($property.Name)." }
                        $translatedText.Trim()
                    }
                    $translations[$property.Name] = ($translatedParts -join ' ')
                }
                $resultJson = @{ translations = $translations } | ConvertTo-Json -Depth 5 -Compress
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($resultJson)
                $context.Response.StatusCode = 200
            } catch {
                $errorJson = @{ error = $_.Exception.Message } | ConvertTo-Json -Compress
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($errorJson)
                $context.Response.StatusCode = 503
            }
            $context.Response.ContentLength64 = $bytes.Length
            $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            $context.Response.OutputStream.Close()
            continue
        }
        $relativePath = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
        if ([string]::IsNullOrWhiteSpace($relativePath)) { $relativePath = 'index.html' }
        $requestedPath = [System.IO.Path]::GetFullPath((Join-Path $projectRoot $relativePath))

        if (-not $requestedPath.StartsWith($projectRoot, [System.StringComparison]::OrdinalIgnoreCase) -or -not [System.IO.File]::Exists($requestedPath)) {
            $context.Response.StatusCode = 404
            $bytes = [System.Text.Encoding]::UTF8.GetBytes('404 - File not found')
        } else {
            $context.Response.StatusCode = 200
            $context.Response.ContentType = Get-ContentType ([System.IO.Path]::GetExtension($requestedPath))
            $bytes = [System.IO.File]::ReadAllBytes($requestedPath)
        }

        $context.Response.ContentLength64 = $bytes.Length
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        $context.Response.OutputStream.Close()
    }
} finally {
    if ($listener.IsListening) { $listener.Stop() }
    $listener.Close()
}
