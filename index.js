var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var leftPlayer;
var rightPlayer;
var ball;

var started;
var gameIsRunning;
var keyPressed = {'ArrowUp': false, 'ArrowDown': false, 'w': false, 's': false };

document.addEventListener('keydown', (event) => {
    if(!started){
        ball.speedX = 2;
        ball.speedY = 2;
        started = !started;
    }
        keyPressed[event.key] = true;
        if(event.key == ' ') gameIsRunning = !gameIsRunning;
})

document.addEventListener('keyup', (event) => {
    if(!started){
        ball.speedX = 2;
        ball.speedY = 2;
        started = !started;
    }
        keyPressed[event.key] = false;
})


class Ball{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.speedX = 0;
        this.speedY = 0;
    }

    update(){
        this.checkCollision();
        this.x += this.speedX;
        this.y += this.speedY;
    }


    draw(){
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle= "white";
        ctx.stroke();
    }


    yCollisionWith(player){
        let collisionLowerBound = this.y - this.radius <= player.y + player.height;
        let collisionUpperBound = this.y + this.radius >= player.y 
        return collisionLowerBound && collisionUpperBound 
    }

    getSpeedYModByPlayer(player){
        let errorMargin = 5;
        let playerMiddle = player.y + 0.5 * player.height;

        if(this.y <= playerMiddle + errorMargin && this.y >= playerMiddle - errorMargin){
            return 0;
        }
        if (this.y <= playerMiddle - errorMargin) {
            return -0.4;
        }
        if (this.y >= playerMiddle + errorMargin){
            return 0.4;
        }

    }
    
    checkCollision(){
        let leftBorder = this.x - this.radius;
        let rightBorder = this.x + this.radius;

        if(leftBorder <= leftPlayer.x + leftPlayer.width && this.yCollisionWith(leftPlayer)){
            this.speedX < 1 ? this.speedX -= 0.1 : this.speedX += 0.1; 
            this.speedX *= -1;
            this.speedY *= -1;
            this.speedY += this.getSpeedYModByPlayer(leftPlayer);
        }
    

        if(rightBorder >= rightPlayer.x && this.yCollisionWith(rightPlayer)){
            this.speedX < 1 ? this.speedX -= 0.1 : this.speedX += 0.1; 
            this.speedX *= -1;
            this.speedY *= -1;
            this.speedY += this.getSpeedYModByPlayer(rightPlayer);
            
        }

        //collision with top of canvas
        if(this.y - this.radius <= 0){
            this.speedY *= -1;
        }

        //collision with bottom of canvas
        if(this.y + this.radius >= canvas.height){
            this.speedY *= -1;
        }

        if(this.x - this.radius <= 0){
            alert("right player has won 😎");
            gameIsRunning = false;
        }

        if(this.x >= canvas.width){
            alert("left player has won 😎");
            gameIsRunning = false;
        }
    }

}

class Player{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 60;
    }

    draw(){
        ctx.fillStyle = "white";
        ctx.fillRect(this.x,this.y, this.width, this.height)
    }

    ai(){
        if(ball.y > this.y){
            this.move("down")
        }
        if(ball.y < this.y){
            this.move("up")
        }
    }

    move(direction){
        switch(direction){
            case "up":
                if(this.y <= 0){
                    break;
                }
                this.y = this.y - 3;
                this.draw()
                break;

            case "down":
                if(this.y + this.height >= canvas.height){
                    break;
                }
                this.y = this.y + 3;
                this.draw();
                break;
        }
    }
}


function initPlayers(){

    leftPlayer = new Player(50, canvas.height / 2 - 30);
    rightPlayer = new Player( canvas.width - 50, canvas.height/ 2 -30);
    ball = new Ball(canvas.width / 2, canvas.height / 2);

    rightPlayer.draw();
    leftPlayer.draw();
}

function updateMovement(){

    if(keyPressed['ArrowUp']){
        rightPlayer.move("up");        
    }
    
    if(keyPressed['ArrowDown']){
        rightPlayer.move("down");
    }
    
    if(keyPressed['w']){
        leftPlayer.move("up");
    }

    if(keyPressed['s']){
        leftPlayer.move("down");
    }
}

function drawCanvas(){
    ctx.fillStyle = "#102025";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function initPingPong(){
    started = false;
    gameIsRunning = true;

    drawCanvas()
    initPlayers()
    gameLoop();
}


function drawPlayers(){
    leftPlayer.draw();
    rightPlayer.draw();
    ball.draw();
}

function gameLoop(){
    drawCanvas()
    drawPlayers()
    ball.update()
    rightPlayer.ai()
    updateMovement()
    if(!gameIsRunning) return;
    window.requestAnimationFrame(gameLoop)
}
