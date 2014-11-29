game.module(
	'game.warmup'
)
.require(
	'engine.scene',
	'engine.core',

	'game.assets',
	'game.captain',
	'game.AI',
	'game.pile',
	'game.refereepile',
	'game.chip',
	'game.dice'
)
.body(function(){

/*	In order to call these value easily,
 *	set them to global value as game.***
 */
var Player = null;
var AI = null;
var RefereePile = null;
var chip = null;

game.createClass('Warmup', {

	PlayerIsHome: true,	// default to set player as home side
	playeroffence: true,	// default to set player as offence side

	PlayerGoals: 0,
	AIGoals: 0,

	NoHomeCards: 42,
	NoAwayCards: 42,
	NoRefereeCards: 5,

	chipSide: 'Home',	// default set chipside as home side 
	chiplocation: 0, 	// -12 to 12, 0 for mid

	NoRound: 0,			// number of the game turn

	// card that captain picked last turn
	PlayerLastPick: null,
	AILastPick: null,
	

	init: function() {
		var field = new game.Sprite('field');
		game.scene.stage.addChild(field);

		this.newgame();	// need button to exit game
	},

	newgame: function(){
		// a new game should firstly decide which side is home side 
		this.homeaway();
		//this.PlayerIsHome = true;	// for testing
		this.NoRound = 0;

		console.log('PlayerIsHome? : ' + this.PlayerIsHome);
		console.log();

		// ================
		// create two captain/players, 
		// will create pile in game.Captain() class
		console.log('UserSide');
		game.Player = new game.Captain(this.PlayerIsHome);

		console.log();
		console.log('AISide');
		game.AI = new game.AI(!this.PlayerIsHome);

		game.RefereePile = new game.RefereePile();

		game.chip = new game.Chip();
 
		this.gameround();

		this.winner();
	},


	homeaway: function(){
		var dice1 = ~~Math.randomBetween(1, 7); 
		var dice2 = ~~Math.randomBetween(1, 7);
		while(dice1 == dice2) {
			console.log('had same dice value');
			dice1 = ~~Math.randomBetween(1, 7);
			dice2 = ~~Math.randomBetween(1, 7);
		}

		if(dice1 > dice2) 
			this.PlayerIsHome = true;	// true for player, false as AI
		else 
			this.PlayerIsHome = false;

		// will need homeaway class to have animations


		console.log('Home or Away dicerolling:');
		console.log('Player Dice: ' + dice1);
		console.log('AI Dice: ' + dice2);
		
	},

	gameround: function(){	// a gameturn only keeps till one goal
		var goal = false;
		var PlayerGetLastGoal = !this.PlayerIsHome;	// who got last goal? true as player, false as AI
		while(game.Player.Score < 1 && game.AI.Score < 1 &&
				game.Player.pile.NoCards() > 0 && game.AI.pile.NoCards() > 0)
		{
			// 1. reset the 'GoalThisTurn' bool in both captain and AI
			game.Player.NewTurnInit();
			game.AI.NewTurnInit();

			// 2. kick off
			this.kickoff(PlayerGetLastGoal);	
			goal = false;				// reset 'goal' to false for next real turn
			// 3. loop turn till one goal
			//		3.1 last loser use card first, then winner 
			//		3.2 check goal or not after use card
			//		3.3 if goal, end loop. set player/AI get goal
			console.log();
			if(PlayerGetLastGoal){
				while(!goal){
					// last loser's turn
					game.Player.PlayerAuto();
					goal = game.Player.checkGoal();
					if(goal){
						console.log('End loop: Player Goaled');
						PlayerGetLastGoal = true;
					}else{
						// last winner's turn
						game.AI.SmartPlay();
						goal = game.AI.checkGoal();
						if(goal){
							console.log('End loop: AI Goaled');
							PlayerGetLastGoal = false;
						}
					}
				}				
			}else{
				while(!goal){
					// last loser's turn
					game.AI.SmartPlay();
					goal = game.AI.checkGoal();
					if(goal){
						console.log('End loop: AI Goaled');
						PlayerGetLastGoal = false;
					}else{
						// last winner's turn
						game.Player.PlayerAuto();
						goal = game.Player.checkGoal();
						if(goal){
							console.log('End loop: Player Goaled');
							PlayerGetLastGoal = true;
						}
					}
				}
			}	

			// 4. count goals, will happen in captain/AI class								

			this.NoRound++;
		}


	},

	kickoff: function(PlayerGetLastGoal){	// true for player, false for AI
		// reset chip first
		game.chip.resetchip();
		/*
		 * animation to reset chip location to mid, based on the 'side'
		 */ 

		var dice1 = ~~Math.randomBetween(1, 7);
		var dice2 = ~~Math.randomBetween(1, 7);
		var bigger = Math.max(dice1, dice2);

		console.log();
		if(PlayerGetLastGoal){
			console.log('Player Get Last Goal');
			console.log('AI KickOff');
			game.chip.moveChip(-bigger);
		}
		else{
			console.log('AI Get Last Goal');
			console.log('Player KickOff');
			game.chip.moveChip(bigger);
		}
		
		

		/*
		 * need dice rolling animation here
		 */

		/* 
		 * need chip movement animation here
		 */
	},

	winner: function(){
		if(game.Player.Score == 10 || game.Player.Score > game.AI.Score)
			console.log('You Win!');
		else if(game.AI.Score == 10 || game.AI.Score > game.Player.Score)
			console.log('You Loser!');
		else if(game.AI.Score == game.Player.Score)
			console.log('平手');
		else
			console.log('Unknown Error for final Scores');
	},

	pickcard: function(){

	},

	
	diceroll: function(){

	},

	movechip: function(){

	},


});


/* this class is to decide home or away at the beginning of the game */
game.createClass('HomeAway',{

	diceValue: 1,
	chip: null,
	rolling: false,
	timing: false, 

	PlayerIsHome: true,	// need a function to compare the simgle dice rolling 
						// and determing home or away

	init: function() {
		console.log('test HomeAway');
		var dice = new game.Sprite('dice1');
		dice.position.set(100,800);
		
		dice.anchor.set(0.5, 0.5);
		game.scene.stage.addChild(dice);
	},

	update: function(){
		if(this.rolling && !this.timing ){
			var self = this;
			this.timing = true;
			this.diceValue = ~~Math.randomBetween(1,6);
			this.dice.setTexture('dice' + this.diceValue);
			game.scene.addTimer(100, function() {
				self.timeing = false;
			});
		};
	},
	

	roll: function(){
		this.rolling = true;
	},

	stoproll: function(){
		this.rolling = false;
	},

	decision: function(){
		//return true;
	}
	

});






/*
 *	class to load card pick view frame and buttons
 */
game.createClass('CardsPick', {

	init: function() {
		console.log('test loadCards');

		var usebutton 	= new game.Sprite('useButton', 100, 600).addTo(game.scene.stage);
		var tradebutton = new game.Sprite('tradeButton', 350, 600).addTo(game.scene.stage);
		var skipbutton 	= new game.Sprite('skipButton', 100, 700).addTo(game.scene.stage);
		var mainviewbutton = new game.Sprite('mainviewButton', 350, 700).addTo(game.scene.stage);

		// will add scale tween when mouseon later
		// and sprite.onclick
	}


});

});