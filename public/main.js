var stage = document.getElementById("stage");
var ctx = stage.getContext("2d");
var ctx1 = stage.getContext("2d");

var stage2 = document.getElementById("stage2");
var ctx2 = stage2.getContext("2d");

var stage3 = document.getElementById("stage3");
var ctx3 = stage3.getContext("2d");

document.addEventListener("keydown", keyPush);

var socket = io("http://localhost:80");
ctx.imageSmoothingEnabled = false;
ctx1.imageSmoothingEnabled = false;
ctx2.imageSmoothingEnabled = false;
ctx3.imageSmoothingEnabled = false;
var tq = 64;
var nqx = 13;
var nqy = 11;

var blocos = [];
var fixos = [];
var powerUps = [];
var conectados = [];

var quebrados = new Array()

var gameStart = true;

var frames_ex = 
[['TILES/TILE_47.png','TILES/TILE_55.png','TILES/TILE_63.png','TILES/TILE_71.png','TILES/TILE_79.png',]
,['TILES/TILE_47.png','TILES/TILE_55.png','TILES/TILE_63.png','TILES/TILE_71.png','TILES/TILE_79.png',]
,['TILES/TILE_46.png','TILES/TILE_54.png','TILES/TILE_62.png','TILES/TILE_70.png','TILES/TILE_78.png',]
,['TILES/TILE_46.png','TILES/TILE_54.png','TILES/TILE_62.png','TILES/TILE_70.png','TILES/TILE_78.png',]]

var frames_ex_ed = 
[['TILES/TILE_44.png','TILES/TILE_52.png','TILES/TILE_60.png','TILES/TILE_68.png','TILES/TILE_76.png']
,['TILES/TILE_45.png','TILES/TILE_53.png','TILES/TILE_61.png','TILES/TILE_69.png','TILES/TILE_77.png']
,['TILES/TILE_42.png','TILES/TILE_50.png','TILES/TILE_58.png','TILES/TILE_66.png','TILES/TILE_74.png']
,['TILES/TILE_43.png','TILES/TILE_51.png','TILES/TILE_59.png','TILES/TILE_67.png','TILES/TILE_75.png']]

var frames_player = 
[['bomberman/Bomberman_0.png','bomberman/Bomberman_1.png','bomberman/Bomberman_0.png','bomberman/Bomberman_2.png'],//cima
['bomberman/Bomberman_3.png','bomberman/Bomberman_4.png','bomberman/Bomberman_3.png','bomberman/Bomberman_5.png'],//Direita
['bomberman/Bomberman_6.png','bomberman/Bomberman_7.png','bomberman/Bomberman_6.png','bomberman/Bomberman_8.png'],//baixo
['bomberman/Bomberman_9.png','bomberman/Bomberman_10.png','bomberman/Bomberman_9.png','bomberman/Bomberman_11.png']]//Esquerda

var playerColideup = false;
var playerColideleft = false;
var playerColidedown = false;
var playerColideright = false;

setInterval(colisaoPowerUp, 30);
setInterval(colisaoParedes, 30);
setInterval(update, 30);




