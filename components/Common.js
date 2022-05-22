import { Cfg } from "./index.js";
import { segment } from "oicq";
import { currentVersion, yunzaiVersion } from "./Changelog.js";

export const render = async function (path, params, cfg) {
  let paths = path.split("/");
  let { render, e } = cfg;
  let _layout_path = process.cwd() + "/plugins/miao-plugin/resources/common/layout/";
  let base64 = await render(paths[0], paths[1], {
    ...params,
    _layout_path,
    defaultLayout: _layout_path + "default.html",
    elemLayout: _layout_path + "elem.html",
    sys: {
      scale: Cfg.scale(cfg.scale || 1),
      copyright: `Created By Yunzai-Bot<span class="version">${yunzaiVersion}</span> & Miao-Plugin<span class="version">${currentVersion}</span>`
    }
  });

  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }

  return true;
}


export default {
  render,
  cfg: Cfg.get,
  isDisable: Cfg.isDisable
};