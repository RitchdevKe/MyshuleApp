npm run build
if ($LASTEXITCODE -ne 0) { throw 'Build failed' }

tar -czf dotnext.tar.gz .next
if ($LASTEXITCODE -ne 0) { throw 'Tar failed' }

scp -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -o StrictHostKeyChecking=no -i C:\Users\USER\Downloads\LightsailDefaultKey-ap-south-1.pem dotnext.tar.gz ubuntu@65.0.168.180:/home/ubuntu/myshule-app/dotnext.tar.gz
if ($LASTEXITCODE -ne 0) { throw 'SCP failed' }

ssh -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -o StrictHostKeyChecking=no -i C:\Users\USER\Downloads\LightsailDefaultKey-ap-south-1.pem ubuntu@65.0.168.180 "cd myshule-app && rm -rf .next && tar -xzf dotnext.tar.gz && rm dotnext.tar.gz && pm2 restart myshule"
