$content = Get-Content src/app/login/LoginClient.tsx -Raw
$pattern = '(?s)const handleLogin = async \(e: React\.FormEvent\) => \{.*?catch \(err: any\) \{'
$replacement = 'const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to login");
      }

      if (loginMode === "parent" || data.role === "Parent") {
        router.push("/parent-portal/home");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {'
$content = $content -replace $pattern, $replacement
Set-Content src/app/login/LoginClient.tsx $content
