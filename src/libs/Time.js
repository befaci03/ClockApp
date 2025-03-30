const { ipcRenderer, nativeImage } = require("electron");

let date = {
    date: {
        year: 1980,
        month: 1,
        day: 1
    },
    hour: 0,
    minute: 0,
    seconds: 0,
    ms: 1
}

setInterval(() => {
    const now = new Date(); // get date

    const _ms = now.getMilliseconds(); // time
    const s = now.getSeconds();
    const mi = now.getMinutes();
    const h = now.getHours();

    const d = now.getDate(); // date (i through it was getDay bruh)
    const ____mo = now.getMonth() + 1;
    const y = now.getFullYear();

    // convert month
    let mo;
    if (____mo === 1) mo = "January";
    else if (____mo === 2) mo = "February";
    else if (____mo === 3) mo = "March";
    else if (____mo === 4) mo = "April";
    else if (____mo === 5) mo = "May";
    else if (____mo === 6) mo = "June";
    else if (____mo === 7) mo = "July";
    else if (____mo === 8) mo = "August";
    else if (____mo === 9) mo = "September";
    else if (____mo === 10) mo = "October";
    else if (____mo === 11) mo = "November";
    else if (____mo === 12) mo = "December";

    // now store the data
    date.date.day = d;
    date.date.month = mo;
    date.date.year = y;
    date.ms = _ms;
    date.seconds = s;
    date.minute = mi;
    date.hour = h;

    icon();
}, 1000);

/**
 * @param {boolean|null} nativeImg 
 * @param {string} color 
 * @returns {string|Electron.NativeImage}
 */
function generateDigitalClock(nativeImg, size = 186, color = "white", center = false) {
    const canvas = require('canvas').createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fontSize = Math.floor(size * 0.7);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = color;

    if (center) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(date.hour, size * 0.5, size * 0.225);
        ctx.fillText(date.minute, size * 0.5, size * 0.775);
    } else {
        ctx.fillText(date.hour, size * 0.1, size * 0.45);
        ctx.fillText(date.minute, size * 0.6, size * 0.85);
    }

    const dataUrl = canvas.toDataURL("image/png");
    return nativeImg ? nativeImage.createFromDataURL(dataUrl) : dataUrl;
}
/**
 * Generates a cool analog clock.
 * @param {boolean|null} nativeImg - Returns a nativeImage, else a encoded one.
 * @param {number} size - Canvas size.
 * @param {boolean} showMs - Shows milliseconds on the clock.
 * @returns {string|Electron.NativeImage} - Encoded BASE64 image or nativeImage.
 */
function generateAnalogClock(nativeImg, size = 258, showMs = false) {
    const canvas = require('canvas').createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    const radius = size * 0.45;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const now = new Date();

    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = size * 0.02;
    ctx.stroke();

    for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12;
        const x1 = centerX + Math.cos(angle) * (radius * 0.85);
        const y1 = centerY + Math.sin(angle) * (radius * 0.85);
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
    const msecondAngle = (milliseconds * Math.PI * 2) / 1000;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = size * 0.03;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(hourAngle - Math.PI / 2) * (radius * 0.5), centerY + Math.sin(hourAngle - Math.PI / 2) * (radius * 0.5));
    ctx.stroke();

    ctx.strokeStyle = 'black';
    ctx.lineWidth = size * 0.02;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(minuteAngle - Math.PI / 2) * (radius * 0.75), centerY + Math.sin(minuteAngle - Math.PI / 2) * (radius * 0.75));
    ctx.stroke();

    ctx.strokeStyle = 'red';
    ctx.lineWidth = size * 0.01;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(secondAngle - Math.PI / 2) * (radius * 0.9), centerY + Math.sin(secondAngle - Math.PI / 2) * (radius * 0.9));
    ctx.stroke();

    if (showMs) {
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = size * 0.09;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(msecondAngle - Math.PI / 2) * (radius * 0.95), centerY + Math.sin(msecondAngle - Math.PI / 2) * (radius * 0.95));
        ctx.stroke();
    }

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.02, 0, Math.PI * 2);
    ctx.fill();

    return nativeImg ? nativeImage.createFromDataURL(canvas.toDataURL()) : canvas.toDataURL("image/png");
}
function icon() {
    function setFavicon() {
        if (ipcRenderer) {
            ipcRenderer.send('setIco', generateDigitalClock(true));
            console.debug('Icon Generated');
        }
    }

    setFavicon();
}

module.exports = { generateDigitalClock, date, icon, generateAnalogClock };
