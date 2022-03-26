import UserModel from "./models/UserModel.js";
import { segment } from "oicq";
import fetch from "node-fetch";
import { MysApi } from "./index.js";
import md5 from "md5";

const getUidByToken = async function (token) {
  let ltoken = `ltoken=${token["ltoken"]}ltuid=${token["ltuid"]};`;
  let cookie_token = `cookie_token=${token["cookie_token"]} account_id=${token["ltuid"]};`;
  ltoken += cookie_token;
  let uid = 0;
  let url = host + "binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn";

  await MysApi.fetch(url, {
    method: "get",
    cookie: ltoken,
    error: async () => {
      throw `cookie错误：${res.message}`;
    },
    success: async (data) => {
      for (let val of data.list) {
        //米游社默认展示的角色
        if (val.is_chosen) {
          uid = val.game_uid;
          break;
        }
      }
      if (!uid) {
        uid = data.list[0].game_uid;
      }

    }
  });
  return uid;
};





let User = {};

/*
* 在文本中检索uid，若未查找到则返回false
* */
User.matchUid = function (msg) {
  let ret = /[1|2|5][0-9]{8}/g.exec(msg);
  if (ret) {
    return ret[0];
  }
  return false;
}

/*
* 返回需要绑定 cookie
*
* */
User.replyNeedBind = function (e, replyMsg = "") {
  replyMsg = replyMsg || `您尚未绑定米游社cookie，无法进行操作`;
  let helpMsg = "获取cookie后发送至当前聊天窗口即可，Cookie获取方式：https://docs.qq.com/doc/DUWNVQVFTU3liTVlO";

  if (e.isGroup) {
    replyMsg = segment.image(`file:///${_path}/resources/help/help.png`);
    e.reply([replyMsg, helpMsg]);
  } else {
    e.reply(replyMsg);
    e.reply(helpMsg);
  }

  return false;
};

/*
* 获取当前用户消息所查询的目标用户
*
* 策略：优先级依次递减
* 1. 消息里包含 uid
* 2. 存在 msg.at，且msg.at 用户 是绑定用户
* 3. 存在 msg.at 且msg.at 名片包含uid
* 4. 当前用户为绑定用户
* 5. 当前用户名片包含 uid
* 6. 当前用户存在redis-uid 缓存
* */
User.getTargetUser = async function (e, selfUser) {
  let res;
  let reg = /[1|2|5][0-9]{8}/g;
  let msg = e.msg;

  let targetId, targetUser;

  /*-- 有指定的查询目标 --*/

  /* 消息里包含 uid的话优先匹配 */
  if (e.msg) {
    targetId = getUid(e.msg);
    if (targetId) {
      // 根据targetId查找用户
      targetUser = await User.get({ uid: targetId });
      //存在则返回，不存在则将该uid绑定至当前用户
      if (targetUser) {
        return targetUser;
      }

      let selfUserBindUid = await selfUser.getRegUid();
      // 当前用户未注册，则将uid绑定至当前用户
      if (!selfUser.isBind || selfUser.uid == targetId) {
        await selfUser.setRegUid(targetId)
        return selfUser;
      } else {
        // 当前用户为注册用户，返回 Draft
        return User.get({ uid: targetId }, true)
      }


      selfUser.setRegUid(targetId);
      return selfUser;

    }
  }

  // 如果有at的用户，使用被at的用户
  if (!targetId && e.at) {
    targetUser = await User.get({ qq: e.at.qq });

    // 识别at用户的名片结果。如果at用户无uid信息则使用此结果
    targetId = getUid(e.at.card.toString());

    if (targetUser) {
      targetUser
    }
  }

  if (targetUser) {
    let targetUserUid = await targetUser.getRegUid();
    targetUser.setRegUid(targetUserUid || targetId)
    if (!targetId && !targetUserUid) {
      // return false;
    }
  }

  targetUser = selfUser;
  // 使用当前用户作为targetUser
  if (selfUser.isBind) {
    // 设置查询用户为当前用户
    targetUser = selfUser;

    // 从当前用户的昵称中匹配uid
    targetId = getUid(e.sender.card.toString());
  } else if (false) {
    //  selfUser.uid =
  }

  selfUser.setRegUid(uid);


  // 存在查询用户，但无
  if (!targetUser && targetId) {
    // 根据uid创建的用户包含uid
    return User.get({ uid: targetId }, true);

  } else if (targetUser && targetId) {
    // 存在目标用户，但不存在查询uid的话，赋值给targetUser
    if (!targetUser.uid && targetId) {
      targetUser.uid = targetId;
    }
  }

  //
  if (targetUser) {
    targetUser.setLastQuery(targetUser.id);
  }

  return targetUser;


  //从redis获取
  res = await redis.get(`genshin:uid:${e.user_id}`);
  if (res) {
    redis.expire(`genshin:uid:${e.user_id}`, 2592000);
    return { isSelf: true, uid: res };
  }
  return { isSelf: true, uid: false };

};


