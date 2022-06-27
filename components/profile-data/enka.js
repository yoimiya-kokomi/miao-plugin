import fetch from "node-fetch";
import Data from "./enka-data.js";

let Enka = {
  key: "enka",
  cd: 5,
  async request({ e, uid, avatar, config }) {
    let profileApi = config.enkaApi || function ({ uid }) {
      return `https://enka.shinshin.moe/u/${uid}/__data.json`
    };
    let api = profileApi({ uid, avatar });

    let req = await fetch(api);
    let data = await req.json();
    if (!data.playerInfo) {
      e.reply(`请求失败:${data.msg || "可能是面板服务并发过高，请稍后重试"}`);
      return false;
    }
    let details = data.avatarInfoList;
    if (!details || details.length === 0 || !details[0].propMap) {
      e.reply(`请打开游戏内角色展柜的“显示详情”后，等待5分钟重新获取面板`);
      return false;
    }
    return Data.getData(uid, data);
  }
}

export default Enka;