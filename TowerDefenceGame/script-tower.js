const GameHeight = document.getElementById("game").offsetHeight; //lower number
const GameWidth = document.getElementById("game").offsetWidth; //higher number
roadPositionNumber = 0;
let towerIDs = [];// alive towers
let roadTileIDs = []; //object array for road x and y
let enemyIDs = []; // object array for each alive enemy info like id, x, y, health, speed and color
let projectiles = [];// bullets for towers
const enemyTypes = [
    {x:660, y:20, speed:1, color:'red'},
    {x:660, y:20, speed:2, color:'blue'},
    {x:660, y:20, speed:4, color:'green'},
    {x:660, y:20, speed:5, color:'MediumPurple'},
    {x:660, y:20, speed:8, color:'black'},
    {x:660, y:20, speed:10, color:'yellow'},
    {x:660, y:20, speed:16, color:'Magenta'}
];// x, y, speed(higher is slower), color.
const towerTypes = [
    {cost:50, range: 150, cooldown: 0, speed: 75, name: 'Basic Tower', btnID: 'basicTower', color: 'hsl(0, 0%, 25%)'},
    {cost: 150,range: 400, cooldown: 0, speed: 100, name: 'Sniper Tower', btnID: 'sniperTower', color: 'hsl(275, 100%, 25%)'},
    {cost: 500, range: 200, cooldown: 0, speed: 10, name: 'Gatling Tower', btnID: 'gatlingTower', color: 'hsl(200, 100%, 25%)'},
    {cost: 2000, range: 600, cooldown: 0, speed: 5, name: 'Super Tower', btnID: 'superTower', color: 'hsl(57, 100%, 35%)'}
];// price of tower, tower range, speed count up, speed(lower is faster), button name, button id, tower color

let wave = 0;
let direction = "down";
let firstTile;
let turnCount = 0;
let roadContinue = true;
let gold = 150;
let playerLives = 20;
let enemyUniqueID = 0;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Create tower buttons
towerTypes.forEach((tower, i) => {
    const btn = document.createElement('button');
    btn.classList.add('towerButtons');
    btn.id = tower.btnID;
    btn.innerText = tower.name;
    btn.style.top = `${30 * (i + 1)}px`;
    btn.dataset.towerIndex = i;

    btn.addEventListener('click', () => {
        if (gold >= tower.cost && canPlaceTower) {
            canPlaceTower = false;
            gold -= tower.cost;
            towerNum++;
            createTower(i);
            createRangeRing(towerTypes[i].range);
            window.addEventListener('mousemove', moveTower);
        }
    });

    document.getElementById('ui').appendChild(btn);
});

let canPlaceTower = true;

//create road loop
let i = 0;
while(roadContinue){
    if(i > 1){
        if(roadTileIDs[i-1].x <= 0 || roadTileIDs[i-1].x >= GameWidth - 80 || roadTileIDs[i-1].y <= 0 || roadTileIDs[i-1].y >= GameHeight - 80){
            roadContinue = false;
            break;
        }
    }
    createRoad(i);
    i++;
}

