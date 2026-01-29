# Fix requirements.txt
$reqPath = "backend/requirements.txt"
$reqContent = @"
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
requests==2.31.0
"@
$reqContent | Set-Content $reqPath -Force

# Fix Sidebar.tsx
$sidebarPath = "frontend/src/components/Sidebar.tsx"
$sidebar = Get-Content $sidebarPath -Raw

# 1. Define API_BASE_URL
if ($sidebar -notmatch "const API_BASE_URL") {
    $sidebar = $sidebar.Replace("import type { Notam } from '../types';", "import type { Notam } from '../types';`n`nconst API_BASE_URL = import.meta.env.VITE_API_URL || 'https://grand-flow.up.railway.app';")
}

# 2. Replace URLs with the constant
$sidebar = $sidebar.Replace("'https://web-production-8c73.up.railway.app/api/export/kml'", "`${API_BASE_URL}/api/export/kml`")
$sidebar = $sidebar.Replace("`"https://web-production-8c73.up.railway.app/api/parse`"", "`${API_BASE_URL}/api/parse`")

$sidebar | Set-Content $sidebarPath -NoNewline -Force

# Clear .env.production to avoid confusion (let user use Vercel env vars)
Set-Content "frontend/.env.production" "" -Force

Write-Host "Files updated successfully."
