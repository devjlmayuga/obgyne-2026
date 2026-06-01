#!/bin/bash
set -e

sudo certbot renew --dry-run
# Stop nginx
#sudo systemctl stop nginx && \

# Renew cert (waits until finished)
#sudo certbot renew && \

# Start nginx (only runs if renew succeeded)
#sudo systemctl start nginx

echo "✅ Certificate renewed and nginx restarted successfully."