function createRoad(tileNumber){
    const turnLimit = 3;
    const roadRanTurn = 4;
    const startRoad = document.createElement('div');
    startRoad.style.position = 'absolute';
    startRoad.style.background = 'grey';
    startRoad.style.width = '78px';
    startRoad.style.height = '78px';
    startRoad.style.border = '2px solid black';

    if (tileNumber == 0){
        startRoad.style.left = 640 + 'px';
        startRoad.style.top = 0 + 'px';
        roadTileIDs.push({id:startRoad, x:640, y:0});
    }else{
        turnCount++;
        roadTileIDs.push({id:startRoad, x:0, y:0});
        switch (direction){
            case 'down':
                let random1 = getRandomInt(1,roadRanTurn);
                if(random1 == 1 && turnLimit <= turnCount){
                    turnCount = 0;
                    direction = 'left';
                }else if(random1 == 2  && turnLimit <= turnCount){
                    turnCount = 0;
                    direction = 'right';
                }
                roadTileIDs[tileNumber].y = roadTileIDs[tileNumber-1].y + 80;
                roadTileIDs[tileNumber].x = (roadTileIDs[tileNumber-1].x);
                startRoad.style.left = (roadTileIDs[tileNumber].x) + 'px';
                startRoad.style.top = (roadTileIDs[tileNumber].y) + 'px';
                break;
            case 'up':
                let random2 = getRandomInt(1,roadRanTurn);
                if(random2 == 1  && turnLimit <= turnCount){
                    turnCount = 0;
                    direction = 'left';               
                }else if(random2 == 2  && turnLimit <= turnCount){
                    turnCount = 0;
                    direction = 'right';                
                }
                roadTileIDs[tileNumber].y = roadTileIDs[tileNumber-1].y - 80;
                roadTileIDs[tileNumber].x = (roadTileIDs[tileNumber-1].x); 
                startRoad.style.left = (roadTileIDs[tileNumber].x) + 'px';
                startRoad.style.top = (roadTileIDs[tileNumber].y) + 'px';
                break;
            case 'left':
                let random3 = getRandomInt(1,roadRanTurn);
                if(random3 == 1  && turnLimit <= turnCount){
                    turnCount = 0;
                    direction = 'up';
                }else if(random3 == 2  && turnLimit <= turnCount){
                    turnCount = 0;
                    direction = 'down';
                }
                roadTileIDs[tileNumber].y = (roadTileIDs[tileNumber-1].y);
                roadTileIDs[tileNumber].x = roadTileIDs[tileNumber-1].x - 80;
                startRoad.style.left = (roadTileIDs[tileNumber].x) + 'px';
                startRoad.style.top = (roadTileIDs[tileNumber].y) + 'px';
                break;
            case 'right':
                let random4 = getRandomInt(1,roadRanTurn);
                if(random4 == 1  && turnLimit <= turnCount){
                    turnCount = 0;
                    direction = 'up';
                }else if(random4 == 2  && turnLimit <= turnCount){
                    turnCount = 0;
                    direction = 'down';
                }
                roadTileIDs[tileNumber].y = (roadTileIDs[tileNumber-1].y);
                roadTileIDs[tileNumber].x = roadTileIDs[tileNumber-1].x + 80;
                startRoad.style.left = (roadTileIDs[tileNumber].x) + 'px';
                startRoad.style.top = (roadTileIDs[tileNumber].y) + 'px';
                break;
        }
    }
    document.getElementById('game').appendChild(startRoad);
    roadPositionNumber++;
}

roadTileIDs[0].id.innerText = 'Start';
roadTileIDs[0].id.style.color = 'black';
//roadTileIDs[0].id.style.background = 'darkblue';
roadTileIDs.at(-1).id.innerText = 'End';
roadTileIDs.at(-1).id.style.color = 'black';
//roadTileIDs.at(-1).id.style.background = 'darkred';

// x, y, health, speed, color
function spawnEnemy(type){
    enemyUniqueID++;
    enemyTypes[type].x
    enemyTypes[type].y
    enemyTypes[type].speed
    enemyTypes[type].color
    const enemy = document.createElement('div');
    enemy.style.position = 'absolute';
    enemy.style.background = enemyTypes[type].color;
    enemy.style.width = '38px';
    enemy.style.height = '38px';
    enemy.style.border = '2px solid black';
    enemy.style.left = enemyTypes[type].x + 'px';
    enemy.style.top = enemyTypes[type].y + 'px';
    enemy.style.borderRadius = "50%";
    enemy.style.boxShadow ='5px 5px 10px 0px rgba(0, 0, 0, 0.3)';
    document.getElementById('game').appendChild(enemy);
    enemyIDs.push({
        id:enemy,
        x:660,
        y:20,
        speed:enemyTypes[type].speed,
        color:enemyTypes[type].color,
        tileNum:1,
        UniqueID: enemyUniqueID
    });
}

