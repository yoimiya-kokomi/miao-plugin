import fs from "fs";
import lodash from "lodash";

const _path = process.cwd();
const _logPath = `${_path}/plugins/miao-plugin/CHANGELOG.md`;

let logs = {};
let changelogs = [];
let currentVersion;
let isNew = 1;
let lastVersion = await redis.get("miao:last-version");
try {
  if (fs.existsSync(_logPath)) {
    logs = fs.readFileSync(_logPath, "utf8") || "";
    logs = logs.split("\n");


    lodash.forEach(logs, (line) => {
      if (isNew === -1) {
        return false;
      }
      let versionRet = /^#\s*([0-9\\.]+)\s*$/.exec(line);
      if (versionRet && versionRet[1]) {
        let v = versionRet[1];
        if (!currentVersion) {
          currentVersion = v;
        }
        if (v === lastVersion) {
          isNew = 0;
        } else if (isNew === 0) {
          isNew = -1;
        }
        return;
      }
      if (isNew > -1) {
        changelogs.push(line);
      }
    });
    redis.set("miao:last-version", currentVersion, { EX: 3600 * 24 * 300 });
  }
} catch (e) {
  // do nth
}

export { currentVersion, changelogs };