//Funçoes de colisao
function colisaoParedes() {
  conectados.forEach((player) => {
    var xCresce = (element) =>
      element.x == player.px + 1 && element.y == player.py;
    var xDiminui = (element) =>
      element.x == player.px - 1 && element.y == player.py;
    var yCresce = (element) =>
      element.x == player.px && element.y == player.py + 1;
    var yDiminui = (element) =>
      element.x == player.px && element.y == player.py - 1;
    if (
      fixos.some(xDiminui) ||
      blocos.some(xDiminui) ||
      conectados.some((element) => element.minhasbombas.some(xDiminui)) ||
      conectados.some(
        (player2) =>
          player2.px == player.px - 1 &&
          player2.py == player.py &&
          player.name != player2.name
      ) ||
      player.px - 1 < 0
    ) {
      player.playerColideleft = true;
    } else {
      player.playerColideleft = false;
    }

    if (
      fixos.some(xCresce) ||
      blocos.some(xCresce) ||
      conectados.some((element) => element.minhasbombas.some(xCresce)) ||
      conectados.some(
        (player2) =>
          player2.px == player.px + 1 &&
          player2.py == player.py &&
          player.name != player2.name
      ) ||
      player.px + 2 > nqx
    ) {
      player.playerColideright = true;
    } else {
      player.playerColideright = false;
    }

    if (
      fixos.some(yDiminui) ||
      blocos.some(yDiminui) ||
      conectados.some((element) => element.minhasbombas.some(yDiminui)) ||
      conectados.some(
        (player2) =>
          player2.px == player.px &&
          player2.py == player.py - 1 &&
          player.name != player2.name
      ) ||
      conectados.some(yDiminui) ||
      player.py - 1 < 0
    ) {
      player.playerColideup = true;
    } else {
      player.playerColideup = false;
    }

    if (
      fixos.some(yCresce) ||
      blocos.some(yCresce) ||
      conectados.some((element) => element.minhasbombas.some(yCresce)) ||
      conectados.some(
        (player2) =>
          player2.px == player.px &&
          player2.py == player.py + 1 &&
          player.name != player2.name
      ) ||
      conectados.some(yCresce) ||
      player.py + 2 > nqy
    ) {
      player.playerColidedown = true;
    } else {
      player.playerColidedown = false;
    }
  });
}

function colisaoPowerUp() {
  conectados.forEach((player) => {
    var power = (element) => element.x == player.px && element.y == player.py;
    if (powerUps.some(power)) {
      var x1 = powerUps[powerUps.findIndex(power)].x;
      var y1 = powerUps[powerUps.findIndex(power)].y;
      var t = powerUps[powerUps.findIndex(power)].type;

      if (x1 == player.px && y1 == player.py) {
        if (t == 1) {
          player.tamanhoBomba++;
        } else if (t == 2) {
          player.quantidadeBombas++;
        } else if (t == 3) {
        }
      }
    }
    ctx2.clearRect(x1 * tq, y1 * tq, tq, tq);
    powerUps[powerUps.findIndex(power)] = {};
  });
}
// FIM Funçoes de colisao


//Funçoes bombasticas

async function colocarBomba(player) {
  if (player.quantidadeBombas > 0 && player.minhasbombas.findIndex(ele => ele.x == player.px && ele.y == player.py) == -1) {
    player.quantidadeBombas--;
    player.minhasbombas.push({
      ani:true,
      raioExplosao: new Array(),
      x: player.px,
      y: player.py,
      tamanho: player.tamanhoBomba,
    });
    var bombaN = player.minhasbombas[player.minhasbombas.length - 1];
    //ctx2.fillRect(bombaN.x * tq, bombaN.y * tq, tq, tq);
    socket.emit("posPlayers", conectados, blocos, powerUps)
    await sleep(3000);
    await explosaoBomba(bombaN, player);
    player.quantidadeBombas++;
  }
}

