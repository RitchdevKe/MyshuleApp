#!/bin/bash
set -e
echo "Updating packages..."
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update
sudo apt-get upgrade -yq
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -yq nodejs nginx certbot python3-certbot-nginx unzip
echo "Installing PM2..."
sudo npm install -g pm2
echo "Deploying app..."
mkdir -p myshule-app
mv deploy.tar.gz myshule-app/
cd myshule-app
tar -xzvf deploy.tar.gz
echo "Installing NPM packages..."
npm install
echo "Building app..."
npm run build
echo "Starting app..."
pm2 start npm --name 'myshule' -- start
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
echo "Done!"
