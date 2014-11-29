game.module(
    'game.main'
)
.require(
	'game.assets',
	'game.warmup',

	'engine.core',
	'engine.scene'
)
.body(function() {

game.createScene('Main', {
	init: function(){
		

		var warmup = new game.Warmup();

        this.addObject(warmup);
	},

	click: function(){
		//console.log('test click');
	}

});



//game.start();

});