/*
* 获取当前 MysApi 的最佳查询User
*
* 策略，优先级依次递减 （ sUid 在下方代指被查询的Uid ）
* 1. 如果 sUid 为绑定用户，优先使用绑定用户自身的 cookie（ 在不允许跨系统调用时需传递 allowCrossUid = false )
* 2. 如果 sUid 24小时内被查询过，优先使用曾经查询过该用户的 cookie
* 3. 如果 当前查询用户为绑定用户，优先使用绑定用户自身的 cookie
* 4. 使用系统cookie : 暂未接管bot逻辑，目前需要传入getBotCookie方法
*
* */
User.getReqUser = async function (e, allowCrossUser = true, getBotCookie=false) {

  // 当前用户
  let selfUser = User.get(e.user_id);

  // 被查询用户
  let targetUser = await User.getTargetUser(e);

  // 如果 sUid 为绑定用户，优先使用绑定用户自身的 cookie
  if (targetUser.isBind && allowCrossUser) {
    return targetUser;
  }

  // 如果 sUid 24小时内被查询过，优先使用曾经查询过该用户的 cookie
  let lastQueryUser = targetUser.getSourceUser();
  if (lastQueryUser) {
    return lastQueryUser;
  }

  // 如果 当前查询用户为绑定用户，优先使用绑定用户自身的 cookie
  if (selfUser.isBind) {
    await targetUser.setSourceUser(selfUser);
    return selfUser;
  }

  // 使用系统 cookie
  // 将系统注册的cookie视作机器人，同样包装为 User 用户返回
  let botUser = User.getAvailableBot(e, true);
  if (botUser) {
    await targetUser.setSourceUser(botUser);
    return botUser;
  }
  return false;
};

/*
* 对当前用户的类型进行检查，并对不符合条件的用户进行回复
* type: all-不检查，bind-绑定用户（设置了有效的NoteCookie），master-管理员
* replyMsg：不符合条件的消息
* */
User.check = async function (e, type = "all", checkParams = {}) {
  let self = User.get(e.user_id);

  let { limit = true, action, replyMsg } = checkParams;

  // 校验频度限制
  if (limit) {
    if (!(await limitGet(e))) return true;
  }

  switch (type) {
    case 'bind':
      // 需要是绑定用户
      if (!self.isBind) {
        if (!replyMsg) {
          action = action || "进行操作";
          replyMsg = "您尚未绑定米游社cookie，无法" + action;
        }
        User.replyNeedBind(e, replyMsg);
        return false;
      }
      break;

    case 'master':
      if (!self.isMaster) {
        // 如果主动传递了replyMsg则进行回复，否则静默
        if (replyMsg) {
          e.reply(replyMsg)
        }
        return false;
      }

    case 'all':
      //不检查权限
      return self;
    default:
      return false;
  }
  return self;
};

/*
* 获取可用的机器人，作为UserModel返回
* noticeError： 在无可用机器人时是否 e.reply 错误信息
* */
// TODO： 待实现
User.getAvailableBot = async function (e, noticeError = false) {
  let id = md5("BOT_" & md5('cookie'));

  User.get(md5);
  User.bindCookie(cookie, {
    isBot: true
  });

  return false;
};

export default User;

