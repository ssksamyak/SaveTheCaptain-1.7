var cap, capRunImg;
var ground, invisibleGround, groundImg;
var backgr, backgroundImg;

//obstacles
var spikes, spikesImg, spikesGroup;
var fireBall, fireBallImg, fireBallGroup;

var roller, rollerImg, rollerGroup;

var hitSound;
var collectSound;
var fireSound;
var jumpsound;
//coins
var silverCoins, silverCoinsImg, silverCoinsGroup, goldCoins, goldCoinsImg, goldCoinsGroup;
var touches = [];

//game states
var PLAY = 1;
var END  = 0;
var gameState = PLAY;
var score = 0;
var coinsCollected = 0;


var gameOver, gameOverImg;
var restart, restartImg;

function preload(){
    backgroundImg = loadImage("sprites/bg3.png");
    groundImg = loadImage("sprites/ground.png")

    capIdle = loadAnimation("sprites/idle-0.png");
    capRun = loadAnimation("sprites/run-0.png","sprites/run-1.png","sprites/run-3.png","sprites/run-4.png","sprites/run-5.png","sprites/run-6.png","sprites/run-7.png");
    capJump = loadAnimation("sprites/jump.png")

    fireBallImg = loadAnimation("sprites/fireBall1.png","sprites/fireBall2.png","sprites/fireBall3.png","sprites/fireBall4.png","sprites/fireBall5.png","sprites/fireBall6.png","sprites/fireBall7.png","sprites/fireBall8.png","sprites/fireBall9.png","sprites/fireBall10.png");
    spikesImg = loadImage("sprites/spikes.png");

    rollerImg = loadAnimation("sprites/roller1.png","sprites/roller2.png","sprites/roller3.png","sprites/roller4.png","sprites/roller5.png","sprites/roller6.png","sprites/roller7.png","sprites/roller8.png","sprites/roller9.png","sprites/roller10.png")

    goldCoinsImg = loadAnimation("sprites/goldCoin1.png","sprites/goldCoin2.png","sprites/goldCoin3.png","sprites/goldCoin4.png","sprites/goldCoin5.png","sprites/goldCoin6.png","sprites/goldCoin7.png","sprites/goldCoin8.png","sprites/goldCoin9.png","sprites/goldCoin10.png")
    silverCoinsImg = loadAnimation("sprites/silverCoin1.png","sprites/silverCoin2.png","sprites/silverCoin3.png","sprites/silverCoin4.png","sprites/silverCoin5.png","sprites/silverCoin6.png","sprites/silverCoin7.png","sprites/silverCoin8.png","sprites/silverCoin9.png","sprites/silverCoin10.png")
  
    hitSound = loadSound("sounds/hit.mp3");
    collectSound = loadSound("sounds/collectSound.mp3");
    fireSound = loadSound("sounds/fireSound.mp3");
    jumpSound = loadSound("sounds/jump.mp3");

    gameOverImg = loadImage("sprites/gameOver.png");
    restartImg = loadImage("sprites/restart.png");
  }

function setup(){
    var canvas = createCanvas(windowWidth,windowHeight);

    //create background
    backgr = createSprite(windowWidth/2 + 200, windowHeight/2 - 40, windowWidth, windowHeight);
    backgr.addImage(backgroundImg);
    backgr.x = backgr.width/2;
    
    //create ground
    ground = createSprite(0, windowHeight, windowWidth, 10);
    ground.visible = true;
    ground.addImage(groundImg);
    ground.x = ground.width/2;
    ground.velocityX = -(2 + 2*score/100);

    invisibleGround = createSprite(0, windowHeight, windowWidth, 10);
    invisibleGround.visible = false;
    invisibleGround.x = ground.width/2;
    invisibleGround.velocityX = -(2 + 2*score/100);

    //create player
    cap = createSprite(windowWidth/windowWidth + 60,ground.y - 150);
    cap.scale = 2.5;
    cap.addAnimation("running",capRun);
    cap.addAnimation("idle", capIdle);
    cap.addAnimation("hop",capJump);

    gameOver = createSprite(windowWidth/2,windowHeight/2- 50);
    gameOver.addImage(gameOverImg);
    
    restart = createSprite(windowWidth/2,windowHeight/2);
    restart.addImage(restartImg);
    
    gameOver.scale = 0.5;
    restart.scale = 0.1;
  
    gameOver.visible = false;
    restart.visible = false;

    spikesGroup = new Group();
    fireBallGroup = new Group();

    silverCoinsGroup = new Group();
    goldCoinsGroup = new Group();

    rollerGroup = new Group();
}

