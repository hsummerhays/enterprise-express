# 🛠 Environment Setup

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