function enemyMovement(){
    for(let i = enemyIDs.length - 1; i >= 0; i--){
        let enemySpeed = enemyIDs[i].speed;
        if(parseInt(enemyIDs[i].id.style.left) + 21 < roadTileIDs[enemyIDs[i].tileNum].x + 41){ 
            enemyIDs[i].id.style.left = parseInt(enemyIDs[i].id.style.left) + enemySpeed + "px";
        }
        if(parseInt(enemyIDs[i].id.style.left) + 21 > roadTileIDs[enemyIDs[i].tileNum].x + 41){
            enemyIDs[i].id.style.left = parseInt(enemyIDs[i].id.style.left) - enemySpeed + "px";
        }
        if(parseInt(enemyIDs[i].id.style.top) + 21 < roadTileIDs[enemyIDs[i].tileNum].y + 41){ 
            enemyIDs[i].id.style.top = parseInt(enemyIDs[i].id.style.top) + enemySpeed + "px";
        }
        if(parseInt(enemyIDs[i].id.style.top) + 21 > roadTileIDs[enemyIDs[i].tileNum].y + 41){ 
            enemyIDs[i].id.style.top = parseInt(enemyIDs[i].id.style.top) - enemySpeed + "px";
        }
        enemyIDs[i].x = parseInt(enemyIDs[i].id.style.left);
        enemyIDs[i].y = parseInt(enemyIDs[i].id.style.top);

        if(collisionCheckBool(roadTileIDs[enemyIDs[i].tileNum].x+36,
            roadTileIDs[enemyIDs[i].tileNum].y+36,
            5,5,
            enemyIDs[i].x+16,
            enemyIDs[i].y+16,
            5,5))
        {
                enemyIDs[i].tileNum++;
                if(roadTileIDs.length === enemyIDs[i].tileNum){//end of road
                    enemyIDs[i].tileNum--;
                    enemyIDs[i].id.remove();
                    enemyIDs.splice(i,1);
                    playerLives--;  
                }
        }
    }
}

let waveCount = (2*wave)+10;
let waveStartBool = false;

document.getElementById("startWave").onclick = function() {
    waveCount++;
    wave++;
    waveStartBool = true;
};
let WaveSpeedCnt = 0;
let waveSpeed = 60;

function waveStarting(){
    if(waveStartBool){
        WaveSpeedCnt++;
        if(waveCount*wave > 0){
            if(WaveSpeedCnt >= Math.ceil(waveSpeed - wave*3)){// how fast enemies spawn
                waveCount--;
                if(enemyTypes.length-1 > Math.ceil((wave-1)/4)){
                    spawnEnemy(Math.ceil((wave-1)/4));// enemy difficultly per wave
                }else{
                    spawnEnemy(enemyTypes.length-1);// spawn hardest enemy
                }
                WaveSpeedCnt = 0;
            } 
        }else{
            waveCount = (2*wave)+10;
            waveStartBool = false;//when done
            }   
    }
}
let towerNum = -1;
function createTower(type) {
    const tower = document.createElement('div')
    //tower.classList.add('standardTower');
    //tower.style.cursor = 'pointer';
    tower.style.width = '38px';
    tower.style.height = '38px';
    tower.style.background = towerTypes[type].color;
    tower.style.border = '2px solid black';
    tower.style.position = 'absolute';
    tower.style.zIndex = 1;
    tower.style.top = '720px';
    tower.style.left = '0px';
    tower.style.boxShadow ='5px 5px 10px 0px rgba(0, 0, 0, 0.3)';
    document.getElementById('game').appendChild(tower);
    towerIDs.push({id:tower, x:0, y:0, range: towerTypes[type].range, cooldown: 0, speed: towerTypes[type].speed, BeingPlaced: true})
    towerIDs[towerNum].id.addEventListener('click', placeTower);
}

function collisionCheckBool(playerX, playerY, playerW, playerH, enemyX, enemyY, enemyW, enemyH){
    return(
        playerX < enemyX + enemyW &&
        playerX + playerW > enemyX &&
        playerY < enemyY + enemyH &&
        playerY + playerH > enemyY
    );
}

function circleCollisionBool(player, enemy) {
  const deltaX = towerIDs[player].x - enemyIDs[enemy].x;
  const deltaY = towerIDs[player].y - enemyIDs[enemy].y;
  const distanceSquared = deltaX * deltaX + deltaY * deltaY;
  const radiusSum = towerIDs[player].range + 21;// player radius + enemy radius

  return distanceSquared < (radiusSum * radiusSum);
}

