
var c = document.querySelector(`canvas`)
var ctx = c.getContext(`2d`)
var fps = 1000/60
var timer = setInterval(main, fps)

function main()
{
    ctx.clearRect(0,0,c.width,c.height); 
    state()
}

//setup
var state;
var button = new GameObject();
var loseButton = new GameObject();
var avatar = new GameObject();
var ground = new GameObject();
var platform = new GameObject();
var wall = new GameObject();
var wallTwo = new GameObject();
var level = new GameObject();
var tower = new GameObject();
var numberOfEnemies = 20;
var activeEnemies = [];
var activatedEnemies = 0;
var enemies = [];

//Character image
var gruddenImage = document.getElementById("gruddenAxesword");
var startButton = document.getElementById("startButtonImg")
var towerImage1 = document.getElementById("towerImg");
var enemyImage = document.getElementById("batImg");


var numberOfAxe = 1000;
var axeThrow = [];
var currentAxeIndex = 0;

// Pre-create axe objects
for (var i = 0; i < numberOfAxe; i++) {
    axeThrow[i] = new GameObject();
}
    
    document.addEventListener('click', () => {
        // Get the next axe from the pool
        const axe = axeThrow[currentAxeIndex];
        axe.x = avatar.x;
        axe.y = avatar.y;
        axe.vx = 10; // Example velocity
        currentAxeIndex = (currentAxeIndex + 1) % numberOfAxe; // Cycle through the pool
    });

//Making the weapon work
/*var axeThrow = []
var numberOfAxe = 0
for(var i=0; i<numberOfAxe; i++){
    axeThrow[i] = new GameObject();

}
*/


function init()
{
    state = menu

    avatar.color = `pink`;

    level.x = 0; 
    level.y = 0;

    ground.color = `darkgreen`;
    ground.w = 1000000;
    ground.h = 200;
    ground.y = 450;
    ground.world = level

    platform.w = 200;
    platform.y = 100;
    platform.h = 35;
    platform.color = `tan`
    platform.world = level

    wall.h = 120;
    wall.w = 34;
    wall.color = `purple`
    wall.x = 600;
    wall.y = 5;
    wall.world = level

    wallTwo.h = 500;
    wallTwo.w = 50;
    wallTwo.color = `purple`
    wallTwo.x = -100;
    wallTwo.world = level

    tower.h = 200;
    tower.w = 120;
    tower.x = 2000;
    tower.y = 250;
    tower.color = `red`;
    tower.world = level
}
init();

for(var i = 0; i<numberOfEnemies;i++){
    enemies[i] = new GameObject();
    enemies[i].x = tower.x;
    enemies[i].y = tower.y;
    enemies[i].color = "purple";
    enemies[i].vx = -5;
}

/*---------------Game Screens (states)----------------*/
function menu()
{
    if(clicked(button))
    {
        spawnEnemy();
        //avatar.x--;
        //avatar.y--;
        //enemies[i].x = tower.x;
        //enemies[i].y = tower.y;
        state = game;
    }

    button.renderImage(startButton);
}

function win()
{

}
function lose()
{
    if(clicked(loseButton)){
        resetGame();
        state = menu;
    }

    loseButton.x = 300;
    loseButton.y = 300;
    loseButton.renderLoseButton();

    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("You Lose! Click the button to restart.", 150, 150);
}


function resetGame(){
    // Reset avatar position and velocity
    avatar.x = 100;
    avatar.y = 100;
    avatar.vx *= .75;
    avatar.vy += .80;

    // Reset level position
    level.x = 0;
    level.y = 0;

    // Reset enemies
    activeEnemies = [];
    activatedEnemies = 0;
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].x = tower.x;
        enemies[i].y = tower.y;
        enemies[i].vx = -5; // Reset enemy speed if applicable
    }
}

function game()
{
    if(sp == true && avatar.canJump == true)
    {
        avatar.canJump = false;
        avatar.vy = -25;
    }

    if(a == true)
    {
        avatar.vx += -1;
    }
    if(d == true)
    {
        avatar.vx += 1;
    }

    avatar.vx *= .75;
    avatar.vy += .80;
    avatar.move();
    
    function resetGame(){
        avatar.x--;
        avatar.y--;
        activeEnemies.x = tower.x;
        activeEnemies.y = tower.y;
    }

    //used to move the level. 
    var offset = {x:avatar.vx, y:avatar.vy}

    
    while(ground.isOverPoint(avatar.bottom()))
    {
        avatar.vy = 0;
        avatar.y--;
        offset.y--;
        avatar.canJump = true;
    }
    while(platform.isOverPoint(avatar.bottom()) && avatar.vy >= 0)
    {
        avatar.vy = 0;
        avatar.y--;
        offset.y--;
        avatar.canJump = true;
    }
    while(wall.isOverPoint(avatar.right()) && avatar.vx >= 0)
    {
        avatar.vx = 0;
        avatar.x--;
        offset.x--;
    }
    while(wallTwo.isOverPoint(avatar.left()) && avatar.vx <= 0)
    {
        avatar.vx = 0;
        avatar.x++;
        offset.x++;
    }

    /*-------Level movement threshold----*/
    if(avatar.x > 500 || avatar.x < 300)
    {
        //Level movement code
        level.x -= offset.x;
        avatar.x -= offset.x;
        level.y -= offset.y;
        avatar.y -= offset.y;
    }

   
        var dx = c.width/2 - avatar.x
        var dy = c.height/2 - avatar.y
        
        level.x += dx*.05; 
        avatar.x += dx*.05; 
        level.y += dy*.15; 
        avatar.y += dy*.15; 
    //----------------------------*/
    

    //Weapon
    /*var numberOfAxe = 1000
    var axeThrow = [];

    for(var i=0; i<numberOfAxe; i++){
        axeThrow[i] = new GameObject();
        axeThrow[i].x = avatar.x;
        axeThrow[i].y = avatar.y;
        axeThrow[i].color = `red`;
        axeThrow[i].vx = 10;
    }

    if(clicked){
        axeThrow();
    }
*/

    ground.render();
    platform.render();
    wall.render();
    //avatar.render();
    avatar.renderImage(gruddenImage);
    wallTwo.render();
    tower.render();
    
    //tower.renderImage(towerImage1);
    

    for (var i = 0; i < activeEnemies.length; i++) {


        while (ground.isOverPoint(enemies[i].bottom()) && activeEnemies[i].vy >= 0) {
            activeEnemies[i].vy = 0;
            activeEnemies[i].y--;
            
            activeEnemies[i].canJump = true;
        }

        if(activeEnemies[i].x < -2000){
            activeEnemies[i].x = tower.x;
            activeEnemies[i].y = tower.y;
        }
        activeEnemies[i].move();
        activeEnemies[i].renderImage(enemyImage);

        if(activeEnemies[i].isOverPoint(avatar)){
            state = lose
        }

    }
}

function spawnEnemy(){
    if(activeEnemies.length < numberOfEnemies){
        
        activeEnemies[activatedEnemies] = enemies[activatedEnemies];
        activeEnemies[activatedEnemies].world = level;
        activatedEnemies++
        setTimeout(spawnEnemy, 3000);
    }

    
   
}


