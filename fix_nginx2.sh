#!/bin/bash
sudo bash -c 'cat > /etc/nginx/sites-available/app.myshule.ke << "EOF"
server {
    listen 80;
    server_name app.myshule.ke;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF'
sudo ln -sf /etc/nginx/sites-available/app.myshule.ke /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo rm -f /etc/nginx/sites-enabled/myshule.ke
sudo nginx -t && sudo systemctl restart nginx