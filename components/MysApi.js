import md5 from "md5";
import lodash from 'lodash';
import fetch from "node-fetch";

let MysApi = {
  getUrl(type, uid, data = {}) {
    let url = "https://api-takumi.mihoyo.com";
    let game_record = "/game_record/app/genshin/api/";
    let server = MysApi.getServer(uid);
    let query, body;

    switch (type) {
      //首页宝箱
      case "index":
        url += game_record + "index";
        query = `role_id=${uid}&server=${server}`;
        break;
      //深渊
      case "spiralAbyss":
        url += game_record + "spiralAbyss";
        query = `role_id=${uid}&schedule_type=${data.schedule_type}&server=${server}`;
        break;
      //角色详情
      case "character":
        url += game_record + "character";
        body = JSON.stringify(data);
        break;
      //树脂每日任务（只能当前id）
      case "dailyNote":
        url += game_record + "dailyNote";
        query = `role_id=${uid}&server=${server}`;
        break;
      case "detail":
        url += "/event/e20200928calculate/v1/sync/avatar/detail";
        query = `uid=${uid}&region=${server}&avatar_id=${data.avatar_id}`;
        break;
      case "getAnnouncement":
        url += "/game_record/card/wapi/getAnnouncement";
        break;
      case "getGameRecordCard":
        url += "/game_record/card/wapi/getGameRecordCard";
        query = `uid=${uid}`;//米游社id
        break;
      case "bbs_sign_info":
        url += "/event/bbs_sign_reward/info";
        query = `act_id=e202009291139501&region=${server}&uid=${uid}`;
        break;
      case "bbs_sign_home":
        url += "/event/bbs_sign_reward/home";
        query = `act_id=e202009291139501&region=${server}&uid=${uid}`;
        break;
      case "bbs_sign":
        url += "/event/bbs_sign_reward/sign";
        body = JSON.stringify({ act_id: "e202009291139501", region: server, uid: uid, });
        break;
      case "ys_ledger":
        url = "https://hk4e-api.mihoyo.com/event/ys_ledger/monthInfo";
        query = `month=${data.month}&bind_uid=${uid}&bind_region=${server}`;
        break;
    }

    if (query) {
      url += "?" + query;
    }

    let headers;
    if (type === "bbs_sign") {
      headers = MysApi.getHeaders_sign();
    } else {
      headers = MysApi.getHeaders(query, body);
    }

    return { url, headers, query, body };
  },

  getServer(uid) {
    switch (uid.toString()[0]) {
      case "1":
      case "2":
        return "cn_gf01"; //官服
      case "5":
        return "cn_qd01"; //B服
    }
    return "cn_gf01"; //官服
  },

//# Github-@lulu666lulu
  getDs(q = "", b = "") {
    let n = "xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs";
    let t = Math.round(new Date().getTime() / 1000);
    let r = Math.floor(Math.random() * 900000 + 100000);
    let DS = md5(`salt=${n}&t=${t}&r=${r}&b=${b}&q=${q}`);
    return `${t},${r},${DS}`;
  },

//签到ds
  getDS_sign() {
    const n = "h8w582wxwgqvahcdkpvdhbh2w9casgfl";
    const t = Math.round(new Date().getTime() / 1000);
    const r = lodash.sampleSize("abcdefghijklmnopqrstuvwxyz0123456789", 6).join("");
    const DS = md5(`salt=${n}&t=${t}&r=${r}`);
    return `${t},${r},${DS}`;
  },

  getHeaders(q = "", b = "") {
    return {
      "x-rpc-app_version": "2.20.1",
      "x-rpc-client_type": 5,
      DS: MysApi.getDs(q, b),
    };
  },

  getHeaders_sign() {
    return {
      "x-rpc-app_version": "2.3.0",
      "x-rpc-client_type": 5,
      "x-rpc-device_id": MysApi.guid(),
      "User-Agent": " miHoYoBBS/2.3.0",
      DS: MysApi.getDS_sign(),
    };
  },

  guid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  },

  // 按type请求
  request: async function (type, cfg) {
    let { uid } = cfg;
    let { url, headers } = MysApi.getUrl(type, uid);
    return await MysApi.fetch(url, headers, cfg);
  },

  // 发送请求
  fetch: async function (url, cfg) {
    let { cookie, error, success, headers, method } = cfg;
    headers = headers || {};
    method = method || "get";
    headers.Cookie = cookie;
    let response = await fetch(url, { method, headers });
    if (!response.ok) {
      return await error(-1, {
        msg: "米游社接口错误"
      })
    }
    let res = await response.json();
    if (res.retcode * 1 !== 0) {
      return await error(res.retcode * 1, res)
    }
    return await success(res.data, res)
  }
}

export default MysApi;
