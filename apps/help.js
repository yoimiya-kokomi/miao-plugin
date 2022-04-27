import { Cfg } from "../components/index.js";
import { segment } from "oicq";
import lodash from "lodash";
import { currentVersion, changelogs } from "../components/Changelog.js";
import common from "../../../lib/common.js";

const _path = process.cwd();
const helpFilePath = `${_path}/plugins/miao-plugin/resources/help/help-list.js`;

export async function help(e, { render }) {

  if (!/喵喵/.test(e.msg) && !Cfg.get("sys.help", false)) {
    return false;
  }

  let helpFile = {};
  helpFile = await import(`file://${helpFilePath}?version=${new Date().getTime()}`);

  const { helpCfg } = helpFile;
  let helpGroup = [];

  lodash.forEach(helpCfg, (group) => {
    if (group.auth && group.auth === "master" && !e.isMaster) {
      return;
    }


    lodash.forEach(group.list, (help) => {
      let icon = help.icon * 1;
      if (!icon) {
        help.css = `display:none`;
      } else {
        let x = (icon - 1) % 10, y = (icon - x - 1) / 10;
        help.css = `background-position:-${x * 50}px -${y * 50}px`;
      }

    });

    helpGroup.push(group);
  });

  let base64 = await render("help", "index", {
    helpCfg: helpGroup,
    cfgScale: Cfg.scale(1.2)
  });
  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }
  return true;
}

export async function versionInfo(e) {
  let msgs = [`当前喵喵版本: ${currentVersion}`, ...changelogs];
  e.reply(msgs.join("\n"));
  return true;
}