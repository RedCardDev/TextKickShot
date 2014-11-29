game.module(
	'game.chip'
)
.body(function(){
	
game.createClass('Chip', {

	Side: null,

	chiplocation: null,

	init: function(){
		this.Side = 'Home',
		this.chiplocation = 0;
	},

	Locate: function(){
		return this.chiplocation;
	},

	TurnOver: function(){
		if(this.Side == 'Home')	{
			this.Side = 'Away';
			// ball turn over animation
		}else if(this.Side == 'Away'){
			this.Side = 'Home';
			// ball turn over animation
		}else{
			console.log('Error: Unknown chip side!');
		}
		console.log('The chip was turned over');
		console.log('Chip Side: '+this.Side);
		
	},

	resetchip: function(){
		this.chiplocation = 0;
	},

	moveChip: function(distance){
		this.chiplocation = this.chiplocation + distance;
		if(this.chiplocation > 11)		this.chiplocation = 11;
		if(this.chiplocation < -11)		this.chiplocation = -11;

		console.log();
		console.log('Current Chip Location: '+this.chiplocation);
	}

});


});