async function explosaoBomba(bombaN, player) {
  var yCresce = (element) =>
    element.x == bombaN.x && element.y == bombaN.y + i2;
  var yDiminui = (element) =>
    element.x == bombaN.x && element.y == bombaN.y - i2;
  var xCresce = (element) => element.x == bombaN.x + i && element.y == bombaN.y;
  var xDiminui = (element) =>
    element.x == bombaN.x - i && element.y == bombaN.y;
  bombaN.raioExplosao.push({
    dir:1,
    x: bombaN.x,
    y: bombaN.y,
    id:2
  });

  for (i2 = 1; i2 <= bombaN.tamanho; i2++) {
    if (fixos.some(yCresce)) {
      break;
    } else if (blocos.some(yCresce)) {
      bombaN.raioExplosao.push({
        dir:3,
        x: bombaN.x,
        y: bombaN.y + i2,
        id:i2,
        ani:true
      });

      blocos[blocos.findIndex(yCresce)].destroy = true;
      break;
    } else if (powerUps.some(yCresce)) {
      ctx2.clearRect(
        powerUps[powerUps.findIndex(yCresce)].x * tq,
        powerUps[powerUps.findIndex(yCresce)].y * tq,
        tq,
        tq
      );
      powerUps[powerUps.findIndex(yCresce)] = {};
    }

    bombaN.raioExplosao.push({
      dir:3,
      x: bombaN.x,
      y: bombaN.y + i2,
      id:i2,
      ani:true
    });
  }

  for (i2 = 1; i2 <= bombaN.tamanho; i2++) {
    if (fixos.some(yDiminui)) {
      break;
    } else if (blocos.some(yDiminui)) {
      bombaN.raioExplosao.push({
        dir:4,
        x: bombaN.x,
        y: bombaN.y - i2,
        id:i2,
        ani:true
      });
      blocos[blocos.findIndex(yDiminui)].destroy = true;
      break;
    } else if (powerUps.some(yDiminui)) {
      ctx2.clearRect(
        powerUps[powerUps.findIndex(yDiminui)].x * tq,
        powerUps[powerUps.findIndex(yDiminui)].y * tq,
        tq,
        tq
      );
      powerUps[powerUps.findIndex(yDiminui)] = {};
    }

    bombaN.raioExplosao.push({
      dir:4,
      x: bombaN.x,
      y: bombaN.y - i2,
      id:i2,
      ani:true
    });
  }
  for (i = 1; i <= bombaN.tamanho; i++) {
    if (fixos.some(xCresce)) {
      break;
    } else if (blocos.some(xCresce)) {
      bombaN.raioExplosao.push({
        dir:2,
        x: bombaN.x + i,
        y: bombaN.y,
        id:i,
        ani:true
      });
      blocos[blocos.findIndex(xCresce)].destroy = true;
      break;
    } else if (powerUps.some(xCresce)) {
      ctx2.clearRect(
        powerUps[powerUps.findIndex(xCresce)].x * tq,
        powerUps[powerUps.findIndex(xCresce)].y * tq,
        tq,
        tq
      );
      powerUps[powerUps.findIndex(xCresce)] = {};
    }
    bombaN.raioExplosao.push({
      dir:2,
      x: bombaN.x + i,
      y: bombaN.y,
      id:i,
      ani:true
    });
  }
  for (i = 1; i <= bombaN.tamanho; i++) {
    if (fixos.some(xDiminui)) {
      break;
    } else if (blocos.some(xDiminui)) {
      bombaN.raioExplosao.push({
        dir:1,
        x: bombaN.x - i,
        y: bombaN.y,
        id:i,
        ani:true
      });
      blocos[blocos.findIndex(xDiminui)].destroy = true;
      break;
    } else if (powerUps.some(xDiminui)) {
      ctx2.clearRect(
        powerUps[powerUps.findIndex(xDiminui)].x * tq,
        powerUps[powerUps.findIndex(xDiminui)].y * tq,
        tq,
        tq
      );
      powerUps[powerUps.findIndex(xDiminui)] = {};
    }
    bombaN.raioExplosao.push({
      dir:1,
      x: bombaN.x - i,
      y: bombaN.y,
      id:i,
      ani:true
    });
  }

  socket.emit("posPlayers", conectados, blocos, powerUps)
  await sleep(1000);

  bombaN.raioExplosao.forEach((element) => {
    ctx.clearRect(element.x * tq, element.y * tq, tq, tq);
  });

  // ctx2.clearRect(bombaN.x * tq, bombaN.y * tq, tq, tq);

  bombaN.x = bombaN.y = bombaN.tamanho = {};
  bombaN.raioExplosao = new Array();
  socket.emit("posPlayers", conectados, blocos, powerUps)
  //ctx3.clearRect(0, 0, stage3.clientWidth, stage3.clientHeight)
}
// FIM Funçoes bombasticas

//Funçoes auxiliares
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

async function draw(x1, y1, local,l) {
  var ba = l
  if (l == 7) l = 1
  var img = new Image();
  img.src = local;
  img.onload = function () {
    eval(`ctx${l}.drawImage(img, x1 * tq, y1 * tq, tq, tq)`);
  };
  if(ba==7){ 
    await sleep(1000)
    ctx1.clearRect(x1 * tq, y1 * tq, tq, tq)
    ctx2.clearRect(x1 * tq, y1 * tq, tq, tq)
  }
}
async function drawFrame(x1, y1, sl,l,frames) {
  var img2 = new Image();
  img2.onload = function () {
    if(sl == 1001) eval(`ctx${l}.drawImage(img2, x1*tq, y1*tq-tq,tq,tq*2)`)
    else eval(`ctx${l}.drawImage(img2, x1*tq, y1*tq,tq,tq)`);
    }
  for(currentFrame = 0;currentFrame<frames.length;currentFrame++) {
  img2.src = frames[currentFrame];
  await sleep(sl)
  }
  if(sl == 1001) {
    eval(`ctx${l}.clearRect(x1 * tq,y1 *tq, tq, tq)`) 
  }
  eval(`ctx${l}.clearRect(x1 * tq,y1 *tq, tq, tq)`)
}
// FIM Funçoes auxiliares

