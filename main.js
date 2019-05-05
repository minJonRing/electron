require('update-electron-app')({
  logger: require('electron-log')
})

const path = require('path')
const glob = require('glob')
const {app, BrowserWindow, ipcMain} = require('electron')

const debug = /--debug/.test(process.argv[2])

if (process.mas) app.setName('Electron APIs')
ipcMain.on('window-switch', function (e,data) {
  console.log(data)
})
let mainWindow = null
function initialize () {
  makeSingleInstance()

  loadDemos()

  function createWindow () {
    const windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      title: app.getName(),
      webPreferences: {
        nodeIntegration: true
      }
    }
    
    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png')
    }

    mainWindow = new BrowserWindow(windowOptions)
    // mainWindow.setFullScreen(true);
    // mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))
    mainWindow.loadURL(path.join('file://', __dirname, '/views/2.html'))
    // mainWindow.loadURL('http://www.baidu.com')

    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow.webContents.openDevTools()
      mainWindow.maximize()
      require('devtron').install()
    }

    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }

  app.on('ready', () => {
    createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
  var dgram = require('dgram');
  var udp_server = dgram.createSocket('udp4');
  udp_server.bind(6688); // 绑定端口

  // 监听端口
  udp_server.on('listening', function () {
      console.log('udp server linstening 5678.');
  })

  //接收消息
  udp_server.on('message', function (msg, rinfo) {
      strmsg = msg.toString();
      handleUdpView(mainWindow,strmsg)
      // mainWindow.loadURL(path.join('file://', __dirname, '/tqr.html'))
      // udp_server.send(strmsg, 0, strmsg.length, rinfo.port, rinfo.address); //将接收到的消息返回给客户端
      console.log(`udp server received data: ${strmsg} from ${rinfo.address}:${rinfo.port}`)
  })
  //错误处理
  udp_server.on('error', function (err) {
      console.log('some error on udp server.')
      udp_server.close();
  })
}
// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
  if (process.mas) return

  app.requestSingleInstanceLock()

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// Require each JS file in the main-process dir
function loadDemos () {
  const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
  files.forEach((file) => { require(file) })
}

let udpIndex = 0, udpView = ['index.html','1.html','2.html','3.html'];
// udp渲染页面
function handleUdpView(obj,type){
  switch(type){
    case 'dj':
      udpIndex=0;
      obj.loadURL(path.join('file://', __dirname, '/index.html'))
    break;
    case 'zy':
      udpIndex=1;
      obj.loadURL(path.join('file://', __dirname, '/1.html'))
    break;
    case 'down':
      udpIndex++;
      let len = udpView.length-1;
      if(udpIndex>len){
        udpIndex=len;
      }
      obj.loadURL(path.join('file://', __dirname, '/'+udpView[udpIndex]))
    break;
    case 'up':
      udpIndex--;
      if(udpIndex<0){
        udpIndex=0;
      }
      obj.loadURL(path.join('file://', __dirname, '/'+udpView[udpIndex]))
    break;
    default:
    break;
  }
}
initialize()
