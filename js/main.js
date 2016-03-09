var canvas = null,
    context = null,
    centerX = document.width / 2,
    centerY = document.width / 2,
    watchRadius = document.width / 2;

function drawCircle(x, y, radius, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
}

function drawNeedle(angle, start, end, width, color) {
    var dxi = watchRadius * Math.cos(angle) * start,
        dyi = watchRadius * Math.sin(angle) * start,
        dxf = watchRadius * Math.cos(angle) * end,
        dyf = watchRadius * Math.sin(angle) * end;

    // Draw the needle
    context.beginPath();
    context.lineWidth = width;
    context.strokeStyle = color;
    context.moveTo(centerX + dxi, centerY + dyi);
    context.lineTo(centerX + dxf, centerY + dyf);
    context.stroke();
    context.closePath();
}

function drawWatchLayout() {
    var angle = 0,
        i = 1;
        
    // Clear canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    
    // 12 unit divider
    for (i = 1; i <= 12; i++) {
        angle = (i - 3) * (Math.PI * 2) / 12;
        drawNeedle(angle, 0.95, 1.0, 5, "#c4c4c4");
    }

    /* 12 unit line
    for (j = 1; j <= 12; j++) {
        angle = (j - 3) * (Math.PI * 2) / 12;
        drawNeedle(angle, 0.7, 0.945, 10, "#c4c4c4");
    }*/

    /* write texts
    context.font = '25px Courier';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#999999';
    context.fillText('TIZEN WATCH', centerX, centerY - (watchRadius * 0.4));*/
}

function drawWatchContent(hour, minute, second, mili, date) {
    // Draw a hour needle
    drawNeedle(Math.PI * (((hour + minute / 60) / 6) - 0.5), 0, 0.50, 4, "#FFD700");

    // Draw a minute needle
    drawNeedle(Math.PI * (((minute + second / 60) / 30) - 0.5), 0, 0.85, 3, "#FFD700");

    // Draw a second needle
    drawNeedle(Math.PI * ((second / 30) - 0.5), .85, 0.95, 6, "#FF1493");

    // Draw a text for date
    context.font = '25px Courier';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillStyle = '#FF1493';
    context.fillText(date, centerX, centerY + (watchRadius * -0.5));
}

function drawWatch() {
    var datetime = tizen.time.getCurrentDateTime(),
        hour = datetime.getHours(),
        minute = datetime.getMinutes(),
        second = datetime.getSeconds(),
        mili = datetime.getMilliseconds(),
        date = datetime.getDate();

    // Draw a basic layout
    drawWatchLayout();

    // Draw a watch content
    drawWatchContent(hour, minute, second, mili, date);
}


window.onload = function() {
    canvas = document.querySelector("#myCanvas");
    context = canvas.getContext("2d");
    // Set a canvas square
    canvas.width = document.width;
    canvas.height = canvas.width;
    // Start main loop
    setInterval(function() {
        drawWatch();
    }, 100);
    // add eventListener for tizenhwkey
    window.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === 'back') {
            tizen.application.getCurrentApplication().exit();
        }
    });
    // add eventListener to update the screen immediately when the device wakes up
    document.addEventListener("visibilitychange", function() {
        if (!document.hidden) {
            drawWatch();
        }
    });
    /*window.addEventListener('ambientmodechanged', function(e) {
        console.log("ambientmodechanged : " + e.detail.ambientMode);
        if (e.detail.ambientMode === true) {
            // rendering ambient mode case
            drawWatch();
        }
    });*/
};

