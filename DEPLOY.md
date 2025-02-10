# 🚀 Deployment Guide: HR Web Application

This guide provides step-by-step instructions for deploying the **HR Web Application** on **AWS EC2** with **Cloudflare** for CDN caching and SSL termination. It also includes security configurations using **iptables**.

---

## **✅ Deployment Overview**

- **Frontend**: Hosted on AWS EC2, served via `http-server`
- **Backend**: Fastify running on AWS EC2 with SQLite
- **Cloudflare**: Used for CDN caching and SSL termination
- **Security**: Enforce HTTPS-only access with iptables

---

## **🔹 1️⃣ AWS EC2 Setup**

### **Connect to Your Instance**

```sh
ssh ubuntu@your-ec2-ip
sudo apt update && sudo apt upgrade -y

# Install nvm
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Load nvm (or restart terminal)
source ~/.bashrc

# Install Node.js 22
nvm install 22
nvm use 22

sudo apt install -y build-essential python3-pip gcc g++ make
```

### **Clone and Setup Backend**

```sh
git clone https://github.com/your-repo/human-resources-web.git
cd human-resources-web/hr-backend
npm install
```

### **Start Backend Server**

```sh
node server.js
```

#### **Use PM2 for Process Management**

```sh
npm install -g pm2
pm2 start server.js --name hr-backend
pm2 save
```

---

## **🔹 2️⃣ Frontend Deployment**

```sh
cd ../hr-app
ng build --configuration=production

npm install -g http-server
http-server dist/hr-app/browser -p 443 --cors --ssl --cert cert.pem --key key.pem
```

---

## **🔹 3️⃣ Cloudflare Configuration**

### **1️⃣ Add Your Domain to Cloudflare**

1. Go to **Cloudflare Dashboard**
2. Add your domain (e.g., `your-domain.com`)
3. Update DNS records to point to your AWS EC2 IP

### **2️⃣ Enable Edge Caching & Performance**

- Enable **Proxy Mode** (⚡ Orange Cloud)
- Set **SSL Mode** to **Full (Strict)** under **SSL/TLS**
- Under **Page Rules**:
  - `https://your-domain.com/api/*` → **Bypass Cache**
  - `https://your-domain.com/*` → **Cache Everything**
- Minify **HTML/CSS/JS** under **Speed → Optimization**

### **3️⃣ Enforce HTTPS for All Requests**

- Go to **Cloudflare → SSL/TLS → Edge Certificates**
- Enable **"Always Use HTTPS"**

---

## **🎉 Your HR Web App is Now Live!**

🌎 Users access frontend via **Cloudflare Edge**
🛡️ Backend secured via **HTTPS with iptables**
⚡ Fast performance with **Cloudflare CDN caching**
