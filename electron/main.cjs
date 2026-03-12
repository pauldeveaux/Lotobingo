const { app, BrowserWindow } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const treeKill = require('tree-kill')

const PORT = 3000
let mainWindow = null
let frontProcess = null

function isProduction() {
  return app.isPackaged
}

function getServerEntry() {
  if (isProduction()) {
    return path.join(process.resourcesPath, '.output', 'server', 'index.mjs')
  }
  return path.join(__dirname, '..', '.output', 'server', 'index.mjs')
}

function waitForServer(url, timeout = 30000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const check = () => {
      const http = require('http')
      const req = http.get(url, () => {
        resolve()
      })
      req.on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error(`Server did not start within ${timeout}ms`))
        } else {
          setTimeout(check, 500)
        }
      })
      req.end()
    }
    check()
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const serverEntry = getServerEntry()
  frontProcess = spawn(process.execPath, [serverEntry], {
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1', PORT: String(PORT), NITRO_PORT: String(PORT) },
    stdio: 'inherit',
  })

  frontProcess.on('error', (err) => {
    console.error('Failed to start server:', err)
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(`http://localhost:${PORT}`)) {
      const childWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
      })
      childWindow.loadURL(url)
    }
    return { action: 'deny' }
  })

  const serverUrl = `http://localhost:${PORT}`
  waitForServer(serverUrl)
    .then(() => mainWindow.loadURL(serverUrl))
    .catch((err) => {
      console.error(err.message)
      app.quit()
    })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function killAllProcesses() {
  return new Promise((resolve) => {
    if (!frontProcess || !frontProcess.pid) return resolve()

    treeKill(frontProcess.pid, 'SIGKILL', (err) => {
      if (err) console.error(`Error killing process ${frontProcess.pid}:`, err)
      else console.log(`Killed process ${frontProcess.pid}`)
      resolve()
    })
  })
}

async function handleShutdown() {
  console.log('Shutting down...')
  try {
    await killAllProcesses()
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.close()
    }
  } catch (err) {
    console.error('Error during shutdown:', err)
  } finally {
    app.quit()
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    handleShutdown()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

process.on('SIGINT', handleShutdown)
process.on('SIGTERM', handleShutdown)
process.on('uncaughtException', (error) => {
  console.error('Uncaught error:', error)
})
