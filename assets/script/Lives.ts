const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    removeNode()
    {
        this.node.destroy();
    }
    
    onLoad() {
        // init logic
        
    }
}
