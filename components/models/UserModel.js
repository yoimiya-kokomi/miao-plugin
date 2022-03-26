/*
* UserModel Class
* 提供用户实例相关的操作方法
*
* * TODO：将与具体用户操作相关的方法逐步迁移到UserModel中，外部尽量只调用实例方法
*    以确保逻辑收敛且维护性更强
* */
import BaseModel from "./BaseModel.js"
import lodash from "lodash";
import md5 from "md5";
import { MysApi, Data } from "../index.js";

const _path = process.cwd();
const redisPrefix = "cache";

const userInstanceReclaimTime = 60;
let userMap = {};

// Redis相关操作方法
const Cache = {
  prefix: "genshin",
  async get(type, key) {
    return await redis.get(`${Cache.prefix}:${type}:${key}`);
  },
  async set(type, key, val, exp = 2592000) {
    return await redis.set(`${Cache.prefix}:${type}:${key}`, val, { EX: exp });
  },
  async del(type, key) {
    return await redis.del(`${Cache.prefix}:${type}:${key}`);
  }
};
const saveCookieFile = function () {
  Data.writeJson("./data/NoteCookie/", "NoteCookie", NoteCookie);
};

// UserModel class
class UserModel extends BaseModel {

  // 初始化用户
  constructor(id) {
    super();
    // 一个id对应一个用户，根据id检索用户信息
    this.id = id;

    // 检索是否存在NoteCookie信息
    let data = NoteCookie[id];

    if (data) {
      this._data = data;
      this.isPush = data.isPush;
      this.isSignAuto = data.isSignAuto;
      this.uid = data.uid;
    } else {
      this._data = {};
    }
  }

  // 是绑定的cookie用户
  // 需要存在NoteCookie记录且存在 cookie 与 uid 才认为是正确记录
  get isBind() {
    let dbData = NoteCookie[this.id];
    return !!(dbData && dbData.cookie && dbData.uid);
  }

  // 是否是管理员
  // TODO
  get isMaster() {
    return !this.isBot && BotConfig.masterQQ && BotConfig.masterQQ.includes(Number(this.id));
  }

  get isBot() {
    // todo
    return false;
  }

  // 获取当前用户cookie
  get cookie() {
    return this._data.cookie;
  }

  // 获取当前用户uid
  get uid() {
    return this._uid || this._data.uid || this._reg_uid;
  }

  set uid(uid) {
    this._uid = uid;
    this._reg_uid = uid;
  }

  // 保存用户信息
  /*
  async _save() {
    // todo
    return

    let data = NoteCookie[this.id] || this._data || {};

    // 将信息更新至 NoteCookie
    data.id = this.id;
    data.uid = this._uid || this._data.uid;
    data.cookie = this._cookie || this._data.cookie;
    data.isPush = this.isPush;
    data.isAutoSign = !!this.isAutoSign;

    // 保存信息
    NoteCookie[this.id] = data;
    this._data = data;
    saveCookieFile();

    // 建立当前用户相关缓存
    await this.refreshCache();
    return this;
  }
   */

  // 设置&更新用户缓存
  async refreshCache() {
    // 设置缓存
    await Cache.set("id-uid", this.qq, this.uid);
    await Cache.set("uid-id", this.uid, this.id);
    Bot.logger.mark(`绑定用户：QQ${this.id},UID${this.uid}`);
  }

  // 删除用户缓存
  async delCache() {
    await Cache.del("id-uid", this.id);
    await Cache.del("uid-id", this.uid);
  }


  // 获取曾经查询过当前用户的人
  async getSourceUser() {
    let lastQuery = await Cache.get("id-source", this.id);

    if (lastQuery) {
      return UserModel.get(lastQuery);
    }

    return false;
  }

  // 设置曾经查询过当前用户的人，缓存23小时
  async setSourceUser(user) {
    await Cache.set("id-source", this.id, user.id, 3600 * 23);
  }

  // 删除曾经查询过当前用户的人
  async delSourceUser() {
    await Cache.del("id-source", this.id);
  }


  /* 获取当前用户注册的uid
  *
  * 1. 如果是绑定用户，优先返回当前绑定的uid（cookie 对应uid）
  * 2. 返回redis中存储的uid
  *
  * 注：redis uid需要主动调用一次 getRegUid 才能被this.uid访问到
  *
  * */
  async getRegUid() {
    if (this.isBind) {
      return this.uid;
    }
    if (!this._reg_uid) {
      let uid = await Cache.get('id-regUid', this.id);
      if (uid) {
        this._reg_uid = uid;
      }
    }
    return this._reg_uid;
  }

  async setRegUid(uid) {
    // 只有非绑定用户才设置 注册uid
    if (!this.isBind) {
      this._reg_uid = uid;
      Cache.set('id-regUid', this.id, uid);
      Cache.set('regUid-id', this.uid, this.id);
    }
  }
}



/* UserModel static function */

/*
* 获取用户实例
* query为获取条件，默认为 id
*
* */
UserModel.get = async function (query, getDraftWhenNotFound = false) {
  let user = await getUser(query, getDraftWhenNotFound);

  user._reclaimFn && clearTimeout(user._reclaimFn);
  user._reclaimFn = setTimeout(() => {
    delete userMap[user.id];
  }, userInstanceReclaimTime);
  userMap[user.id] = user;

  return user;
};

// 格式化查询
const formatQuery = function (query) {
  if (typeof (query) === "string") {
    return { id: query };
  }
  return query;
};

let getUser = async function (query, getDraftWhenNotFound = false) {
  query = formatQuery(query);

  let id = "";
  // 根据id获取用户
  if (query.id) {
    id = query.id;
  } else if (query.uid) {
    // 根据uid检索id
    id = await Cache.get("uid-id", query.uid);
    if (!id) {
      // 如未查找到，则从注册uid中检索
      id = await Cache.get("regUid-id", query.uid)
    }
  } else if (query.token) {
    // 根据token检索id
    // 不常用，仅用在机器人绑定环节
    id = await Cache.get("token-id", query.token);
  }

  // 已有实例优先使用已有的
  if (userMap[id]) {
    return userMap[id];
  }

  // 如果是注册用户，则返回新instance
  if (NoteCookie[id]) {
    return new UserModel(id);
  }

  // 如果允许返回Draft，则生成并返回
  if (getDraftWhenNotFound) {
    return getDraft(query);
  }

  // 未查询到用户则返回false
  return false;
}

let getDraft = function (query) {
  let id = '';
  if (query.id) {
    id = query.id;
  } else if (query.uid) {
    id = '_UID_' + query.uid;
  } else if (query.token) {
    id = "_CK_" + md5(query.token);
  }

  let user = new UserModel(id);
  user.id = query.id;
  user.uid = query.uid;
  user.cookie = query.cookie;
  return user;
}




export default UserModel;
