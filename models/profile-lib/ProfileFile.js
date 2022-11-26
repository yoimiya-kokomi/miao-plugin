import fs from 'node:fs'
import { Data } from '../../components/index.js'
import lodash from 'lodash'

const _path = process.cwd()
const userPath = `${_path}/data/UserData/`
if (!fs.existsSync(userPath)) {
  fs.mkdirSync(userPath)
}

let ProfileFile = {
  getData (uid) {
    let data = Data.readJSON('/data/UserData', 'root')
    if (data && data.chars) {
      return data
    } else {
      return {
        uid,
        chars: {}
      }
    }
  },
  saveData (profile) {
    let userData = {}
    const userFile = `${userPath}/${uid}.json`
    if (fs.existsSync(userFile)) {
      userData = JSON.parse(fs.readFileSync(userFile, 'utf8')) || {}
    }
    lodash.assignIn(userData, lodash.pick(data, 'uid,name,lv,avatar'.split(',')))
    userData.chars = userData.chars || {}
    lodash.forEach(data.chars, (char, charId) => {
      userData.chars[charId] = char
    })
    fs.writeFileSync(userFile, JSON.stringify(userData), '', ' ')
    return data
  }
}
export default ProfileFile