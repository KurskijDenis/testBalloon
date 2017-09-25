const {ccclass, property} = cc._decorator;

@ccclass
export default class BallonClass extends cc.Component {

    public speed :number = 120;
    public direct : number[];
    game:undefined;
    destroyNode: number;
    widthLocal:number;
    heightLocal :number;
    typeBalloon:string;
update (dt) {
    if (this.destroyNode>0)
    {
        if (this.destroyNode>20)
        {
            this.game.gainScore();
            this.node.destroy();
        }
        else
        {
            this.destroyNode++;
        }
    }
    else
     {
         if (this.game.endGame)
            {
                this.node.destroy();
            }
            else
            {
                if (!this.game.pauseGame)
                {
                        this.node.y += this.direct[1]*this.speed * dt;
                        this.node.x += this.direct[0]*this.speed * dt;
                        var winSize=cc.director.getWinSize();
                        if (this.node.x<=-winSize.width/2+ this.node.width/2)
                        {
                            this.direct[0]= Math.abs(this.direct[0]);
                        }
                        else
                        {
                            if (this.node.x>=winSize.width/2-this.node.width/2)
                            {
                                this.direct[0]=-1 * Math.abs(this.direct[0]);

                            }
                        }
                        if (this.node.y>winSize.height/2)
                        {
                                this.game.AddFail();
                                this.node.destroy();
                        }
                }
            }

    }
}

registerInput () {
    // touch input
    cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan: function(touch, event) {
            var location = touch.getLocation();
            location.x =location.x-this.widthLocal/2;
            location.y =location.y-this.heightLocal/2;
            if (cc.rectContainsPoint(this.node.getBoundingBox(), location)&&!this.game.pauseGame)
            {    
                if (this.game.audioOn)            
               {
                   this.getComponent(cc.AudioSource).play();
               }
               this.getComponent(cc.Animation).play("BalloonAnim"+this.typeBalloon);

                this.destroyNode++;
            }
            return true;
        }.bind(this)
    }, this.node);
}
    onLoad() {
         this.widthLocal = cc.director.getWinSize().width;
         this.heightLocal = cc.director.getWinSize().height;

        this.direct=[5*cc.random0To1(),1];
        this.registerInput();
        this.destroyNode =0;
        
    }
}
