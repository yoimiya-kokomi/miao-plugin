/*
* 胡桃API Miao-Plugin 封装
* https://github.com/DGP-Studio/DGP.Genshin.HutaoAPI
*
*
* */

import Base from "./Base.js";
import fetch from "node-fetch";

const host = "https://hutao-api.snapgenshin.com";

let hutaoApi = null;

function getApi(api) {
  return `${host}${api}`;
}

let HutaoApi = {
  _auth: false,
  async login() {
    let response = await fetch(getApi('/Auth/Login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/json; charset=utf-8',
      },
      body: JSON.stringify({
        "Appid": "appid",
        "Secret": "secret"
      })
    });
    let res = await response.json();
  },
  async req(url, data) {
    let cacheData = await redis.get(`hutao:${url}`);
    if (cacheData) {
      return JSON.parse(cacheData)
    }

    let response = await fetch(getApi(`${url}?Authorization=demo`), {
      method: "GET",
      headers: {
        Authorization: `Bearer{token}`
      }
    });
    let retData = await response.json();
    let d = new Date();
    retData.lastUpdate = `${d.toLocaleDateString()} ${d.toTimeString().substr(0, 5)}`;
    await redis.set(`hutao:${url}`, JSON.stringify(retData), { EX: 3600 });
    return retData;

  },

  // 角色持有及命座分布
  async getCons() {
    return await HutaoApi.req("/Statistics/Constellation");
  },

  async getAbyssPct() {
    return await HutaoApi.req("/Statistics/AvatarParticipation");
  }

};


export default HutaoApi;