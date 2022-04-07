import fs from "fs";
import cheerio from "cheerio";
import lodash from "lodash";
import fetch from "node-fetch";

const _path = process.cwd();

let txt = fs.readFileSync(`${_path}/plugins/miao-plugin/tools/test.txt`);

function getBasic($) {
  let ret = {}
  // 采集基础信息
  ret.name = $("#scroll_card_item").next("table").find("tr:first td:eq(1)").text();
  let basic = $(".data_cont_wrapper table:first");
  let title = function (title) {
    return basic.find(`td:contains('${title}')`).next("td").text();
  }
  ret.title = title("Title");
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

function getTalents($, eq) {
  let root = $("#beta_scroll_attack_talent");
  let info = root.nextAll(`.item_main_table:eq(${eq})`);

  let title = info.find("tr:first td:eq(1)").text();
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
    if (i > 0) {
      lvs.push($(this).text())
    }
  });
  detail.find("tr:gt(0)").each(function () {
    let title = $(this).find("td:eq(0)").text();
    let values = [], isSame = true;
    $(this).find("td:gt(0)").each(function (i) {
      let val = $(this).text();
      values.push(val);
      if (i > 0 && values[0] !== val) {
        isSame = false;
      }
    });

    details.push({
      title, isSame, values
    })
  });

  return {
    title,
    icon,
    desc,
    details,
    lvs
  }

}

let getPassive = function ($) {
  let table = $("#beta_scroll_passive_talent").next("table")
  let ret = [];
  table.find("tr").each(function (idx) {
    if (idx % 2 === 0) {
      let ds = {};
      ds.icon = $(this).find("td:first img").attr("data-src");
      ds.title = $(this).find("td:eq(1)").text();
      ret[idx / 2] = ds;
    } else {
      ret[(idx - 1) / 2].desc = $(this).find("td").text();
    }
  })
  return ret;
}

let getCons = function ($) {
  let table = $("#beta_scroll_constellation").next("table")
  let ret = [];
  table.find("tr").each(function (idx) {
    if (idx % 2 === 0) {
      let ds = {};
      ds.icon = $(this).find("td:first img").attr("data-src");
      ds.title = $(this).find("td:eq(1)").text();
      ret[idx / 2] = ds;
    } else {
      ret[(idx - 1) / 2].desc = $(this).find("td").text();
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
    char: $("#live_beta_checker").nextAll(".item_main_table:first").find("tr:first td:first img").attr("data-src")
  }
}

let getCharData = function (url, key, name = '') {


  const $ = cheerio.load(txt);
  let ret = getBasic($);
  if (name) {
    ret.name = name;
  }
  ret.lvStat = getStat($);
  ret.talent = {
    a: getTalents($, 0),
    e: getTalents($, 1),
    q: getTalents($, 2)
  }
  ret.passive = getPassive($);
  ret.cons = getCons($);
  ret.imgs = getImgs($);
}

async function down() {
  const url = "https://genshin.honeyhunterworld.com/db/char/characters/?lang=CHS";
  let req = await fetch(url);
  let txt = await req.text();
  let $ = cheerio.load(txt);
  let char = $(".char_sea_cont:first");

  char.each(function () {
    let url = $(this).find("a:first").attr("href");
    let keyRet = /\/char\/(\w*)\//.exec(url);


    if (keyRet && keyRet[1]) {
      let key = keyRet[1],
        tRet = /traveler_(girl|boy)_(\w*)/.exec(key),
        name;
      if (tRet) {
        if (tRet[1] === "girl") {
          let name = { anemo: "风", geo: "岩", electro: "雷" }[tRet[2]] + "主";
          getCharData(url, key, name);
        } else {
          return
        }
      }
      console.log(url, key);
      //let data = await getCharData(url, key, name)
    }

  });

}

down();





