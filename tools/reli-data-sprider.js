import fs from "fs";
import cheerio from "cheerio";
import lodash from "lodash";
import fetch from "node-fetch";

const _path = process.cwd();

const artiIdx = {
  Flower: 1,
  Plume: 2,
  Sands: 3,
  Goblet: 4,
  Circlet: 5
}

let getCharData = async function (url, key, name = '') {

  url = "https://genshin.honeyhunterworld.com/" + url;
  console.log('req' + key, url)

  let req = await fetch(url);
  let txt = await req.text();

  const $ = cheerio.load(txt);
  let ret = getBasic($, name);

  name = ret.name;

  return ret;
}

async function saveCharData(url, key, name) {

  let data = await getCharData(url, key, name);

  name = name || data.name;

  if (!name) {
    console.log("角色名不存在" + url);
    return;
  }

  let charPath = `${_path}/plugins/miao-plugin/resources/meta/character/${data.name}/`
  if (!fs.existsSync(charPath)) {
    fs.mkdirSync(charPath);
  }

  fs.writeFileSync(`${charPath}data.json`, JSON.stringify(data, "", "\t"));
  console.log(data.name + "下载完成");
}

function getEffect(txt) {
  let regRet = /(\d) Piece:/.exec(txt);
  if (regRet) {
    return [regRet[1], txt.replace(regRet[0], "").trim().replace(/。$/, "")]
  }
  return [];
}

async function getSets(id) {
  const url = `https://genshin.honeyhunterworld.com/db/art/family/a_${id}/?lang=CHS`;
  let req = await fetch(url);
  let txt = await req.text();
  fs.writeFileSync("./test.html", txt);
  let $ = cheerio.load(txt);

  let sets = $(".wrappercont .add_stat_table:eq(0)");
  let ret = {}

  sets.find("td").each(function () {
    let line = $(this);
    let nRet = /\s*(.*?)\s+\(([^\s]+)/.exec(line.find("span").text());
    let idRet = /a_(\d+)/.exec(line.find("a").attr("href"));
    if (nRet && idRet) {
      ret[`arti${artiIdx[nRet[2]]}`] = {
        id: idRet[1],
        name: nRet[1]
      }
    }
  })
  return ret;
}

async function down() {
  const url = "https://genshin.honeyhunterworld.com/db/artifact/?lang=CHS";
  let req = await fetch(url);
  let txt = await req.text();
  let $ = cheerio.load(txt);
  let char = $(".art_stat_table_new");

  let ret = {}
  let tmp = {};

  char.each(function () {
    let trs = $(this).find("tr:gt(0)");
    trs.each(function (idx) {
      let self = $(this);
      if (idx % 2 === 0) {
        let na = self.find("td:eq(2) a")
        let idRet = /a_(\d+)/.exec(na.attr("href"))
        if (idRet) {
          tmp = {
            id: idRet[1],
            name: na.text(),
            sets: {},
            effect: {}
          }
        } else {
          tmp = {effect: {}}
        }
      }
      let et = getEffect(self.find(`td:eq(${idx % 2 === 0 ? 4 : 1})`).text());
      if (et && et[0]) {
        tmp.effect[et[0]] = et[1];
      }
      if (idx % 2 === 1 && tmp.id) {
        ret[tmp.id] = tmp;
      }
    })
  });

  for (let idx in ret) {
    let ds = ret[idx];

    ds.sets = await getSets(ds.id);
    console.log(`arti ${ds.id}:${ds.name} Done`);
  }

  let filePath = `${_path}/plugins/miao-plugin/resources/meta/reliquaries/`
  fs.writeFileSync(`${filePath}data.json`, JSON.stringify(ret, "", "\t"));
}

//await saveCharData("https://genshin.honeyhunterworld.com/db/char/ayaka/?lang=CHS", "ayaka");


await down();





