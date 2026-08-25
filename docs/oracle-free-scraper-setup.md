# Oracle Cloud Always Free — Scraper Service (Mumbai, Indian IP)

Goal: host `scraper-service/` (Crawl4AI) on Oracle's **forever-free** tier in an
**Indian region**, so Indian gov sites (NIC, *.assam.gov.in, ctet.nic.in) stop
timeing out. This fixes both the watcher and the syllabus finder.

> Region naming note: in Oracle's dropdown **"India West" = Mumbai** (`ap-mumbai-1`)
> and **"India South" = Hyderabad** (`ap-hyderabad-1`). Pick either — both give an
> Indian IP. Prefer **India West (Mumbai)**: it's the older, larger region with
> better Always-Free capacity availability.

## Why this works

Oracle Always Free includes (for the life of the account):
- 2x AMD VMs (1/8 OCPU, 1GB RAM each), or better: **4 ARM OCPUs + 24GB RAM** split across up to 4 VMs
- 200GB block storage, 10TB/month egress
- **1 reserved public IP**

An Indian outbound IP is the key — US hosts (Vercel/Railway US) get throttled
by NIC/gov servers; Mumbai does not.

## Step-by-step

### 1. Signup (~15 min)
1. Go to https://www.cloud.oracle.com/ → "Start for free"
2. Choose **Home region: India West (Mumbai)** — this cannot be changed later!
   (India South = Hyderabad also works if Mumbai shows capacity issues.)
3. Credit/debit card needed for identity verification only (no charge on Always Free).
4. If "Out of capacity" errors appear when creating the VM, retry at different
   times of day — this is common and eventually succeeds.

### 2. Create the VM (~5 min)
1. Console → Compute → Instances → Create Instance
2. Image: **Ubuntu 22.04** (canonical)
3. Shape: **Ampere A1.Flex** → 2 OCPU / 12 GB RAM (plenty for Chromium)
4. SSH key: add your public key (or paste one generated with `ssh-keygen`)
5. After creation: instance details → Attached VNICs → IPv4 Addresses →
   **Reserve a public IP** and attach it (stays yours while the VM lives).

### 3. Open port 8080
Console → Networking → Virtual Cloud Networks → your VCN → Security Lists →
Default Security List → Add Ingress Rule:
- Source CIDR: `0.0.0.0/0`, IP Protocol: `TCP`, Destination Port: `8080`

### 4. Deploy the service (SSH into the VM)
```bash
ssh ubuntu@<YOUR_PUBLIC_IP>

# Docker (simplest)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu && newgrp docker

# copy the repo (or clone from GitHub once pushed)
git clone <YOUR_REPO_URL> && cd assam-jobs-repository/scraper-service
# if repo is private/private-ish, just scp these files instead:
#   main.py requirements.txt Dockerfile

docker build -t scraper .
docker run -d --name scraper --restart unless-stopped -p 8080:8080 scraper
curl http://localhost:8080/health   # {"ok":true}
```

### 5. Point Vercel at it
```bash
npx vercel env add SCRAPER_SERVICE_URL production
# value: http://<YOUR_PUBLIC_IP>:8080
```
Then redeploy (`vercel --prod` or push). Test from Vercel:
`POST /api/scrape {"url":"https://ctet.nic.in/"}` — should now succeed reliably.

### 6. Harden (recommended)
- Oracle also gives a free Always-Free **reserved static IP** — use it so the
  URL never changes.
- Optional HTTPS later via Caddy + a free domain (DuckDNS), but plain HTTP to
  your own backend over SSRF-guarded URLs is acceptable for now. Do NOT share
  the IP/service publicly without auth.

## Cost check
Always Free = $0 forever as long as the account stays active (log in occasionally;
idle always-free accounts are rarely reclaimed, and instances are exempt if you
convert to PAYG identity — still $0).

## Fallback if Oracle signup fails
Deploy `render.yaml` (repo root) on Render free plan (Singapore region).
Slower cold starts + 512MB RAM, but zero card needed.
