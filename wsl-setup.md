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

### 2. IDE Setup & Connectivity

Choose your preferred IDE to connect to the WSL environment.

**Antigravity:**
- Install the Windows executable from [antigravity.google](https://antigravity.google).
- Open the Command Palette (`Ctrl+Shift+P`) and select **Remote-WSL: Connect to WSL**.

**VS Code:**
- Install [VS Code](https://code.visualstudio.com/) and the [WSL extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl).
- Open the Command Palette (`Ctrl+Shift+P`) and select **WSL: Connect to WSL**.

**Windsurf:**
- Install [Windsurf](https://codeium.com/windsurf) (which includes built-in WSL support).
- Open the Command Palette (`Ctrl+Shift+P`) and select **Remote-WSL: Connect to WSL**.

### 3. Opening from Terminal (Optional)

To open projects directly from your Ubuntu terminal into your IDE, you can use built-in commands or set up an alias:

#### VS Code
```bash
# Use the built-in command
code .
```

#### Windsurf
```bash
# Use the built-in command
windsurf .
```

#### Antigravity
Add the following `agy` alias to your `~/.bashrc`:

```bash
alias agy='/mnt/c/Users/hsummerhays/AppData/Local/Programs/Antigravity/bin/antigravity'
```
Reload the configuration:

```bash
source ~/.bashrc
```
Then open the project directly:

```bash
cd ~/enterprise-express
agy .
```
