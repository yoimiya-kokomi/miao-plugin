import Base from "./Base.js";
import {roleId} from "../../../config/roleId.js"
let CharacterMap = {};
let characterAttr = {};

class Character extends Base{
    constructor(name){
        super();

    }
    get sortName(){
        return characterAttr[this.name] || this.name;
    }

}


Character.get= function(val){
console.log(roleId)
};

export default Character;
