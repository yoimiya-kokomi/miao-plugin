import fetch from "node-fetch";
import Data from "./enka-data.js";

let Enka = {
  key: "enka",
  cd: 5,
  async request({ e, uid, config }) {
    let profileApi = config.profileApi || function (uid) {
      return `https://enka.shinshin.moe/u/${uid}/__data.json`
    };
    let api = profileApi(uid);

    let req = await fetch(api);
    let data = await req.json();
    if (!data.playerInfo) {
      if ((uid + '')[0] === '5') {
        e.reply(`请求失败:暂时不支持B服角色面板更新，请等待服务后续升级`);
      } else {
        e.reply(`请求失败:${data.msg || "请求错误，请稍后重试"}`);
      }
      return false;
    }

    let details = data.avatarInfoList;
    if (!details || details.length === 0 || !details[0].propMap) {
      e.reply(`请打开角色展柜的显示详情`);
      return false;
    }
    return Data.getData(uid, data);
  }
}

export default Enka;