function placeTower() {
    let noCollision = true;
    //check if your in game window
    if (collisionCheckBool(parseInt(towerIDs[towerNum].id.style.left), parseInt(towerIDs[towerNum].id.style.top), 40, 40, 40, 40, GameWidth-80, GameHeight-80)){
        //check all tiles and tower collision one tile at a time 
        for(let i = 0; i <= roadTileIDs.length-1; i++){
            if (collisionCheckBool(parseInt(towerIDs[towerNum].id.style.left), parseInt(towerIDs[towerNum].id.style.top), 40, 40, roadTileIDs[i].x, roadTileIDs[i].y, 80, 80)){
                noCollision = false;
                break;
            }
        }
    }else{//cant place tower
        noCollision = false;
    }
    for(let i = 0; i <= towerIDs.length-1; i++){
        if(i>=0){
            if(collisionCheckBool(parseInt(towerIDs[towerNum].id.style.left), parseInt(towerIDs[towerNum].id.style.top), 40, 40, towerIDs[i].x, towerIDs[i].y, 40, 40)){
                noCollision = false;//cant place tower
                break;
            }
        }
    }
    if(noCollision){
        if(towerIDs[towerNum].BeingPlaced){
            canPlaceTower = true;
            window.removeEventListener('mousemove', moveTower);
            towerIDs[towerNum].BeingPlaced = false;
            towerIDs[towerNum].x = parseInt(towerIDs[towerNum].id.style.left);
            towerIDs[towerNum].y = parseInt(towerIDs[towerNum].id.style.top);
        if (rangeRing) {
            rangeRing.remove();
            rangeRing = null;
        }
        const thisTowerIndex = towerNum;
        towerIDs[thisTowerIndex].id.addEventListener('mouseenter', () => {
            showTowerRange(thisTowerIndex);
        });
        towerIDs[thisTowerIndex].id.addEventListener('mouseleave', hideTowerRange);
        }
    }
}

function towerAttack(){
    //search for fastest ballon to slowest in order if which spawned first
    //check collision for the ballon and work backwords
    for(let i = 0; i <= towerIDs.length-1; i++){
        towerIDs[i].cooldown--;
        if(towerIDs[i].cooldown <= 0){
            for(let j = 0; j <= enemyIDs.length-1; j++){
                if(circleCollisionBool(i,j)){
                    createProjectile(towerIDs[i].x + 17, towerIDs[i].y + 17, enemyIDs[j].x + 17, enemyIDs[j].y + 17, enemyIDs[j].UniqueID);
                    towerIDs[i].cooldown = towerIDs[i].speed;
                    break;
                }
            }
        } 
    }
}

function enemyDowngrade(enemyID){
    const index = enemyIDs.findIndex(enemyIDs => enemyIDs.UniqueID === enemyID);
    if (index !== -1) {
        // splice(startIndex, deleteCount)
        // if true then death
        if(enemyIDs[index].color === enemyTypes[0].color){
            enemyIDs[index].id.remove();
            enemyIDs.splice(index,1);
            gold += 10;
        }else{// downgrade enemy
            for(let i = 1; i <= enemyTypes.length-1; i++){
                if(enemyIDs[index].color === enemyTypes[i].color){
                    enemyIDs[index].id.style.background = enemyTypes[i-1].color
                    enemyIDs[index].color = enemyTypes[i-1].color
                    enemyIDs[index].speed = enemyTypes[i-1].speed
                    return;
                }
            }
        }
    }
}

