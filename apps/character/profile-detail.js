import lodash from "lodash";
import { autoRefresh } from "./profile-common.js";
import { Calc, Common, Format, Models, Profile } from "../../components/index.js";
import { getArtis } from "./profile-artis.js";

const { Character } = Models;

export async function renderProfile(e, char, render, mode = "profile", params = {}) {

  let selfUser = await e.checkAuth({
    auth: "self"
  })

  let { uid } = e;

  if (['荧', '空', '主角', '旅行者'].includes(char.name)) {
    e.reply("暂不支持主角的面板信息查看");
    return true;
  }

  let refresh = async () => {
    let refreshRet = await autoRefresh(e);
    if (refreshRet) {
      await renderProfile(e, char, render, mode, params);
    }
    return refreshRet;
  }

  let profile = await Profile.get(uid, char.id);
  if (!profile) {
    if (await refresh()) {
      return true;
    } else {
      e.reply(`请确认${char.name}已展示在【游戏内】的角色展柜中，并打开了“显示角色详情”。然后请使用 #更新面板\n命令来获取${char.name}的面板详情`);
    }
    return true;
  } else if (!['enka', 'input2', 'miao', 'miao-pre'].includes(profile.dataSource)) {
    if (!await refresh()) {
      e.reply(`由于数据格式升级，请重新获取面板信息后查看`);
    }
    return true;
  }

  let a = profile.attr;
  let c = Format.comma,
    p = Format.pct;
  let attr = {
    hp: c(a.hp),
    hpPlus: c(a.hp - a.hpBase),
    atk: c(a.atk),
    atkPlus: c(a.atk - a.atkBase),
    def: c(a.def),
    defPlus: c(a.def - a.defBase),
    cRate: p(a.cRate),
    cDmg: p(a.cDmg),
    mastery: c(a.mastery),
    recharge: p(a.recharge),
    dmgBonus: p(Math.max(a.dmgBonus * 1 || 0, a.phyBonus * 1 || 0))
  };


  let { artis, totalMark, totalMarkClass, usefulMark } = getArtis(char.name, profile.artis);


  let enemyLv = await selfUser.getCfg(`char.enemyLv`, 91);
  let dmgMsg = [], dmgData = [];
  let dmgCalc = await Calc.calcData({
    profile,
    char,
    enemyLv,
    mode,
    ...params
  });
  if (dmgCalc && dmgCalc.ret) {
    lodash.forEach(dmgCalc.ret, (ds) => {
      ds.dmg = Format.comma(ds.dmg, 0);
      ds.avg = Format.comma(ds.avg, 0);
      dmgData.push(ds);
    })
    lodash.forEach(dmgCalc.msg, (msg) => {
      msg.replace(":", "：");
      dmgMsg.push(msg.split("："))
    })
  }

  if (mode === "dmg") {
    let basic = dmgCalc.dmgCfg.basicRet;
    lodash.forEach(dmgCalc.dmgRet, (row) => {
      lodash.forEach(row, (ds) => {
        ds.val = (ds.avg > basic.avg ? "+" : "") + Format.comma(ds.avg - basic.avg);
        ds.dmg = Format.comma(ds.dmg, 0);
        ds.avg = Format.comma(ds.avg, 0);

      })
    });
    basic.dmg = Format.comma(basic.dmg);
    basic.avg = Format.comma(basic.avg);
  }
  //渲染图像
  return await Common.render("character/detail", {
    save_id: uid,
    uid: uid,
    data: profile,
    attr,
    cons: char.cons,
    name: char.name,
    elem: char.elem,
    talent: char.getAvatarTalent(profile.talent, profile.cons),
    dmgData,
    dmgMsg,
    dmgRet: dmgCalc.dmgRet,
    dmgCfg: dmgCalc.dmgCfg,
    artis,
    enemyLv,
    enemyName: dmgCalc.enemyName || "小宝",
    totalMark: c(totalMark, 1),
    totalMarkClass,
    usefulMark,
    talentMap: { a: "普攻", e: "战技", q: "爆发" },
    bodyClass: `char-${char.name}`,
    mode,
  }, { e, render, scale: 1.6 });
}