function keyPush(event) {
  idzada = conectados.find(element => element.id == socket.id)
  if (gameStart) {
    if (idzada != undefined && idzada.vivo) {
      switch (event.keyCode) {
        case 37: //left
          if (!idzada.playerColideleft) {
            ctx3.clearRect(idzada.px * tq, idzada.py * tq-tq, tq, tq*2);
            idzada.dir = 3 
            idzada.px--;
          }
          break;
        case 38: //up
          if (!idzada.playerColideup) {
            ctx3.clearRect(idzada.px * tq, idzada.py * tq-tq, tq, tq*2);
            idzada.dir = 0
            idzada.py--;
          }
          break;
        case 39: //right
          if (!idzada.playerColideright) {
            ctx3.clearRect(idzada.px * tq, idzada.py * tq-tq, tq, tq*2);
            idzada.dir = 1
            idzada.px++;
          }
          break;
        case 40: //down
          if (!idzada.playerColidedown) {
            ctx3.clearRect(idzada.px * tq, idzada.py * tq-tq, tq, tq*2);
            idzada.dir = 2
            idzada.py++;
          }
          break;
        case 88: // colocar bomba
          colocarBomba(idzada);
          break;
      }
      
    }
  }
  socket.emit("posPlayers", conectados, blocos, powerUps)
}

