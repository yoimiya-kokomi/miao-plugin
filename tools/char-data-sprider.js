import fs from "fs";
import cheerio from "cheerio";
import lodash from "lodash";
import fetch from "node-fetch";
import {roleId, abbr} from "../../../config/genshin/roleId.js";

const _path = process.cwd();
let roleIdMap = {};
lodash.forEach(roleId, (names, id) => {
  roleIdMap[names[0]] = id;
});

function getBasic($, name) {
  let ret = {}

  if (name) {
    ret.name = name;
  } else {
    // 采集基础信息
    ret.name = $("#scroll_card_item").next("table").find("tr:first td:eq(1)").text();
  }
  ret.abbr = abbr[ret.name] || ret.name;
  ret.id = roleIdMap[ret.name] || '';

  let basic = $(".data_cont_wrapper table:first");
  let title = function (title) {
    return basic.find(`td:contains('${title}')`).next("td").text();
  }
  ret.title = title("Title");
  ret.star = basic.find(`td:contains('Rarity')`).next("td").find(".sea_char_stars_wrap").length;
  let elem = basic.find(`td:contains('Element')`).next("td").find("img").attr("data-src");

  let elemRet = /\/([^\/]*)_35/.exec(elem);
  if (elemRet) {
    ret.elem = elemRet[1];
  }

  ret.allegiance = title("Allegiance");
  ret.weapon = title("Weapon Type");
  ret.britydah = title("Birthday");
  ret.astro = title("Astrolabe Name");
  ret.cncv = title("Chinese Seiyuu");
  ret.jpcv = title("Japanese Seiyuu");
  ret.desc = title("In-game Description");
  return ret;
}

function getStat($) {
  // 采集属性信息
  let stat = $("#beta_scroll_stat").next(".skilldmgwrapper").find("table");
  let attrs = [], idx = 4;
  stat.find("tr:first td:gt(0)").each(function (i) {
    let title = $(this).text();
    if (title === "Ascension") {
      idx = i + 1;
      console.log(idx);
      return false;
    }
    attrs.push($(this).text())
  })
  let lvs = [], lvStat = {};
  stat.find("tr:gt(0)").each(function (i) {
    let tr = $(this), lvl = tr.find("td:first").text();
    lvs.push(lvl);
    let data = [];
    tr.find(`td:lt(${idx})`).each(function (i) {
      if (i > 0) {
        data.push($(this).text())
      }
    })
    lvStat[lvl] = data;
  });
  return {
    lvs,
    stat: attrs,
    detail: lvStat
  };
}

function getTalents($, eq, onlyLv1 = false) {
  let root = $("#beta_scroll_attack_talent");
  let info = root.nextAll(`.item_main_table:eq(${eq})`);

  let name = info.find("tr:first td:eq(1)").text();
  let icon = info.find("tr:first td:first img").attr("data-src");

  // 说明
  let desc = info.find("tr:eq(1) td div.skill_desc_layout").html();
  desc = desc.replace(/<color=[^>]*>/g, "");
  desc = desc.replace(/<\/color=[^>]*>/g, "");
  desc = desc.replace(/<span class=[^>]*>/g, "<strong>");
  desc = desc.replace(/<\/span>/g, "</strong>");
  desc = desc.split("<br>");
  lodash.forEach(desc, (txt, i) => {
    desc[i] = lodash.trim(txt);
  })

  // detail
  let detail = root.nextAll(`.skilldmgwrapper:eq(${eq})`).find("table");
  let lvs = [], details = [];
  detail.find("tr:first td").each(function (i) {
    if (onlyLv1 && i > 1) {
      return false;
    }
    if (i > 0) {
      lvs.push($(this).text())
    }
  });
  detail.find("tr:gt(0)").each(function () {
    let name = $(this).find("td:eq(0)").text();
    let values = [], isSame = true;
    $(this).find("td:gt(0)").each(function (i) {
      if (onlyLv1 && i > 0) {
        return false;
      }
      let val = lodash.trim($(this).text());
      values.push(val);
      if (i > 0 && values[0] !== val) {
        isSame = false;
      }
    });

    details.push({
      name, isSame, values
    })
  });

  return {
    name,
    icon,
    desc,
    tables: details,
    lvs
  }

}

