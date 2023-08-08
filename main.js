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
let heart = 3;

let score = 0;
let stage = 1;

let spaceshipX = canvas.width/2 - 32
let spaceshipY = canvas.height - 100

let bulletList = []
let missileList = []
let missileStack = 0
let bulletSpeed = 5
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
        this.y -= bulletSpeed + 3;
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
        this.dir = 1
        this.stack = 0
        enemyList.push(this)
        this.status = generateRandomValue(0, 12)
    }
    this.update = function() {
        this.y += enemySpeed + (stage - 1)

        if(this.status < 5) {
        }
        if(this.status >= 6 - (stage - 1) && this.status <=7 - (stage - 1)) {
            this.x += this.dir * (2 + (stage - 1))
        }
        if(this.status >= 8 - (stage - 1) && this.status <=9 - (stage - 1)) {
            this.x -= this.dir * (2 + (stage - 1))
        }
        if(this.status >= 10) {
            this.x += this.dir*(generateRandomValue(2, 4) + (stage - 1))
            this.stack ++
            if(this.stack > 50){
                this.dir *= -1
                this.stack = 0
            }
        }
        if (this.x <= 0) {
            this.x = 0
            this.dir *= -1
            
        }
        if (this.x >= canvas.width - 80) {
            this.x = canvas.width - 80
            this.dir *= -1
        }
        if(this.y == canvas.height - 70) {
            heart--
            console.log(heart)
            if(heart == 0) {
                gameOver = true
            }
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

    heartImage = new Image();
    heartImage.src = "images/heart.png"

    emptyHeartImage = new Image()
    emptyHeartImage.src = "images/emptyheart.png"
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
        
        if(!gameOver && event.keyCode == 32) {
            createBullet()
        }
        else if(gameOver) {
            gameOver = false
            score = 0
            stage = 1
            heart = 3
            bulletList = []
            enemyList = []
            missileList = []
            main()
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
        if(!bulletList[i].alive || bulletList[i].y <= -30) {
            bulletList.splice(i, 1)
        }
    }
    for(let i = 0; i < missileList.length; i++) {
        if(missileList[i].y <= 0) {
            missileList.splice(i, 1)
        }
    }
}

function cleanEnemy() {
    for(let i = 0; i < enemyList.length; i++) {
        if(enemyList[i].y >= canvas.height - 70 ) {           
            enemyList.splice(i, 1)
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
    cleanEnemy()
}

function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY)
    if(heart == 3) {
        ctx.drawImage(heartImage, canvas.width - 60, 20)
        ctx.drawImage(heartImage, canvas.width - 105, 20)
        ctx.drawImage(heartImage, canvas.width - 150, 20)
    }
    else if(heart == 2) {
        ctx.drawImage(heartImage, canvas.width - 60, 20)
        ctx.drawImage(heartImage, canvas.width - 105, 20)
        ctx.drawImage(emptyHeartImage, canvas.width - 150, 20)
    }
    else if (heart == 1) {
        ctx.drawImage(heartImage, canvas.width - 60, 20)
        ctx.drawImage(emptyHeartImage, canvas.width - 105, 20)
        ctx.drawImage(emptyHeartImage, canvas.width - 150, 20)
    }
    else {
        ctx.drawImage(emptyHeartImage, canvas.width - 60, 20)
        ctx.drawImage(emptyHeartImage, canvas.width - 105, 20)
        ctx.drawImage(emptyHeartImage, canvas.width - 150, 20)
    }
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
        ctx.fillText('아무 키나 다시 눌러 시작!', 90, 500)
        ctx.fillStyle = "white"
        ctx.font = "20px Arial"
        ctx.drawImage(gameOverImage, 10, 200, 380, 100)
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
