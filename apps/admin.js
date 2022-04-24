import { segment } from "oicq";
import fs from "fs";
import lodash from "lodash";
import { createRequire } from "module";
import { exec } from "child_process";
import { Cfg } from "../components/index.js";

const require = createRequire(import.meta.url);

let cfgMap = {
  "角色": "char.char",
  "老婆": "char.wife",
  "查他人": "char.queryOther",
  "天赋": "wiki.talent",
  "命座": "wiki.cons",
  "图片": "wiki.pic",
  "深渊": "wiki.abyss",
  "渲染": "sys.scale",
  "帮助": "sys.help",
};
let sysCfgReg = `^#喵喵设置\s*(${lodash.keys(cfgMap).join("|")})?\s*(.*)$`;
export const rule = {
  updateRes: {
    hashMark: true,
    reg: "^#喵喵更新图像$",
    describe: "【#管理】更新素材",
  },
  sysCfg: {
    hashMark: true,
    reg: sysCfgReg,
    describe: "【#管理】系统设置"
  }
};


const _path = process.cwd();
const resPath = `${_path}/plugins/miao-plugin/resources/`;
const plusPath = `${resPath}/miao-res-plus/`;

const checkAuth = async function (e) {
  return await e.checkAuth({
    auth: "master",
    replyMsg: `只有主人才能命令喵喵哦~
    (*/ω＼*)`
  });
}

export async function sysCfg(e, { render }) {
  if (!await checkAuth(e)) {
    return true;
  }

  let cfgReg = new RegExp(sysCfgReg);
  let regRet = cfgReg.exec(e.msg);

  if (!regRet) {
    return true;
  }

  if (regRet[1]) {
    // 设置模式
    let val = regRet[2] || "";

    let cfgKey = cfgMap[regRet[1]];
    if (cfgKey === "sys.scale") {
      val = Math.min(200, Math.max(50, val * 1 || 100));
    } else {
      val = !/关闭/.test(val);
    }

    if (cfgKey) {
      Cfg.set(cfgKey, val);
    }
  }

  let cfg = {
    chars: getStatus("char.char"),
    wife: getStatus("char.wife"),
    other: getStatus("char.queryOther"),
    talent: getStatus("wiki.talent"),
    cons: getStatus("wiki.cons"),
    pic: getStatus("wiki.pic"),
    abyss: getStatus("wiki.abyss"),
    imgPlus: fs.existsSync(plusPath),
    help: getStatus("sys.help", false),
    scale: Cfg.get("sys.scale", 100)
  }

  let base64 = await render("admin", "index", {
    ...cfg,
    cfgScale: Cfg.scale(1.2)
  }, "png");
  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }
  return true;
}

const getStatus = function (rote, def = true) {
  if (Cfg.get(rote, def)) {
    return `<div class="cfg-status" >已开启</div>`;
  } else {
    return `<div class="cfg-status status-off">已关闭</div>`;
  }

}

export async function updateRes(e) {
  if (!await checkAuth(e)) {
    return true;
  }
  let command = "";
  if (fs.existsSync(`${resPath}/miao-res-plus/`)) {
    e.reply("开始尝试更新，请耐心等待~");
    command = `git -C "${resPath}/miao-res-plus" pull`;
    exec(command, function (error, stdout, stderr) {
      console.log(stdout);
      if (/Already up to date/.test(stdout)) {
        e.reply("目前所有图片都已经是最新了~");
        return true;
      }
      let numRet = /(\d*) files changed,/.exec(stdout);
      if (numRet && numRet[1]) {
        e.reply(`报告主人，更新成功，此次更新了${numRet[1]}个图片~`);
        return true;
      }
      if (error) {
        e.reply("更新失败！\nError code: " + error.code + "\n" + error.stack + "\n 请稍后重试。");
      } else {
        e.reply("图片加量包更新成功~");
      }
    });
  } else {
    command = `git clone https://gitee.com/yoimiya-kokomi/miao-res-plus.git "${resPath}/miao-res-plus/"`;
    e.reply("开始尝试安装图片加量包，可能会需要一段时间，请耐心等待~");
    exec(command, function (error, stdout, stderr) {
      if (error) {
        e.reply("角色图片加量包安装失败！\nError code: " + error.code + "\n" + error.stack + "\n 请稍后重试。");
      } else {
        e.reply("角色图片加量包安装成功！您后续也可以通过 #喵喵更新图像 命令来更新图像");
      }
    });
  }
  return true;
}