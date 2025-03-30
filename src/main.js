const { BrowserWindow, app, ipcMain, nativeImage, Tray, Menu, dialog } = require('electron');

const path = require('path');
const { generateDigitalClock, generateAnalogClock } = require('./libs/Time');
const _argv = process.argv.slice(2);

let date = require('./libs/Time').date;

setInterval(() => {
    date = require('./libs/Time').date;

    function trayUpdateHandler() {
        const img = generateDigitalClock(true, 186, "white", true);
        __tray.setImage(img);
    }
    trayUpdateHandler();
}, 1000);

let mainWin;
let __tray;
function setupWin() {
    mainWin = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        title: "Loading... \\ Clock App",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWin.loadFile(path.join(__dirname, 'views', 'app', 'index.html'));

    ipcMain.on("setIco", (event, dataUrl) => {
        const img = nativeImage.createFromDataURL(dataUrl);

        if (!img.isEmpty()) {
            mainWin.setIcon(img);
        } else {
            console.error("Failed to create icon from base64");
        }
    });
    // logics for the frontend
    ipcMain.on("request-clock", (event, clocktype, color) => {
        let clockDataUrl;
        clocktype === "analog" ? clockDataUrl = generateDigitalClock(false, color) : clockDataUrl = generateAnalogClock(false);
        event.sender.send("clock-update", clockDataUrl);
    });

    mainWin.addListener('close', (event) => {
        event.preventDefault();

        function createClockIcon() {
            const canvas = require('canvas').createCanvas(64, 64);
            const ctx = canvas.getContext('2d');
        
            const radius = 30;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const now = new Date();
        
            const hour = now.getHours() % 12;
            const minute = now.getMinutes();
            const second = now.getSeconds();
        
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
        
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            for (let i = 0; i < 12; i++) {
                const angle = (i * Math.PI * 2) / 12;
                const x1 = centerX + Math.cos(angle) * (radius - 5);
                const y1 = centerY + Math.sin(angle) * (radius - 5);
                const x2 = centerX + Math.cos(angle) * radius;
                const y2 = centerY + Math.sin(angle) * radius;
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        
            const hourAngle = ((hour % 12) * Math.PI * 2) / 12 + (Math.PI * 2) * (minute / 60) / 12;
            const minuteAngle = (minute * Math.PI * 2) / 60;
            const secondAngle = (second * Math.PI * 2) / 60;
        
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(hourAngle - Math.PI / 2) * (radius * 0.6), centerY + Math.sin(hourAngle - Math.PI / 2) * (radius * 0.6));
            ctx.stroke();
        
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(minuteAngle - Math.PI / 2) * (radius * 0.8), centerY + Math.sin(minuteAngle - Math.PI / 2) * (radius * 0.8));
            ctx.stroke();
        
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(secondAngle - Math.PI / 2) * (radius * 0.9), centerY + Math.sin(secondAngle - Math.PI / 2) * (radius * 0.9));
            ctx.stroke();
        
            return nativeImage.createFromDataURL(canvas.toDataURL());
        }
        __tray.displayBalloon({
            title: 'Warning',
            content: 'Clock App is now on system tray mode!',
            icon: createClockIcon(),
            largeIcon: true
        });

        mainWin.hide();
    });
}
function setupTray() {
    const img = generateDigitalClock(true, "white");
    __tray = new Tray(img);

    __tray.setToolTip("Clock Time");

    const trayContext = Menu.buildFromTemplate([
        {
            label: 'Open App',
            click: () => {
                mainWin.show();
                __tray.displayBalloon({
                    title: 'Clock App window',
                    content: 'The Clock App window reappear.',
                    iconType: "info",
                    largeIcon: false,
                    noSound: true
                });
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Exit Clock App',
            click: () => {
                app.exit();
            }
        }
    ]);
    __tray.setContextMenu(trayContext);
}

app.whenReady().then(() => {
    app.setMaxListeners(1); // prevent multiple instances

    if (!_argv[0]) setupWin();
    setupTray();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
