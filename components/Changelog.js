import fs from "fs";
import lodash from "lodash";

const _path = process.cwd();
const _logPath = `${_path}/plugins/miao-plugin/CHANGELOG.md`;

let logs = {};
let changelogs = [];
let currentVersion;
let versionCount = 2;
try {
  if (fs.existsSync(_logPath)) {
    logs = fs.readFileSync(_logPath, "utf8") || "";
    logs = logs.split("\n");
    lodash.forEach(logs, (line) => {
      if (versionCount === -1) {
        return false;
      }
      let versionRet = /^#\s*([0-9\\.]+)\s*$/.exec(line);
      if (versionRet && versionRet[1]) {
        let v = versionRet[1];


        if (!currentVersion) {
          currentVersion = v;
        }
        versionCount--;
        versionCount === 0 && changelogs.push(" ");
        versionCount > -1 && changelogs.push(`【 版本: ${v} 】`)

        return;
      }
      if (versionCount > -1) {
        line = line.replace(/`/g, "");
        if (line.trim()) {
          changelogs.push(line);
        }
      }
    });
  }
} catch (e) {
  // do nth
}

export { currentVersion, changelogs };