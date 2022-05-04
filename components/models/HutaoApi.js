/*
* 胡桃API Miao-Plugin 封装
* https://github.com/DGP-Studio/DGP.Genshin.HutaoAPI
*
* */

import fetch from "node-fetch";

const host = "http://49.232.91.210:88/miaoPlugin/hutaoApi";

let hutaoApi = null;

function getApi(api) {
  return `${host}?api=${api}`;
}

let HutaoApi = {
  async req(url, data) {
    let cacheData = await redis.get(`hutao:${url}`);
    if (cacheData) {
      return JSON.parse(cacheData)
    }

    let response = await fetch(getApi(`${url}`), {
      method: "GET",
    });
    let retData = await response.json();
    if (retData && retData.data) {
      let d = new Date();
      retData.lastUpdate = `${d.toLocaleDateString()} ${d.toTimeString().substr(0, 5)}`;
      await redis.set(`hutao:${url}`, JSON.stringify(retData), { EX: 3600 });
    }
    return retData;
  },

  // 角色持有及命座分布
  async getCons() {
    return await HutaoApi.req("/Statistics/Constellation");
  },

  async getAbyssPct() {
    return await HutaoApi.req("/Statistics/AvatarParticipation");
  },

  async getAbyssTeam() {
    return await HutaoApi.req("/Statistics/TeamCombination");
  }
};


export default HutaoApi;