function updateUI(){
    if(playerLives > 0){
        document.getElementById('livesDiv').innerText = 'Lives: ' + playerLives;
        document.getElementById('goldDiv').innerText = 'Gold: ' + gold;
        document.getElementById('waveDiv').innerText = 'wave: ' + wave;
    }else{
        document.getElementById('livesDiv').innerText = 'GAME OVER!';
        document.getElementById('goldDiv').innerText = 'Gold: ' + gold;
        document.getElementById('waveDiv').innerText = 'wave: ' + wave;
    }
}
//activate when enemy dies but have in game animation loop
function createProjectile(towerX, towerY, enemyX, enemyY, enemyID){
    const Projectile = document.createElement('div');
    Projectile.style.width = '7px';
    Projectile.style.height = '7px';
    Projectile.style.background = 'white';
    Projectile.style.border = '1px solid black';
    Projectile.style.position = 'absolute';
    Projectile.style.zIndex = 2;
    Projectile.style.top = towerY + 'px';
    Projectile.style.left = towerX + 'px';
    Projectile.style.borderRadius = "50%";
    Projectile.style.boxShadow ='5px 5px 10px 0px rgba(0, 0, 0, 0.3)';
    document.getElementById('game').appendChild(Projectile);
    let distanceX = enemyX - towerX;
    let distanceY = enemyY - towerY;
    let projectileSpeed = 5; //higher number is slower
    projectiles.push({id: Projectile, x: towerX, y: towerY, targetX: enemyX, targetY: enemyY, speed: projectileSpeed, speedCnt: projectileSpeed, distanceX: distanceX, distanceY: distanceY, enemyID: enemyID});
}

function fireProjectile(){
    for(let i = 0; i <= projectiles.length-1; i++){
        projectiles[i].id.style.left = parseInt(projectiles[i].id.style.left) + projectiles[i].distanceX/projectiles[i].speed + 'px';
        projectiles[i].id.style.top = parseInt(projectiles[i].id.style.top) + projectiles[i].distanceY/projectiles[i].speed + 'px';

        projectiles[i].speedCnt--;
        //hit enemy
       if (projectiles[i].speedCnt <= 0){
            enemyDowngrade(projectiles[i].enemyID);
            projectiles[i].id.remove();
            projectiles.splice(i,1);
        }
    }
}

function buttonUI() {
    // Start Wave button
    const startWaveBtn = document.getElementById('startWave');
    startWaveBtn.disabled = enemyIDs.length > 0 || waveStartBool || playerLives <= 0;

    // Tower buttons
    towerTypes.forEach((tower, i) => {
        const btn = document.getElementById(tower.btnID);
        if (!btn) return;
        btn.disabled = gold < tower.cost || !canPlaceTower;
    });
}

let rangeRing = null;

function createRangeRing(range) {
    // Remove old ring if it exists
    if (rangeRing) {
        rangeRing.remove();
    }

    rangeRing = document.createElement('div');
    rangeRing.style.left = '0px';
    rangeRing.style.top = '720px';
    rangeRing.style.position = 'absolute';
    rangeRing.style.border = '2px solid rgba(255, 255, 255, 0.6)';
    rangeRing.style.borderRadius = '50%';
    rangeRing.style.pointerEvents = 'none';
    rangeRing.style.zIndex = '2';
    rangeRing.style.background = 'rgba(255, 255, 255, 0.08)';

    const diameter = range * 2;
    rangeRing.style.width = diameter + 'px';
    rangeRing.style.height = diameter + 'px';

    document.getElementById('game').appendChild(rangeRing);
}

function moveTower(e) {
    const gameRect = document.getElementById("game").getBoundingClientRect();
    const x = e.clientX - gameRect.left - 20;
    const y = e.clientY - gameRect.top - 20;

    // Move the tower
    towerIDs[towerNum].id.style.left = x + 'px';
    towerIDs[towerNum].id.style.top = y + 'px';

    // Move the range ring (centered on the tower)
    if (rangeRing) {
        const range = towerIDs[towerNum].range;
        rangeRing.style.left = (x + 19 - range) + 'px';
        rangeRing.style.top  = (y + 19 - range) + 'px';
    }
}

function showTowerRange(towerIndex) {
    // Don't show while placing a new tower
    if (!canPlaceTower) return;

    const tower = towerIDs[towerIndex];
    createRangeRing(tower.range);

    // Center the ring on the tower
    rangeRing.style.left = (tower.x + 19 - tower.range) + 'px';
    rangeRing.style.top  = (tower.y + 19 - tower.range) + 'px';
}

function hideTowerRange() {
    // Only hide if we're not currently placing a tower
    if (canPlaceTower && rangeRing) {
        rangeRing.remove();
        rangeRing = null;
    }
}

const GameAnimation = setInterval(() =>{
    waveStarting();
    enemyMovement();
    towerAttack();
    updateUI();
    buttonUI();
    fireProjectile();
},1000/60);