function draw(){
    background("white");

  if(gameState === PLAY){
    if(ground.x < windowWidth/2){
      ground.x = ground.width/2;
    }
    cap.x = windowWidth/windowWidth + 60;
    ground.velocityX = -(2 + 2*score/100);

   if(cap.isTouching(ground)){
     cap.changeAnimation("running",capRun);
   }

    //score system
    score = score + Math.round(getFrameRate()/60);

    // console.log(windowWidth);
    console.log(cap.y);
    console.log(ground.y-120);

      spikeObstacles();
      rollerSpike();
      fireBallObstacle();
      silverCoin();
      goldCoin();
      jump();

    if(silverCoinsGroup.isTouching(cap)){
      coinsCollected = coinsCollected + 1;
      collectSound.play();
      silverCoinsGroup.destroyEach();
      }

    if(goldCoinsGroup.isTouching(cap)){
      coinsCollected = coinsCollected + 2;
      collectSound.play();
      goldCoinsGroup.destroyEach();
     }

    if(spikesGroup.isTouching(cap)){
     gameState = END;
     hitSound.play();
   }
    if(fireBallGroup.isTouching(cap)){
      gameState = END;
    }

    if(rollerGroup.isTouching(cap)){
      gameState = END;
    }
  } 

  else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    cap.velocityY = 0;
    backgr.velocityX = 0;
    cap.changeAnimation("idle",capIdle);

    spikesGroup.setVelocityXEach(0);
    fireBallGroup.setVelocityXEach(0);
    silverCoinsGroup.setVelocityXEach(0);
    goldCoinsGroup.setVelocityXEach(0)
    rollerGroup.setVelocityXEach(0);

    // if(touches.length>0 || keyDown("SPACE")) {      
    //   reset();
    //   touches = [];
    // }

    if(mousePressedOver(restart) || keyDown("SPACE")){
      reset();
    }
  }
    // collide captain with ground
    cap.collide(ground);
    cap.collide(invisibleGround);

    drawSprites();
    
    stroke(62, 230, 255);
    strokeWeight(1.5);
    fill(18, 207, 236);
    textSize(20);
    textFont("Courier")
    text("Score: " + score, windowWidth - 250, windowHeight/8 - 20);

    //coins collected text
    stroke(255, 252, 78);
    strokeWeight(2);
    fill(255, 213, 2);
    text("Coins Collected: " + coinsCollected, windowWidth - 250, windowHeight/8);
}


//press space to jump
function jump(){
  if((touches.length > 0 || keyDown("SPACE")) && cap.y  >= ground.y - 150) {
    jumpSound.play()
    cap.velocityY = -15;
    touches = [];
    cap.changeAnimation("hop",capJump);
  }

  //add gravity to the captain
  cap.velocityY = cap.velocityY + 0.66;
}

//spawn spikes 
function spikeObstacles(){
    if(frameCount % 170 === 0){
    spikes = createSprite(windowWidth, ground.y - 95, 20, 20);
    spikes.addImage(spikesImg);
    spikes.scale = 0.15;
    spikes.velocityX = -(5.2 + 2*score/100);
    spikes.lifetime = 500;
    spikesGroup.add(spikes);
  }
}

function rollerSpike(){
  if(frameCount % 240 == 0){
    roller = createSprite(windowWidth,ground.y - 125, 20, 20);
    roller.addAnimation("rolling_Spike",rollerImg);
    roller.scale = 0.15;
    roller.velocityX = -(5.2 + 2*score/100);
    roller.lifetime = 500;
    rollerGroup.add(roller);

    if(spikesGroup.x > windowWidth/4){
      roller.velocityX = 0;
    }
  }
}
function fireBallObstacle(){
  if(frameCount % 210 === 0 && score > 100){
    fireBall = createSprite(windowWidth, random(ground.y - 155, ground.y - 170), 20, 20);
    fireBall.addAnimation("fire",fireBallImg);
    fireSound.play();
    fireBall.scale = 1.2;
    fireBall.velocityX = -(15 + 2 * score/100);
    fireBall.lifetime = 520;
    fireBallGroup.add(fireBall);

    if(spikesGroup.x > windowWidth/4){
      fireBall.velocityX = 0;
    }
  }
}

function silverCoin(){
  if(frameCount % 157 === 0){
    silverCoins = createSprite(windowWidth, random(ground.y - 150, ground.y - 200), 20, 20);
    silverCoins.addAnimation("sCoin",silverCoinsImg);
    silverCoins.scale = 0.1;
    silverCoins.velocityX = -(6 + 2*score/100);
    silverCoins.lifetime = 520;
    silverCoinsGroup.add(silverCoins);
  }
}

function goldCoin(){
  if(frameCount % 240 === 0 && score > 150){
    goldCoins = createSprite(windowWidth, random(ground.y - 150, ground.y - 200), 20, 20);
    goldCoins.addAnimation("gCoin",goldCoinsImg);
    goldCoins.scale = 0.1;
    goldCoins.velocityX = -(6 + 2*score/100);
    goldCoins.lifetime = 520;
    goldCoinsGroup.add(goldCoins);

    if(spikesGroup.x > windowWidth/4){
      goldCoins.velocityX = 0;
    }
  }
}

function reset(){
  gameState = PLAY;

  score = 0;
  coinsCollected = 0;

  gameOver.visible = false;
  restart.visible = false;
  
  spikesGroup.destroyEach();
  spikesGroup.destroyEach();
  fireBallGroup.destroyEach();
  silverCoinsGroup.destroyEach();
  goldCoinsGroup.destroyEach();
  rollerGroup.destroyEach();
  
  cap.changeAnimation("running", capRunImg);
}