function teste() {
  socket.emit("posPlayers", conectados)
}
var fps = fps2 = fps3 = fps4 = 0
var fps_frame = fps_frame2 = fps_frame3 = fps_frame4 = 24
var gameFrame = gameFrame2 = gameFrame3 = gameFrame4 = 0
var ani11 = ani22 = ani33 = ani44 = true
var frames_ = frames_player
function animate1() {
  ani11 = false
    var p = conectados[0]
    if(fps == fps_frame){
      if(gameFrame<4) {
        var img2 = new Image();
        img2.onload = function() {
          ctx3.clearRect(p.px * tq, p.py * tq - tq, tq, tq * 2);
          ctx3.drawImage(img2, p.px * tq, p.py * tq - tq, tq, tq * 2);
          gameFrame++;
        };
        img2.src = frames_[p.dir][gameFrame]
      }else gameFrame = 0
      fps = 0
  }
  fps++
  requestAnimationFrame(animate1)
}
function animate2() {
  ani22 = false
    var p = conectados[1]
    if(fps2 == fps_frame2){
      if(gameFrame2<4) {
        var img2 = new Image();
        img2.onload = function() {
          ctx3.clearRect(p.px * tq, p.py * tq - tq, tq, tq * 2);
          ctx3.drawImage(img2, p.px * tq, p.py * tq - tq, tq, tq * 2);
          gameFrame2++;
        };
        img2.src = frames_[p.dir][gameFrame2]
      }else gameFrame2 = 0
      fps2 = 0
  }
  fps2++
  requestAnimationFrame(animate2)
}
function animate3() {
  ani33 = false
  var p = conectados[2]
  if(fps3 == fps_frame3){
    if(gameFrame3<4) {
      var img2 = new Image();
      img2.onload = function() {
        ctx3.clearRect(p.px * tq, p.py * tq - tq, tq, tq * 2);
        ctx3.drawImage(img2, p.px * tq, p.py * tq - tq, tq, tq * 2);
        gameFrame3++;
      };
      img2.src = frames_[p.dir][gameFrame3]
    }else gameFrame3 = 0
    fps3 = 0
}
fps3++
requestAnimationFrame(animate3)
}
function animate4() {
  ani44 = false
  var p = conectados[3]
  if(fps4 == fps_frame4){
    if(gameFrame4<4) {
      var img2 = new Image();
      img2.onload = function() {
        ctx3.clearRect(p.px * tq, p.py * tq - tq, tq, tq * 2);
        ctx3.drawImage(img2, p.px * tq, p.py * tq - tq, tq, tq * 2);
        gameFrame++;
      };
      img2.src = frames_[p.dir][gameFrame4]
    }else gameFrame4 = 0
    fps4 = 0
}
fps4++
requestAnimationFrame(animate4)
}
function update() { 
  blocos.forEach(element => {
    if(element.destroy) {
      element.destroy = false
      drawFrame(element.x, element.y, 167,1,['TILES/TILE_28.png','TILES/TILE_29.png','TILES/TILE_30.png','TILES/TILE_31.png','TILES/TILE_32.png','TILES/TILE_33.png',])
      element.x = element.y = -1
    }
  })

  if (conectados.some(player => player.minhasbombas != null || player.minhasbombas != undefined)) {
    conectados.forEach(player => player.minhasbombas.forEach(bomba => {
      if (bomba.ani) {
      drawFrame(bomba.x, bomba.y, 334,3,['TILES/TILE_34.png','TILES/TILE_35.png','TILES/TILE_36.png','TILES/TILE_35.png','TILES/TILE_34.png','TILES/TILE_35.png','TILES/TILE_36.png','TILES/TILE_35.png','TILES/TILE_34.png'])
      bomba.ani = false
      }
    }))
  }
  else {
    ctx3.clearRect(0, 0, stage3.clientWidth, stage3.clientHeight)
  }
  powerUps.forEach((element) => {
    draw(element.x, element.y, "imgsPowerUps/spr_item_"+element.type+".png",2);
});
    conectados.forEach(player => player.minhasbombas.forEach(element => element.raioExplosao.forEach(explo => {
      if(explo.ani){
      //if(explo.id = 1) drawFrame(explo.x,explo.y,200,1,frames_ex_ed[explo.dir-1])
      draw(explo.x,explo.y,frames_ex[explo.dir-1][0],7)
      explo.ani = false
      }
    })))

  if (
    conectados.some((conectado) =>
      conectado.minhasbombas.some((minhabom) =>
        minhabom.raioExplosao.some((element) =>
          conectados.some(
            (player) => element.x == player.px && element.y == player.py
          )
        )
      )
    )
  ) {
    /*alert(conectados.findIndex((player1) =>
      player1.minhasbombas.raioExplosao.some((element) =>
        conectados.some(
        player2 => element.x == player2.px && element.y == player2.py
        )
      )
    ))*/

    var morto = conectados.findIndex((element) =>
      conectados.some((player) =>
        player.minhasbombas.some((bombaN) =>
          bombaN.raioExplosao.some(
            (explodido) =>
              explodido.x == element.px && explodido.y == element.py
          )
        )
      )
    );

    alert("Player " + conectados[morto].name + " morreu");
    //conectados.splice(morto, 1)
    delete conectados[morto];
  }
}



socket.on("generateLevel", (fixos2, blocos2, powerUps2) => {

  fixos = fixos2;
  blocos = blocos2;
  powerUps = powerUps2;

  fixos.forEach((element) => {
    draw(element.x, element.y, "TILES/TILE_2.png",1);
  });

  blocos.forEach((element) => {
    draw(element.x, element.y, "TILES/TILE_1.png",1);
  });

  powerUps.forEach((element) => {
      draw(element.x, element.y, "imgsPowerUps/spr_item_"+element.type+".png",2);
  });
  
});

socket.on("players", players => {
  if(ani11 && players.length >=1) animate1()
  if(ani22 && players.length >=2) animate2()
  if(ani33 && players.length >=3) animate3()
  if(ani44 && players.length >=4) animate4()
  conectados = players
})

socket.on("att", (novos, blocos2, powers2) => {
  conectados = novos
  blocos = blocos2
  powerUps = powers2
  ctx3.clearRect(0, 0, stage3.clientWidth, stage3.clientHeight)
})

socket.on("receberInfos", (brasil) => {
  alert(brasil);
});
