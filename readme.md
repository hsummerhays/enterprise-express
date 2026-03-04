# Express Backend (WSL-Native)

A modern Node.js backend environment optimized for Windows 11 WSL2 and Google Antigravity.

## Tech Stack

- **Node.js**: v24.x
- **Express**: v5.x

## 🛠 Environment Setup

This project is designed to run natively within **Ubuntu (WSL2)** for maximum file system performance and compatibility with Node.js v24.

### 1. Windows Configuration (`.wslconfig`)

To allow seamless networking between the Windows host and WSL, add the following to `%USERPROFILE%\.wslconfig`:

```ini
[wsl2]
networkingMode=mirrored
localhostForwarding=true
```

Apply the changes by running the following in a Windows PowerShell:

```powershell
wsl --shutdown
```

### 2. Antigravity Setup & Connectivity

Download Antigravity: Install the Windows executable from [antigravity.google](https://antigravity.google).

Remote Connection: Open the Command Palette (`Ctrl+Shift+P`) and select **Remote-WSL: Connect to WSL**.

### 3. Opening from Terminal (Optional)

To open projects directly from your Ubuntu terminal, add the following `agy` alias to your `~/.bashrc`:

```bash
alias agy='/mnt/c/Users/hsummerhays/AppData/Local/Programs/Antigravity/bin/antigravity'
```
Reload the configuration:

```bash
source ~/.bashrc
```
Then open the project directly:

```bash
cd ~/express-backend
agy .
```

## 🏗 Architecture

The project follows an enterprise-style separation of concerns, mirroring patterns found in C# and Java:

* **`src/server.js`**: The entry point. Loads environment variables and ignites the HTTP server.
* **`src/app.js`**: The Application assembly. Configures Express middleware, routes, and global error handlers.
* **`src/services/`**: Class-based business logic (Singletons).
* **`src/routes/`**: (Planned) Modular route definitions.

## 🚀 Development Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the server with Node 24 `--watch` mode and `.env` support. |
| `npm start` | Production-style start using standard Node. |

## 📡 Networking & Ports

* **Default Port:** `3000` (Configurable in `.env`)
* **Access:** Reachable via `http://localhost:3000` on the Windows host.
* **Notifications:** Port-forwarding notifications can be disabled via the Antigravity/VS Code settings gear to prevent redundant prompts in Mirrored Mode.

## 🛡 Security & Git

* **.env**: Local secrets and ports (Ignored by Git).
* **node_modules**: Linux-specific dependencies (Ignored by Git).
* **package-lock.json**: Tracked to ensure reproducible builds across the WSL environment.