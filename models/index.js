import fs from 'node:fs'

import Base from './Base.js'
import Character from './Character.js'
import Artifact from './Artifact.js'
import ArtifactSet from './ArtifactSet.js'
import Abyss from './Abyss.js'
import Player from './Player.js'
import Avatar from './Avatar.js'
import ProfileDmg from './ProfileDmg.js'
import ProfileRank from './ProfileRank.js'
import Material from './Material.js'
import Weapon from './Weapon.js'
import User from './User.js'
import MysApi from './MysApi.js'

for (let game of ['gs', 'sr']) {
  for (let type of ['artifact', 'character', 'material', 'weapon']) {
    let file = `./plugins/miao-plugin/resources/meta-${game}/${type}/index.js`
    if (fs.existsSync(file)) {
      try {
        await import(`file://${process.cwd()}/${file}`)
      } catch (e) {
        console.log(e)
      }
    }
  }
}

export {
  Base,
  Abyss,
  Character,
  Artifact,
  ArtifactSet,
  Avatar,
  ProfileDmg,
  ProfileRank,
  Material,
  Weapon,
  User,
  MysApi,
  Player
}


