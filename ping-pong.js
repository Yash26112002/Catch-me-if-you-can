"use strict";
// Select the canvas
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

// Draw rectangle funtion
function drawRect(x,y,w,h,color){
    context.fillStyle = color
    context.fillRect(x,y,w,h)
}

// computer paddle
const com = {
    x: canvas.width/2 - 50/2,
    y: 5,
    width: 50,
    height: 10,
    color: "blue",
    score:0
};


// User Paddle
const user = {
    x: canvas.width/2 - 50/2,
    y: canvas.height - 10 - 5,
    width: 50,
    height: 10,
    color: "red",
    score:0
}


// Center line
function centerLine(){
    context.beginPath()
    context.setLineDash([10])
    context.moveTo(0,canvas.height/2)
    context.lineTo(canvas.width,canvas.height/2)
    context.strokeStyle = "white"
    context.stroke()
}


// Draw a Circle
function drawCircle(x,y,r,color){
    context.fillStyle = color
    context.beginPath()
    context.arc(x,y,r,0,Math.PI*2,false)
    context.closePath()
    context.fill()
}

// Create a ball
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    r: 10,
    speed:1,
    vx : 5,
    vy : 5,
    color: "white"
}


// scores
function drawText(text,x,y,color){
    context.fillStyle = color
    context.font = "32px josefin sans"
    context.fillText(text,x,y)
}

// gameover
function gameover(){
  clearInterval(move);
  canvas.style.display="none";
  let game=document.getElementById('game');
  game.style.display="none";
  let result=document.getElementById('resultbox');
  result.style.display="initial";
  let winner=document.getElementById('winner');
  winner.innerHTML+="<br>";
  winner.innerText+=user.score>com.score?"USER":"COMPUTER";
  return;
}

// render the Game
function render(){

    // Make canvas
    drawRect(0,0,400,600,"black");

    // computer paddle
    drawRect(com.x,com.y,com.width,com.height,com.color)
    // user paddle
    drawRect(user.x,user.y,user.width,user.height,user.color)

    // Center line
    centerLine();

    //create a ball
    drawCircle(ball.x,ball.y,ball.r,ball.color)

    // scores of com and user
    drawText(com.score,20,canvas.height/2 - 30)
    drawText(user.score,20,canvas.height/2  + 30 +20) //20 for height of letter 0
}
//movement
function update(){
  ball.x += ball.vx*ball.speed;
  ball.y += ball.vy*ball.speed;

  //computer movement
  com.x+=(ball.x-(com.x+com.width/2));

  // computer lose
  if(ball.speed>2){
    com.x+=100;
  }

  // points
  if(ball.y+ball.r<0){
    user.score++;
    reset();
  }
  else if(ball.y-ball.r>canvas.height){
    com.score++;
    reset();
  }

  //collision on sidewalls
  if(ball.x-ball.r>=canvas.width||ball.x-ball.r<=0){
    ball.vx*=(-1);
  }
  let player=ball.y>canvas.width/2?user:com;
  if(collision(ball,player)){
    ball.vy*=(-1);
    ball.speed+=0.1;
  }
  if(user.score==5||com.score==5){
    gameover();
  }

}

function reset(){
  ball.x=canvas.height/2;
  ball.y=canvas.width/2;
  ball.speed=1;
  ball.vy*=(-1);
}

//start Game
function start(){
  render();
  update();
}
var move=setInterval(start,1000/50);

//movement of paddles
canvas.addEventListener('mousemove',movepaddle);
function movepaddle(event){
  var rect=canvas.getBoundingClientRect();
  user.x=event.clientX-rect.left-user.width/2;
}

//collision
function collision(b,p){//ball->b player->p
  b.top=b.y-b.r;
  b.bottom=b.y+b.r;
  b.left=b.x-b.r;
  b.right=b.x+b.r;

  p.top=p.y;
  p.bottom=p.y+p.height;
  p.left=p.x;
  p.right=p.x+p.width;

  return p.right>b.left && p.left<b.right && b.bottom>p.top && b.top<p.bottom;
}
