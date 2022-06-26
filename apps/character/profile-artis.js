/*
* 角色圣遗物评分详情
*
* */
import lodash from "lodash";
import { Profile, Common, Models, Format } from "../../components/index.js";
import { getTargetUid, profileHelp } from "./profile-common.js";
import { Character, Artifact } from "../../components/models.js";

/*
* 角色圣遗物面板
* */
export async function profileArtis(e, { render }) {
  let { uid, avatar } = e;

  let profile = await Profile.get(uid, avatar);
  let char = Character.get(profile.name);

  let charCfg = Artifact.getCharCfg(profile.name);
  let { artis, totalMark, totalMarkClass, usefulMark } = getArtis(profile.name, profile.artis);
  let { attrMap } = Artifact.getMeta();

  //渲染图像
  return await Common.render("character/artis-mark", {
    uid,
    elem: char.elem,
    data: profile,
    artis,
    totalMark,
    totalMarkClass,
    usefulMark,
    attrMap,
    charCfg
  }, { e, render, scale: 1.3 });
}

/*
* 圣遗物列表
* */
export async function profileArtisList(e, { render }) {

  let uid = await getTargetUid(e);
  if (!uid) {
    return true;
  }

  let artis = [],
    profiles = Profile.getAll(uid) || {};

  if (!profiles || profiles.length === 0) {
    e.reply("暂无角色圣遗物详情");
    return true;
  }


  lodash.forEach(profiles || [], (ds) => {
    let name = ds.name;
    if (!name || name === "空" || name === "荧") {
      return;
    }

    let usefulMark;

    let charCfg = Artifact.getCharCfg(name);
    usefulMark = charCfg.titleWeight;

    /* 处理圣遗物 */
    if (ds.artis) {
      let newScore = Artifact.getArtisMark(name, ds.artis);

      lodash.forEach(ds.artis, (arti, idx) => {
        if (!arti.name) {
          return;
        }
        idx = idx.replace("arti", "");
        let mark = newScore[idx];
        let maxMark = Artifact.getMaxMark(name, arti.main[0] || "");
        arti.mark = Format.comma(mark, 1);
        arti._mark = mark;
        arti.markClass = Artifact.getMarkClass(mark);
        arti.main = Artifact.formatArti(arti.main);
        arti.attrs = Artifact.formatArti(arti.attrs);
        arti.usefulMark = usefulMark;
        arti.avatar = name;
        artis.push(arti);
      })
    }
  });

  if (artis.length === 0) {
    e.reply("请先获取角色面板数据后再查看圣遗物列表...");
    await profileHelp(e);
    return true;
  }
  artis = lodash.sortBy(artis, "_mark");
  artis = artis.reverse();
  artis = artis.slice(0, 28);

  //渲染图像
  return await Common.render("character/artis", {
    save_id: uid,
    uid: uid,
    artis,
  }, { e, render, scale: 1.4 });
}


/*
* 获取圣遗物评分及详情
* */
export function getArtis(char, artisData) {
  let charCfg = Artifact.getCharCfg(char);
  let newScore = Artifact.getArtisMark(char, artisData);
  let totalMark = 0;
  let artis = [];

  lodash.forEach(artisData, (arti, idx) => {
    idx = idx.replace("arti", "");
    let ds = arti;
    let mark = newScore[idx];
    totalMark += mark;
    ds.mark = Format.comma(mark, 1);
    ds.markClass = Artifact.getMarkClass(mark);
    ds.main = Artifact.formatArti(arti.main, charCfg.mark, true);
    ds.attrs = Artifact.formatArti(arti.attrs, charCfg.mark, false);
    artis[idx * 1 - 1] = ds;
  });

  return {
    artis,
    totalMark,
    totalMarkClass: Artifact.getMarkClass(totalMark / 5),
    usefulMark: charCfg.titleWeight
  }
}

function formatArti(ds) {
  let ret = Profile.formatArti(ds);
}
