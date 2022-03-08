//var nombre = prompt("¿Cúal es tu nombre?");

var hnombre = document.getElementById('player');
/// hnombre.innerText = nombre;

var fondojuego,nave, balas,tiempo=0;
var tiempoEntreBalas = 400;
var malos, timer, score, txtScore, vidas, txtVidas;
var GameOver;
var Juego={
	preload: function () {
		juego.load.image('nave','img/nave2.png');
		juego.load.image('laser','img/laser.png');
		juego.load.image('malo','img/malo.png');
		juego.load.image('bg','img/bg.png');
		juego.load.image('enemy','img/alien.png');
	},

	create: function(){

		fondojuego = juego.add.tileSprite(0,0,400,540,'bg');
		juego.physics.startSystem(Phaser.Physics.ARCADE);
		nave =juego.add.sprite(juego.width/2, 485,'nave');
		juego.physics.arcade.enable(nave, true);
		nave.anchor.setTo(0.5);

		balas = juego.add.group();
        balas.enableBody=true;
        balas.physicsBodyType=Phaser.Physics.ARCADE;
        balas.createMultiple(20,'laser');
        balas.setAll('anchor.x',0.5);
        balas.setAll('anchor.y',1);
        balas.setAll('outOfBoundsKill',true);
        balas.setAll('checkWorldBounds',true);

		malos = juego.add.group();
        malos.enableBody=true;
        malos.setBodyType=Phaser.Physics.ARCADE;
        malos.createMultiple(50,'enemy');
        malos.setAll('anchor.x',0.5);
        malos.setAll('anchor.y',0.5);
        malos.setAll('outOfBoundsKill',true);
        malos.setAll('checkWorldBounds',true);

		timer = juego.time.events.loop(2000,this.fnCreateEnemy,this);

		score = 0;
		juego.add.text(20,20, "Score: ",{font: "14px Console",fill: "#adff2f"});
		txtScore = juego.add.text(80,20, "0",{font: "14px Console",fill: "#adff2f"});

		//el contador de vidas
		vidas = 3;
		juego.add.text(290,20, "Lifes: ",{font: "14px Console",fill: "#adff2f"});
		txtVidas = juego.add.text(330,20, "❤️❤️❤️",{font: "14px Console",fill: "#adff2f"});

		juego.add.text(150,520, "Examen Final",{font: "18px Console",fill: "#adff2f"});

		juego.physics.startSystem(Phaser.Physics.ARCADE);
        juego.physics.arcade.enable(nave);
        nave.body.collideWorldBounds=true;

	},
	update: function(){
		fondojuego.tilePosition.y+=4;
		nave.rotation = juego.physics.arcade.angleToPointer(nave)+Math.PI/2;

		if(juego.input.activePointer.isDown){
			this.fnDisparar();
		}

		juego.physics.arcade.overlap(balas, malos, this.fnCollision, null, this);

		malos.forEachAlive(function(e){
			if(e.position.y> 520 && e.position.y< 521)
			{
				vidas-=1;
				if(vidas == 3)
					txtVidas.text = "❤️❤️❤️";
				if(vidas == 2)
					txtVidas.text = "❤️❤️";

				if(vidas == 1)
					txtVidas.text = "❤️";

				if(vidas == 0){
					txtVidas.text = "";
					juego.state.start('Terminado');
				}
			}
		});
	},

	fnDisparar: function () {
		if(juego.time.now> tiempo && balas.countDead()>0){
			var audio = new Audio('media/SpaceLaserShot.mp3');
			audio.currentTime = 0.2;
			audio.playbackRate = 2.8;
			audio.play();
			tiempo = juego.time.now+tiempoEntreBalas;
			var bala=balas.getFirstDead();
			bala.anchor.setTo(0.5);
			bala.reset(nave.x,nave.y);
			bala.rotation=juego.physics.arcade.angleToPointer(bala)+Math.pi/2;
			juego.physics.arcade.moveToPointer(bala,200);
		}
	},

	fnCreateEnemy: function(){
		var enemy = malos.getFirstDead();
		var num = Math.floor(Math.random()*10+1);
		enemy.reset(num*38,0);
		enemy.anchor.setTo(0.5);
		enemy.body.velocity.y = 100;
		enemy.outOfBoundsKill=true;
        enemy.checkWorldBounds=true;
	},

	fnCollision: function(b,m){
		b.kill();
		m.kill();

		score++;
		txtScore.text = score;
		var audio = new Audio('media/explotion.mp3');
		//audio.currentTime = 0.2;
		//audio.playbackRate = 2.8;
		audio.play();
	}


};