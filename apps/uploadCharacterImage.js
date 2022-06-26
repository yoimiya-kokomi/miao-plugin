import { segment } from "oicq";
import fetch from "node-fetch";
import fs from "fs";
import Data from "../components/Data.js";
import { Character } from "../components/models.js";
import lodash from "lodash";
import { promisify } from "util";
import { pipeline } from "stream";


const rootPath = process.cwd() + "/plugins/miao-plugin/";
let regex = /^#*喵喵(上传|添加)(.+)写真.*$/;

export const rule = {
  uploadCharacterImage: {
    hashMark: true,
    reg: "^#*喵喵(上传|添加)(.+)写真.*$",
    describe: "喵喵上传角色写真",
  },
};

export async function uploadCharacterImage(e) {
  let promise = await isAllowedToUploadCharacterImage(e);
  if (!promise) {
    return true;
  }

  let imageMessages = [];
  let msg = e.msg;
  let regexResult = regex.exec(msg);
  //通过解析正则获取消息中的角色名
  let characterName = regexResult[2];
  //将消息中的角色名转换为官方名称
  let officialName = Character.get(characterName).name;
  if (officialName === undefined) {
    e.reply("未查询到该角色。请输入有效的角色名或别名。");
    return true;
  }
  console.log("本次要上传的角色是: ", officialName);
  for (let val of e.message) {
    if ("image" === val.type) {
      imageMessages.push(val);
    }
  }
  if (imageMessages.length <= 0) {
    e.reply("消息中未找到图片，无法添加。");
    return true;
  }
  await saveImages(e, officialName, imageMessages);
  return true;
}

async function saveImages(e, officialName, imageMessages) {
  let imgMaxSize = e.groupConfig.imgMaxSize || 1;
  let pathSuffix = "resources/miao-res-plus/character-img/" + officialName;
  let path = rootPath + pathSuffix;

  if (!fs.existsSync(path)) {
    console.log("路径不存在，创建目录: ", path);
    Data.createDir(rootPath, pathSuffix);
  }
  let senderName = lodash.truncate(e.sender.card, { length: 8 });
  for (let val of imageMessages) {
    const response = await fetch(val.url);
    if (!response.ok) {
      e.reply("图片下载失败。");
      return true;
    }
    if (response.headers.get("size") > 1024 * 1024 * imgMaxSize) {
      e.reply([segment.at(e.user_id, senderName), "添加失败：图片太大了。"]);
      return true;
    }
    let fileName = val.file.substring(0, val.file.lastIndexOf("."));
    let fileType = val.file.substring(val.file.lastIndexOf(".") + 1);
    if (response.headers.get("content-type") === "image/gif") {
      fileType = "gif";
    }

    const streamPipeline = promisify(pipeline);
    await streamPipeline(response.body, fs.createWriteStream(`${path}/${fileName}.${fileType}`));
    Bot.logger.mark(`添加成功: ${path}/${fileName}`);
  }
  e.reply([segment.at(e.user_id, senderName), `\n添加${officialName}信息成功。`]);
  return true;
}

async function isAllowedToUploadCharacterImage(e) {
  if (!e.message) {
    return false;
  }
  if (!e.msg) {
    return false;
  }
  if (e.isPrivate) {
    if (!e.isMaster) {
      e.reply(`只有主人才能添加。`);
      return false;
    }
    return true;
  }

  let group_id = e.group_id;
  if (!group_id) {
    return false;
  }
  if (e.groupConfig.imgAddLimit === 2) {
    if (!e.isMaster) {
      e.reply(`只有主人才能添加。`);
      return false;
    }
  }
  if (e.groupConfig.imgAddLimit === 1 && !e.isMaster) {
    if (!(e.sender.role === "owner" || e.sender.role === "admin")) {
      e.reply(`只有管理员才能添加。`);
      return false;
    }
  }
  return true;
}

