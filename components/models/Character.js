import Base from "./Base.js";
import { roleId,  abbr } from "../../../config/genshin/roleId.js";
import lodash from "lodash";
import fs from "fs";

let characterMap = {};
let characterAttr = {};

const characterMeta = JSON.parse(fs.readFileSync("../meta/characters.json", "utf8"));


lodash.forEach(characterMeta, (meta)=>{
  characterMap[meta.Name] = new Character(name, meta)
});

lodash.forEach(roleId, function(names, id){
  if(characterMap[names[0]]){
    characterMap[names[0]].id = id;
  }
});

class Character extends Base {

  constructor(name, meta) {
    super();
    let key = "".split();
    this._meta = meta;
  }
  get sortName() {
    return characterAttr[this.name] || this.name;
  }

  get id(){
      for(let id in roleId){
        if(roleId[id] && role[id][0] === this.name){
          return id;
        }
      }
  }

  getData(key){

  }
}



Character.get = function (val) {
  let name = YunzaiApps.mysInfo.roleIdToName(val);
  if(!name){
    return false;
  }
  if(!characterMap[name]){
    //characterMap[name] =
  }


};

export default Character;
