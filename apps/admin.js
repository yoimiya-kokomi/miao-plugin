export async function userStat(e) {

  if (!e.isMaster) {
    // e.reply("暂无权限");
    return;
  }
  let ret = /\d+/.exec(e.msg)

  if (ret && ret[0]) {

    if (ret[0] * 1 < 100) {
      let msg = [];
      let keys = Object.keys(NoteCookie).reverse().slice(0, ret[0] * 1);
      for (let idx in keys) {
        msg.push(`QQ${keys[idx]},UID${NoteCookie[keys[idx]].uid}\n`)
      }
      e.reply(msg);
    } else {
      if (NoteCookie && NoteCookie[ret[0]]) {
        e.reply(`QQ${ret[0]}的UID是 ${NoteCookie[ret[0]].uid}`);
      } else {
        e.reply(`未查找到${ret[0]}`)
      }
    }
  } else {

    let count = Object.keys(NoteCookie).length
    e.reply(`共有 ${count} 个用户`)
  }
}

export async function rebuildCookie(e) {
  if (!e.isMaster) {
    return;
  }
  let count = 0;
  for (let qq in NoteCookie) {
    let uid = NoteCookie[qq].uid;
    if (uid) {
      redis.set(`genshin:uid:${qq}`, uid, { EX: 2592000 });
      redis.set(`genshin:qq-uid:${qq}`, uid, { EX: 2592000 });
      redis.set(`genshin:uid-qq:${uid}`, qq, { EX: 2592000 });
      count++;
    }
  }
  e.reply(`重建${count}个缓存`)
}
