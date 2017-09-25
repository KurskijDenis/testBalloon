const {ccclass, property} = cc._decorator;


@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    PrefabBalloon = null;

    @property(cc.Label)
    TotalScore = null;

    @property(cc.Prefab)
    Lose = null;
    
    @property(cc.Node)
    LeaderTable = null;

    @property(cc.EditBox)
    NamePlayer = null;

    @property (cc.Node)
    GameStart=null;

    @property (cc.Node)
    GameScore=null;
    
    @property(cc.Label)
    ScoreLabel = null;

    @property(cc.Node)
    MyScrollView = null;

    @property (cc.Node)
    GameOverMenu=null;

    @property (cc.Button)
    ButtonAudio=null;

    @property (cc.Node)
    PauseGameMenu=null;
    
    @property (cc.Node)
    PauseButton=null;

    pauseGame:boolean=false;
    endGame:boolean = true;
    scoreNum: number;
    respaunBallon :number=0;
    audioOn:boolean;
    err1=null;
    err2=null;
    err3=null;
    spawnNewBalloon() {
        var newBalloon = cc.instantiate(this.PrefabBalloon);
        
        this.node.addChild(newBalloon);
      
        newBalloon.setPosition(this.getNewBalloonPosition());
        newBalloon.getComponent("BallonScript").game = this;
        var mSprite = newBalloon.getComponent(cc.Sprite);
        var randCol = cc.random0To1();
        newBalloon.getComponent("BallonScript").typeBalloon="1";
        if (randCol<0.25)
        {
            newBalloon.getComponent("BallonScript").typeBalloon= "2";
        }
        else
        if (randCol<0.5)
        {
            newBalloon.getComponent("BallonScript").typeBalloon= "3";
        }
        else
        if (randCol<0.75)
        {
            
            newBalloon.getComponent("BallonScript").typeBalloon="4";
           
        }
        cc.loader.loadRes("balloon"+ newBalloon.getComponent("BallonScript").typeBalloon+".png", function(err, data) {
            this.spriteFrame = new cc.SpriteFrame(data);
        }.bind(mSprite));
    }
    update (dt) 
    {
        if (!this.endGame&&!this.pauseGame)
        {
            this.respaunBallon +=dt;
            if (this.respaunBallon>1)
            {
                this.spawnNewBalloon();
                this.respaunBallon=0;
            }
        }
       
    }
    
    gainScore () 
    {    
        this.scoreNum += 1;
        this.ScoreLabel.string = "Score: " + this.scoreNum.toString();
    }
    getNewBalloonPosition () {
        cc.director.getWinSize().height/2;
        var randX =  0;
       
        var randY = -cc.director.getWinSize().height/2;
        
        var maxX = this.node.width/2;
        randX = cc.randomMinus1To1() * maxX;
       
        return cc.p(randX, randY);
    }
    ShowLeaderTable()
    {
        this.addValueInScrollView();
        this.MyScrollView.active=true;
        this.GameStart.active = false;
    }
    clearLives()
    {
        if(this.err1!=null)
        {
                this.err1.getComponent("Lives").removeNode();
                this.err1=null;
        }
        if(this.err2!=null)
        {
                this.err2.getComponent("Lives").removeNode();
                this.err2=null;
        }
        if(this.err3!=null)
        {
                this.err3.getComponent("Lives").removeNode();
                this.err3=null;
        }        

    }
    StartGameMenu()
    {
        this.PauseButton.active=false;
        this.PauseGameMenu.active=false;
        this.pauseGame=false;
        this.NamePlayer.string="";
        this.MyScrollView.active=false;
        this.GameStart.active = true;
        this.endGame=true;
        this.GameOverMenu.active=false;
        this.GameStart.active = true;
        this.GameScore.active=false;
        this.getComponent(cc.AudioSource).stop();
        this.clearLives();
    }
    restartAndDel()
    {
        for(var i=0;i< this.node.childrenCount;i++)
        {
            if (this.node.children[i].getComponent("BallonScript")!=null)
            {
                this.node.children[i].destroy();
            }
        }
        this.restartGame();
    }
    restartGame()
    {
        
        this.clearLives();
        this.PauseButton.active=true;
        this.PauseGameMenu.active=false;
        this.pauseGame=false;
        if (this.NamePlayer.string!="")
        {
            if (this.audioOn)
                {
                    this.getComponent(cc.AudioSource).play();
                }
            this.FullLife();
            this.GameOverMenu.active=false;
            this.GameStart.active = false;
            this.GameScore.active=true;
            this.scoreNum=-1;
            this.endGame=false;
            this.gainScore();
        }
    }
    FullLife()
    {
        var h=cc.director.getWinSize().height/2;
        var w=cc.director.getWinSize().width/2;
        this.err1 = cc.instantiate(this.Lose);
        var bb = this.err1.getComponent("Lives").node.getBoundingBox();
        this.err1.setPosition(w-bb.width/2,h-bb.height/2);
     
        this.node.addChild(this.err1);

        this.err2 = cc.instantiate(this.Lose);
        var bb = this.err1.getComponent("Lives").node.getBoundingBox();
        this.err2.setPosition(w-3*bb.width/2,h-bb.height/2);
        this.node.addChild(this.err2);  
        
        this.err3 = cc.instantiate(this.Lose);
        var bb = this.err1.getComponent("Lives").node.getBoundingBox();
        this.err3.setPosition(w-5*bb.width/2,h-bb.height/2);
        this.node.addChild(this.err3);  
    }

    AddFail()
    {
        if (this.err1!=null)
        {
            this.err1.getComponent("Lives").removeNode();
            this.err1=null;
        }
        else
        if (this.err2!=null)
        {
            this.err2.getComponent("Lives").removeNode();
            this.err2=null;    
        }
        else
        if (this.err3!=null)
        {
            this.err3.getComponent("Lives").removeNode();
            this.err3=null;
            
            this.getComponent(cc.AudioSource).stop();
            this.endGame=true;
            this.GameOverMenu.active=true;
            this.PauseButton.active=false;
            this.TotalScore.string = "Total Score: "+this.scoreNum.toString();
            var val = cc.sys.localStorage[this.NamePlayer.string];
            if (val==null||this.scoreNum>val)
                cc.sys.localStorage.setItem(this.NamePlayer.string,this.scoreNum);
        }
    }
    addValueInScrollView()
    {
        var i=0;
        var locStor = cc.sys.localStorage;
        var nodeM = new cc.Node();
        var nodeM2 = new cc.Node();
        nodeM.setPosition(cc.p(-this.LeaderTable.width/5,-20*(i+1)));
        nodeM.setContentSize(cc.size(this.LeaderTable.width/2,20));
        nodeM.addComponent(cc.Label);
        nodeM.getComponent(cc.Label).fontSize=20;
        nodeM.getComponent(cc.Label).overflow = cc.Label.Overflow.CLAMP;
        nodeM.getComponent(cc.Label).fontSize= 20;
        nodeM.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        nodeM.getComponent(cc.Label).string="Name";

        this.LeaderTable.addChild(nodeM);
        nodeM2.setPosition(cc.p(this.LeaderTable.width/3,-20*(i+1)));
        nodeM2.setContentSize(cc.size(this.LeaderTable.width/2,20));
        nodeM2.addComponent(cc.Label);
        nodeM2.getComponent(cc.Label).fontSize=20;
        nodeM2.getComponent(cc.Label).overflow = cc.Label.Overflow.CLAMP;
        nodeM2.getComponent(cc.Label).fontSize= 20;
        nodeM2.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        nodeM2.getComponent(cc.Label).string="Score" ;

        this.LeaderTable.addChild(nodeM2);

        var countries = Object.keys(locStor).sort(function(a, b) {return localStorage[b] - localStorage[a]; }) 
        i++;
        for (var j=0;j<locStor.length;j++)
        {
            if (locStor[countries[j]]!="undefined")
            {
                var nodeM = new cc.Node();
                var nodeM2 = new cc.Node();
                nodeM.setPosition(cc.p(-this.LeaderTable.width/5,-20*(i+1)));
                nodeM.setContentSize(cc.size(this.LeaderTable.width/2,20));
                nodeM.addComponent(cc.Label);
                nodeM.getComponent(cc.Label).fontSize=20;
                nodeM.getComponent(cc.Label).overflow = cc.Label.Overflow.CLAMP;
                nodeM.getComponent(cc.Label).fontSize= 20;
                nodeM.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                nodeM.getComponent(cc.Label).string=countries[j].toString();

                this.LeaderTable.addChild(nodeM);
                nodeM2.setPosition(cc.p(this.LeaderTable.width/3,-20*(i+1)));
                nodeM2.setContentSize(cc.size(this.LeaderTable.width/2,20));
                nodeM2.addComponent(cc.Label);
                nodeM2.getComponent(cc.Label).fontSize=20;
                nodeM2.getComponent(cc.Label).overflow = cc.Label.Overflow.CLAMP;
                nodeM2.getComponent(cc.Label).fontSize= 20;
                nodeM2.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                nodeM2.getComponent(cc.Label).string=locStor[countries[j]] ;

                this.LeaderTable.addChild(nodeM2);
                i++;
            }
        }

    }
    pauseG()
    {
        this.PauseGameMenu.active=true;
        this.pauseGame=true;

    
    }
    resumeGame()
    {
        this.PauseGameMenu.active=false;
        this.pauseGame=false;
    
        
    }
    OnOffAudio()
    {
        
        this.audioOn=!this.audioOn;
        var mSprite = this.ButtonAudio.getComponent(cc.Sprite);
        if (this.audioOn)
        {
          //  this.ButtonAudio.disabled =false; 
            cc.loader.loadRes("audioOn.png", function(err, data) {
                this.spriteFrame = new cc.SpriteFrame(data);
            }.bind(mSprite));
        }
        else
        {
         //   this.ButtonAudio.disabled =true;
        //    this.ButtonAudio.setBright(false);
            cc.loader.loadRes("audioOff.png", function(err, data) {
                this.spriteFrame = new cc.SpriteFrame(data);
            }.bind(mSprite));
        }
    }
    onLoad() {
        this.audioOn=true;
        this.spawnNewBalloon();
        this.addValueInScrollView()
        this.MyScrollView.active=false;
        this.GameOverMenu.active=false;
        this.PauseGameMenu.active=false;
        this.PauseButton.active=false;
        this.GameOverMenu.game = this;
        this.endGame=true;
        this.GameScore.active=false;
        this.scoreNum = 0;
    }
}
