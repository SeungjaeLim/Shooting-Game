// Canvas setting
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas)

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;


let spaceshipX = canvas.width/2 - 32
let spaceshipY = canvas.height - 64

let bulletList = []

function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.x = spaceshipX + 8
        this.y = spaceshipY

        bulletList.push(this)
    }
    this.update = function() {
        this.y -= 7;
    }
}

function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src="images/background.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png"

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png"

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
    let b = new Bullet()
    b.init()
}

function update(){
    if( 39 in keysDown ) {
        spaceshipX += 5;
    } //right 
    if( 37 in keysDown ) {
        spaceshipX -= 5;
    } //left

    if(spaceshipX <= 0) {
        spaceshipX = 0;
    }

    if( spaceshipX >= canvas.width - 64) {
        spaceshipX = canvas.width  - 64;
    }
}

function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY)

    for(let i=0; i < bulletList.length; i++) {
        ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
}


function main() {
    update();
    render();
    requestAnimationFrame(main);
}

loadImage();
setupKeyboardListener();
main();