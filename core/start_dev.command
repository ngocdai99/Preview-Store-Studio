#!/bin/bash
# ==============================================================================
# Store Preview Studio · 1-Click Live Dev Server Launcher for macOS
# ==============================================================================

# Ensure working directory is this script's directory
cd "$(dirname "$0")"

# Load macOS environment variables, Homebrew & NVM paths
[ -s "$HOME/.zshrc" ] && source "$HOME/.zshrc" >/dev/null 2>&1
[ -s "$HOME/.bash_profile" ] && source "$HOME/.bash_profile" >/dev/null 2>&1
[ -s "$HOME/.nvm/nvm.sh" ] && source "$HOME/.nvm/nvm.sh" >/dev/null 2>&1

export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.nvm/versions/node/v20.20.2/bin:$HOME/.volta/bin:$HOME/.fnm/current/bin:$PATH"

clear
echo "======================================================"
echo "Store Preview Studio · Live Server (1-Click Run)"
echo "======================================================"
echo "Directory: $(pwd)"
echo "------------------------------------------------------"

# Check if node exists
if ! command -v node >/dev/null 2>&1; then
    echo "[Error] Node.js is not installed on your system."
    echo "   Please download and install Node.js from https://nodejs.org"
    echo ""
    read -p "Press [Enter] to close this window..."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"
echo "Starting Live Server & opening browser..."
echo "------------------------------------------------------"

# Run dev server with auto-reload and auto-browser opening
node dev.js

echo ""
echo "🛑 Live Server stopped."
read -p "Press [Enter] to close this window..."
