// Canvas setting
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width= 400;
canvas.height=700;
document.body.appendChild(canvas)

let backgroundImage, spaceshipImage, bulletImage, missileImage, enemyImage, gameOverImage;
let gameOver = false;
let score = 0;
let stage = 1;

let spaceshipX = canvas.width/2 - 32
let spaceshipY = canvas.height - 100

let bulletList = []
let missileList = []
let missileStack = 0
let bulletSpeed = 7
let enemySpeed = 3
let spaceshipSpeed = 5

function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.x = spaceshipX + 7
        this.y = spaceshipY
        this.alive = true
        bulletList.push(this)
    }
    this.update = function() {
        this.y -= bulletSpeed;
    }

    this.checkHit = function() {
        for (let i=0; i < enemyList.length; i++)
        {
            if(
                this.y <= enemyList[i].y && 
                this.y <= enemyList[i].y - 30 && 
                this.x >= enemyList[i].x - 30 && 
                this.x <= enemyList[i].x + 50
            ) {
                score++;
                if (score % 10 == 0) {
                    stage++;
                }
                this.alive = false
                enemyList.splice(i, 1)
            }
        }
        
    }
}

function Missile(){
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.x = spaceshipX + 7
        this.y = spaceshipY
        this.alive = true
        missileList.push(this)
    }
    this.update = function() {
        this.y -= bulletSpeed -4;
    }

    this.checkHit = function() {
        for (let i=0; i < enemyList.length; i++)
        {
            if(
                this.y <= enemyList[i].y && 
                this.y <= enemyList[i].y - 30 && 
                this.x >= enemyList[i].x - 30 && 
                this.x <= enemyList[i].x + 50
            ) {
                score++;
                if (score % 10 == 0) {
                    stage++;
                }
                enemyList.splice(i, 1)
            }
        }
        
    }
}


function generateRandomValue(min, max) {
    let randomNum = Math.floor(Math.random() * (max - min) ) + min
    return randomNum;
}

let enemyList = []
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.status = 0;
    this.init = function() {
        this.y = 0
        this.x = generateRandomValue(0, canvas.width-60)
        enemyList.push(this)
        this.status = generateRandomValue(0, 12)
    }
    this.update = function() {
        this.y += enemySpeed + (stage - 1)

        if(this.status < 5) {
        }
        if(this.status >= 6 && this.status <=7) {
            this.x += 2
        }
        if(this.status >= 8 && this.status <=9) {
            this.x -= 2
        }
        if(this.status >= 10) {
            this.x += generateRandomValue(-30, 30)
        }
        if (this.x <= 0) {
            this.x = 0
        }
        if (this.x >= canvas.width - 70) {
            this.x = canvas.width - 70
        }
        if(this.y >= canvas.height - 70) {
            gameOver = true;
        }
    }
}

function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src="images/background.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png"

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png"

    missileImage = new Image();
    missileImage.src = "images/missile.png"

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png"

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.png"
}

let keysDown = {}
function setupKeyboardListener(){
    document.addEventListener("keydown", function(event) {
        keysDown[event.keyCode] = true;
        console.log("Keydown", keysDown, event.key, event.keyCode);
    })
    document.addEventListener("keyup", function() {
        delete keysDown[event.keyCode]
        console.log("Keyup", keysDown, event.key, event.keyCode)
        
        if(event.keyCode == 32) {
            createBullet()
        }
    })
}

function createBullet() {
    console.log("bullet")
    if(missileStack%10 == 0)
    {
        let m = new Missile()
        m.init()
    } else {
        let b = new Bullet()
        b.init()
    }
    missileStack += 1
    
}

function cleanBullet() {
    for(let i = 0; i < bulletList.length; i++)
    {
        if(!bulletList[i].alive || bulletList[i].y <= 0) {
            bulletList.splice(i, 1)
        }
    }
    for(let i = 0; i < missileList.length; i++) {
        if(missileList[i].y <= 0) {
            missileList.splice(i, 1)
        }
    }
}

function createEnemy() {
    const interval = setInterval(function() {
        let e = new Enemy()
        e.init()
    }, 1100 - stage*100)
}

function update(){
    if( 39 in keysDown ) {
        spaceshipX += spaceshipSpeed;
    } //right 
    if( 37 in keysDown ) {
        spaceshipX -= spaceshipSpeed;
    } //left

    if(spaceshipX <= 0) {
        spaceshipX = 0;
    }

    if( spaceshipX >= canvas.width - 80) {
        spaceshipX = canvas.width  - 80;
    }

    
    for(let i = 0; i < missileList.length; i++) {
        missileList[i].update()
        missileList[i].checkHit()
    }

    for(let i = 0; i < bulletList.length; i++) {
        if (bulletList[i].alive)
        {
            bulletList[i].update()
            bulletList[i].checkHit()
        }
    }

    for(let i = 0; i < enemyList.length; i++) {
        enemyList[i].update()
    }

    cleanBullet()
}

function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY)
    ctx.fillText(`Stage:${stage}`, 20, 40)
    ctx.fillText(`Score:${score}`, 20, 80)
    ctx.fillStyle = "white"
    ctx.font = "20px Arial"
    for(let i=0; i < bulletList.length; i++) {
        if(bulletList[i].alive) {
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }
    }
    for(let i=0; i < missileList.length; i++) {
        ctx.drawImage(missileImage, missileList[i].x, missileList[i].y);
    }

    for(let i=0; i<enemyList.length; i++) {
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y)
    }
}


function main() {
    if (!gameOver) {
        update();
        render();
        requestAnimationFrame(main);
    } else {
        ctx.drawImage(gameOverImage, 10, 200, 380, 120)
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
