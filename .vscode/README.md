# VS Code Configuration Guide

This directory contains VS Code workspace configurations to streamline development.

## What's Included

```
.vscode/
├── launch.json     # Run & debug configurations
├── tasks.json      # Automated npm tasks
├── settings.json   # Workspace settings
└── README.md       # This file
```

## How to See Available Commands

There are **3 ways** to access VS Code tasks:

### Method 1: Command Palette (Easiest)
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
2. Type "Tasks: Run Task" (you can just type "task run")
3. Press Enter
4. You'll see a dropdown list with all available tasks:
   - Complete Project Setup
   - Install All Dependencies
   - Install Backend Dependencies
   - Install Frontend Dependencies
   - Setup Frontend Environment
   - Run Full Stack
   - Run Backend
   - Run Frontend

### Method 2: Terminal Menu
1. Look at the top menu bar in VS Code
2. Click **Terminal**
3. Click **Run Task...**
4. Select from the list

### Method 3: Run and Debug Panel
1. Press `F5` or click the Run icon in the left sidebar
2. Select a configuration from the dropdown (for running servers)

## Quick Start

### First Time Setup

**Recommended: Complete Setup in One Command**

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
2. Type "Tasks: Run Task" and press Enter
3. Select **"Complete Project Setup"** from the list
   - This installs all dependencies AND creates .env.local
4. Press `F5` and select **"Full Stack (Frontend + Backend)"**

**Alternative: Step by Step**

1. Install dependencies:
   - Press `Ctrl+Shift+P` → Type "Tasks: Run Task"
   - Select **"Install All Dependencies"**

2. Create frontend environment file:
   - Press `Ctrl+Shift+P` → Type "Tasks: Run Task"
   - Select **"Setup Frontend Environment"**

3. Press `F5` and select **"Full Stack (Frontend + Backend)"**

**Option 3: Manual Terminal**

```bash
cd backend && npm install
cd ../frontend && npm install && cp .env.example .env.local
```

Then press `F5` and select **"Full Stack (Frontend + Backend)"**

### Daily Development

- Press `F5` to start both servers
- Press `Shift+F5` to stop all servers
- Use the Debug Console to see combined output

## Files Overview

### launch.json
Debug and run configurations for the project.

**Configurations:**
- **Full Stack (Frontend + Backend)** - Compound configuration that runs both servers
- **Backend (Dev)** - NestJS backend in development mode (port 3001)
- **Backend (Debug)** - NestJS backend with debugger attached
- **Frontend (Dev)** - Next.js frontend in development mode (port 3000)

### tasks.json
Automated tasks for common operations.

**Available Tasks:**

*Setup Tasks:*
- **Complete Project Setup** - Full first-time setup (installs dependencies + creates .env.local)
- **Install All Dependencies** - Installs npm packages for both frontend and backend (default build task)
- **Install Backend Dependencies** - Backend only
- **Install Frontend Dependencies** - Frontend only
- **Setup Frontend Environment** - Creates .env.local from .env.example

*Run Tasks:*
- **Run Full Stack** - Alternative way to start both servers
- **Run Backend** - Start backend only
- **Run Frontend** - Start frontend only

**How to Run Tasks:**

**Method 1: Command Palette (Recommended)**
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
2. Type "Tasks: Run Task" (or just "task run")
3. You'll see a list of all available tasks
4. Select the task you want to run (e.g., "Complete Project Setup")

**Method 2: Terminal Menu**
1. Click **Terminal** in the top menu bar
2. Click **Run Task...**
3. Select from the list of available tasks

**Method 3: Build Task Shortcut**
- Press `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (macOS)
- This runs "Install All Dependencies" (the default build task)
- If it doesn't work, use Method 1 or 2 above

### settings.json
Workspace-specific settings for consistent development experience.

**Key Settings:**
- Format on save enabled
- ESLint auto-fix on save
- Prettier as default formatter
- Excludes node_modules, .next, and dist from search/file explorer

## Troubleshooting

### "Cannot find module" errors
Run the **Install All Dependencies** task or manually install:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Ports already in use
- Backend uses port 3001
- Frontend uses port 3000
- Stop other applications using these ports or modify the port configuration

### Debugger not attaching
Use **Backend (Debug)** configuration instead of **Backend (Dev)** for debugging with breakpoints.

### Terminal output not showing
Check the **Debug Console** panel at the bottom of VS Code for combined output from both servers.

## Quick Reference

### Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|--------------|-------|
| Open command palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| View all tasks | `Ctrl+Shift+P` → type "Tasks: Run Task" | `Cmd+Shift+P` → type "Tasks: Run Task" |
| Start servers | `F5` | `F5` |
| Stop servers | `Shift+F5` | `Shift+F5` |
| View problems | `Ctrl+Shift+M` | `Cmd+Shift+M` |

### Typical Workflow

1. **First time**: 
   - `Ctrl+Shift+P` → type "Tasks: Run Task" → Select "Complete Project Setup"
2. **Daily**: 
   - `F5` → Select "Full Stack (Frontend + Backend)"
3. **Stop**: 
   - `Shift+F5`

## Tips

- Use the **Problems** panel (`Ctrl+Shift+M`) to see ESLint errors across the project
- Use the **Terminal** panel to access the integrated terminals for each server
- Breakpoints work in the backend when using **Backend (Debug)** configuration
- Frontend debugging works through the browser DevTools
- The **Install All Dependencies** task is set as the default build task for quick access with `Ctrl+Shift+B`
