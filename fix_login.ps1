$content = Get-Content src/app/login/LoginClient.tsx -Raw
$content = $content -replace '(?s)if \(!res\.ok\) \{.*?\}\s+if \(data\.role === "Parent"\) \{.*?\} else \{.*?\router\.push\("/dashboard"\);\s*\}', 'if (!res.ok) { throw new Error(data.error || "Failed to login"); } if (loginMode === "parent" || data.role === "Parent") { router.push("/parent-portal/home"); } else { router.push("/dashboard"); }'
Set-Content src/app/login/LoginClient.tsx $content
