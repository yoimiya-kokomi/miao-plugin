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
  updateMiaoPlugin: {
    hashMark: true,
    reg: "^#喵喵(强制)?更新",
    describe: "【#管理】喵喵更新",
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
    cfgScale: Cfg.scale(1.4)
  });
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
    command = `git pull`;
    exec(command, { cwd: `${resPath}/miao-res-plus/` }, function (error, stdout, stderr) {
      //console.log(stdout);
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

let timer;

export async function updateMiaoPlugin(e) {
  if (!await checkAuth(e)) {
    return true;
  }
  let isForce = e.msg.includes("强制");
  let command = "git  pull";
  if (isForce) {
    command = "git  checkout . && git  pull";
    e.reply("正在执行强制更新操作，请稍等");
  } else {
    e.reply("正在执行更新操作，请稍等");
  }
  exec(command, { cwd: `${_path}/plugins/miao-plugin/` }, function (error, stdout, stderr) {
    //console.log(stdout);
    if (/Already up to date/.test(stdout)) {
      e.reply("目前已经是最新版了~");
      return true;
    }
    if (error) {
      e.reply("更新失败！\nError code: " + error.code + "\n" + error.stack + "\n 请稍后重试。");
      return true;
    }
    e.reply("更新成功，尝试重新启动Yunzai以应用更新...");
    timer && clearTimeout(timer);
    redis.set("miao:restart-msg", JSON.stringify({
      msg: "重启成功，新版喵喵Plugin已经生效",
      qq: e.user_id
    }), { EX: 30 });
    timer = setTimeout(function () {
      let command = "npm run restart";
      exec(command, function (error, stdout, stderr) {
        if (error) {
          if (/Yunzai not found/.test(error)) {
            e.reply("自动重启失败，请手动重启以应用新版喵喵。请使用 npm run start 命令启动Yunzai-Bot");
          } else {
            e.reply("重启失败！\nError code: " + error.code + "\n" + error.stack + "\n 请稍后重试。");
          }
          return true;
        }
      })
    }, 1000);

  });
  return true;
}