let getPassive = function ($, name) {
  let table = $("#beta_scroll_passive_talent").next("table")
  let ret = [];


  table.find("tr").each(function (idx) {
    if (idx % 2 === 0) {
      let ds = {};
      ds.icon = $(this).find("td:first img").attr("data-src");
      ds.name = $(this).find("td:eq(1)").text();
      ret[idx / 2] = ds;
    } else {
      ret[(idx - 1) / 2].desc = $(this).find("td").text();
    }
  })
  if (name === "莫娜" || name === "神里绫华") {
    ret.push(getTalents($, 2, true))
  }
  return ret;
}

let getCons = function ($) {
  let table = $("#beta_scroll_constellation").next("table")
  let ret = {};
  table.find("tr").each(function (idx) {
    if (idx % 2 === 0) {
      let ds = {};
      ds.icon = $(this).find("td:first img").attr("data-src");
      ds.name = $(this).find("td:eq(1)").text();
      ret[idx / 2 + 1] = ds;
    } else {
      ret[(idx + 1) / 2].desc = $(this).find("td").text();
    }
  })
  return ret;
}

let getImgs = function ($) {
  let cont = $("#scroll_gallery").next(".homepage_index_cont");
  let img = function (idx, _cont) {
    return (_cont || cont).find(`.gallery_content_cont:eq(${idx}) a`).attr("href");
  }
  let card = $("#scroll_name_card").nextAll(".homepage_index_cont:first");
  return {
    face: img(0),
    side: img(1),
    gacha_card: img(2),
    gacha_splash: img(3),
    profile: img(1, card),
    party: img(2, card),
    char: $("#live_data table.item_main_table:first td:first img").attr("data-src")
  }
}

let getCharData = async function (url, key, name = '') {

  url = "https://genshin.honeyhunterworld.com/" + url;
  console.log('req' + key, url)

  let req = await fetch(url);
  let txt = await req.text();

  const $ = cheerio.load(txt);
  let ret = getBasic($, name);

  name = ret.name;

  ret.lvStat = getStat($);
  ret.talent = {
    a: getTalents($, 0),
    e: getTalents($, 1),
    q: getTalents($, name === "莫娜" || name === "神里绫华" ? 3 : 2)
  }
  ret.passive = getPassive($, name);
  ret.cons = getCons($);
  ret.imgs = getImgs($);
  return ret;
}

async function saveCharData(url, key, name) {

  let data = await getCharData(url, key, name);

  name = name || data.name;

  if(!name){
    console.log("角色名不存在"+url);
    return ;
  }

  let charPath = `${_path}/plugins/miao-plugin/resources/meta/character/${data.name}/`
  if (!fs.existsSync(charPath)) {
    fs.mkdirSync(charPath);
  }

  fs.writeFileSync(`${charPath}data.json`, JSON.stringify(data, "", "\t"));
  console.log(data.name + "下载完成");
}

async function down() {
  // const url = "https://genshin.honeyhunterworld.com/db/char/characters/?lang=CHS";
  const url = "https://genshin.honeyhunterworld.com/db/char/unreleased-and-upcoming-characters/?lang=CHS";
  let req = await fetch(url);
  let txt = await req.text();
  let $ = cheerio.load(txt);
  let char = $(".char_sea_cont");

  char.each(async function () {
    let url = $(this).find("a:first").attr("href");
    let keyRet = /\/char\/(\w*)\//.exec(url);


    if (keyRet && keyRet[1]) {
      let key = keyRet[1],
        tRet = /traveler_(girl|boy)_(\w*)/.exec(key),
        name;

      if (tRet) {
        if (tRet[1] === "girl") {
          name = {anemo: "风", geo: "岩", electro: "雷"}[tRet[2]] + "主";
        } else {
          return
        }
      }
      if (key === "heizo") {
        name = "鹿野院平藏"
      }

      await saveCharData(url, key, name);
    }
  });

}

//await saveCharData("https://genshin.honeyhunterworld.com/db/char/ayaka/?lang=CHS", "ayaka");


await down();





