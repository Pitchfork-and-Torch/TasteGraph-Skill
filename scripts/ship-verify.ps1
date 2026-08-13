# ship-verify.ps1
# On-disk TasteGraph post-ship checks. Prefer -File this script over inline
# powershell -Command paste-style blocks (those trip Trojan:Win32/ClickFix heuristics).
# ASCII only.

[CmdletBinding()]
param(
    [string]$Version = '',
    [string]$BaseUrl = 'https://tastegraph.jonbailey.xyz',
    [switch]$WriteCachebust
)

$ErrorActionPreference = 'Stop'
# scripts/ lives under tastegraph-skill/
$root = Split-Path $PSScriptRoot -Parent

$wheel = Join-Path $root 'site\public\wheel'
$cachebustPath = Join-Path $wheel 'CACHEBUST.txt'

if (-not $Version) {
    if (Test-Path -LiteralPath $cachebustPath) {
        $line = (Get-Content -LiteralPath $cachebustPath -TotalCount 1).Trim()
        if ($line -match '^(\S+)') { $Version = $Matches[1] }
    }
}
if (-not $Version) { $Version = '0.0.0' }

Write-Host "[TG] root=$root version=$Version"

if ($WriteCachebust) {
    $stamp = Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK'
    $text = "$Version $stamp`n"
    [System.IO.File]::WriteAllText($cachebustPath, $text)
    Write-Host ("[TG] wrote CACHEBUST.txt -> " + $text.Trim())
}

Write-Host "[TG] live: $BaseUrl/updates/log.json"
$j = Invoke-RestMethod "$BaseUrl/updates/log.json" -TimeoutSec 30
$first = if ($j.entries -and $j.entries.Count -gt 0) { $j.entries[0].title } else { '(none)' }
Write-Host "[TG] latest=$($j.latest) first_title=$first"

Write-Host "[TG] live: contributing-sources.json?v=$Version"
$cs = Invoke-RestMethod "$BaseUrl/wheel/contributing-sources.json?v=$Version" -TimeoutSec 30
$csVer = if ($null -ne $cs.graph_version) { $cs.graph_version } elseif ($cs.graph) { $cs.graph.version } else { '?' }
Write-Host "[TG] cs=$csVer count=$($cs.count)"

Write-Host "[TG] live: ingest-stills.json?v=$Version"
$ig = Invoke-RestMethod "$BaseUrl/wheel/ingest-stills.json?v=$Version" -TimeoutSec 30
$igVer = if ($null -ne $ig.graph_version) { $ig.graph_version } elseif ($ig.graph) { $ig.graph.version } else { '?' }
$igCount = if ($ig.items) { $ig.items.Count } else { 0 }
Write-Host "[TG] ig=$igVer items=$igCount"

Write-Host "[TG] ship-verify OK"
exit 0
