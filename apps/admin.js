import { segment } from "oicq";
import fs from "fs";
import { Character } from "../components/models.js";
import lodash from "lodash";

import { createRequire } from "module";
import { exec } from "child_process";

const require = createRequire(import.meta.url);


//import {wikiCharacter} from "../modules/wiki.js";

export const rule = {
  updateRes: {
    reg: "#喵喵更新素材",
    describe: "【#老婆，#老公，#女儿】角色详情",
  }
};

const _path = process.cwd();
const resPath = `${_path}/plugins/miao-plugin/resources/`;

export async function updateRes(e) {
  if (!e.checkAuth({ auth: "master" })) {
    return true;
  }

  let command = "";
  if (fs.existsSync(`${resPath}/miao-res-plus/`)) {
    command = `git -C ${resPath}/miao-res-plus  pull`;
    exec(command, function (error, stdout, stderr) {
      console.log(stdout);
      if (stdout === "Already up to date.") {
        e.reply("素材已经是最新了~");
      }
      if (error) {
        e.reply("素材初始化失败！\nError code: " + error.code + "\n" + error.stack + "\n出错了，可以重试一下。");
      } else {
        e.reply("额外素材初始化成功");
      }
    });
  } else {
    command = `git clone https://gitee.com/yoimiya-kokomi/miao-res-plus.git ${resPath}/miao-res-plus/`;
    exec(command, function (error, stdout, stderr) {
      if (error) {
        e.reply("素材初始化失败！\nError code: " + error.code + "\n" + error.stack + "\n出错了，可以重试一下。");
      } else {
        e.reply("额外素材初始化成功");
      }
    });
  }

  return true;


}