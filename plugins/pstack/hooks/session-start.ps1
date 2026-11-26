$ErrorActionPreference = 'Stop'

# One sheet per machine. Until the installer moves an older home's sheet
# there, that home's sheet still counts.
$configRoot = $env:XDG_CONFIG_HOME
if (-not $configRoot) {
    $configRoot = Join-Path $env:USERPROFILE '.config'
}
$sheet = Join-Path $configRoot 'arq-stack\models.md'
if (-not (Test-Path -LiteralPath $sheet -PathType Leaf)) {
    $sheetRoot = $env:CODEX_HOME
    if (-not $sheetRoot) {
        $sheetRoot = Join-Path $env:USERPROFILE '.codex'
    }
    $sheet = Join-Path $sheetRoot 'arq-stack-models.md'
}
$on = $false
if (Test-Path -LiteralPath $sheet -PathType Leaf) {
    # An unreadable sheet leaves the hook off, as session-start.sh does.
    try {
        $bytes = [System.IO.File]::ReadAllBytes($sheet)
        # Windows PowerShell 5.1's `>` writes UTF-16 LE with a byte-order mark.
        $encoding = if ($bytes.Length -ge 2 -and $bytes[0] -eq 0xFF -and $bytes[1] -eq 0xFE) { [System.Text.Encoding]::Unicode } else { [System.Text.UTF8Encoding]::new($false) }
        $lines = $encoding.GetString($bytes).TrimStart([char]0xFEFF) -split "`n" | ForEach-Object { $_ -replace "`r$", '' }
        $on = $lines -ccontains 'session hook: on'
    } catch { }
}
if (-not $on) {
    exit 0
}

[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::Write([System.IO.File]::ReadAllText((Join-Path $PSScriptRoot 'session-start-context.md'), [System.Text.Encoding]::UTF8))
