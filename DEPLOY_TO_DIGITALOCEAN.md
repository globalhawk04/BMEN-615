# Deploying to DigitalOcean Droplet (`globalhawk.us`, 165.245.194.17)

This guide deploys the app as two containers (`web`, the static site + nginx;
`presence`, the tiny presenter-beacon service) behind a **host-level nginx**
that owns ports 80/443 and terminates TLS. The containers themselves only
listen on `127.0.0.1:8080` — they are never directly exposed to the internet.

This is the one supported path. (An earlier version of this doc offered two
alternatives that contradicted each other on which port to use — this
version fixes that.)

---

### Prerequisites on the Droplet

```bash
sudo apt update
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx
sudo systemctl enable --now docker
```

---

### Step 1: Upload the App to Your Droplet

From your local machine:

```bash
rsync -avz --progress /home/j/Desktop/cell/app/ root@165.245.194.17:/var/www/cell-app/
```

(Using the droplet's IP here works whether or not `globalhawk.us`'s DNS has
propagated yet. Once the A record is live, `root@globalhawk.us` works too.)

---

### Step 2: Set the Presenter Passphrase

Edit `/var/www/cell-app/docker-compose.yml` on the droplet and change:

```yaml
- PRESENTER_TOKEN=change-me-before-deploying
```

to a real passphrase. This is the only thing that gates presenter-mode
writes — anyone with it can broadcast; no one without it can. Students never
see or need it.

---

### Step 3: Start the Containers

```bash
ssh root@165.245.194.17
cd /var/www/cell-app
docker-compose up -d --build
```

The `web` container now listens on `127.0.0.1:8080` only (see
`docker-compose.yml`), the `presence` service is reachable only from inside
the Docker network (nginx inside the `web` container proxies `/api/` to it
— see `nginx.conf`).

---

### Step 4: Configure the Host Nginx Reverse Proxy + TLS

Create `/etc/nginx/sites-available/globalhawk.us`:

```nginx
server {
    listen 80;
    server_name globalhawk.us www.globalhawk.us;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/globalhawk.us /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d globalhawk.us -d www.globalhawk.us
```

(DNS must already point `globalhawk.us` / `www.globalhawk.us` at
`165.245.194.17` before running certbot — it validates ownership over HTTP
on port 80 using that A record.)

Certbot rewrites the server block to redirect 80→443 and serve HTTPS
automatically; it also sets up auto-renewal.

---

### Step 5: Verify

- `https://globalhawk.us` loads the app.
- Open `https://globalhawk.us/?present=1` on your own device, enter the
  passphrase, click through tabs — the "🎤 Presenter Mode" indicator should
  appear in the header.
- On a *different* device/browser (no `?present=1`), you should see the
  floating presenter beacon appear within a few seconds after you navigate,
  with a "Jump there" button. Independent browsing must keep working even
  if you never enter presenter mode anywhere.

---

### Local Testing Before Deploying

Static site only (no presenter beacon backend):

```bash
cd /home/j/Desktop/cell/app
python3 server.py
```
Open `http://localhost:8080`.

Full stack, matching production (static site + presence beacon):

```bash
cd /home/j/Desktop/cell/app
docker-compose up --build
```
Open `http://localhost:8080`.
