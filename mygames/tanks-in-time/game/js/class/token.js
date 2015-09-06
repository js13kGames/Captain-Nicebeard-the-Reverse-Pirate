
var Token = Class.extend({
	init: function(tokendata,isWorldForward) {


		this.xpos = tokendata.xpos;
		this.ypos = tokendata.ypos;
		this.isWorldForward = isWorldForward;
		this.events = new GameEvents(tokendata.events,isWorldForward);
		this.eventsQueue = [];
		var firstEvent = this.events.getNextEvent();
		if (firstEvent==null) 
			this.visible = true;
		else {
			this.runEvent(firstEvent);
			this.visible = !this.visible;
		}

	}

	,draw: function(g,worldTime) {
		if (this.visible) {
			g.ctx.save();
			g.ctx.translate(this.xpos, this.ypos);
			var s =  (((worldTime+this.ypos*100)%1000 > 500) ? (500-((worldTime+this.ypos*100)%500)) : ((worldTime+this.ypos*100)%500))/1000;
			g.ctx.scale(1+s,1+s*0.8);
    		g.ctx.drawImage(gameImages[0], -331/8/2, -339/8/2,331/8, 339/8);
			
			// g.ctx.fillStyle = "green";
			
			// g.ctx.beginPath();
			// g.ctx.arc(20, 20, 20, 0, 2 * Math.PI, false);
			// g.ctx.stroke();
			// g.ctx.fill();
			
			g.ctx.restore();
		}

	}

	,tick: function(delta,worldTime) {

		this.events.forEachCurrentEvent(worldTime,function(event) {
			this.runEvent(event);
		}.bind(this));
	}

	,runEvent: function(event) {
		if (this.isWorldForward)
			this.visible = event.visible;
		else
			this.visible = !event.visible;
	}

	,compareTank: function(player,worldTime) {
		if (dist(this,player)<50 && this.visible)	{

			this.visible=false;
			
			this.eventsQueue.push({
				worldTime: worldTime,
				visible: this.isWorldForward ? this.visible : !this.visible,
				tankId: player.tankId,
				isForward: this.isWorldForward
			});
			this.tankHit(player,worldTime);
		}

	},
	tankHit: function(player,worldTime) {
		player.coins += 10;
		if (player.isPlayer) {
			showNotification("Booty retrieved. Press Z / X to give gold to fellow ships.");
		}
	}





	,toPlainObject: function() {

	}

});