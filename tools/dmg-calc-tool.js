import Profile from "../components/Profile.js";
import Calc from "../components/Calc.js";
import { Character } from "../components/models.js";
import Miao from "../components/profile-data/miao.js";

export async function calcDmg(inputData) {
  let profile = Miao.getAvatarDetail(inputData);
  let char = Character.get(profile);
  return await Calc.calcData({ profile, char, enemyLv: 86 });
}

let testData = {
  "uidData": {
    "kid": 2046882,
    "id": 10000065,
    "uid": 138638352,
    "name": "久岐忍",
    "internalName": "Shinobu",
    "fetterLevel": 7,
    "level": 90,
    "promoteLevel": 6,
    "constellationNum": 4,
    "skill": [
      {
        "id": 10651,
        "name": "普通攻击·忍流飞刃斩",
        "level": 6
      },
      {
        "id": 10652,
        "name": "越祓雷草之轮",
        "level": 12
      },
      {
        "id": 10655,
        "name": "御咏鸣神刈山祭",
        "level": 9
      }
    ],
    "weapon": {
      "id": 11503,
      "rank": 5,
      "icon": "UI_EquipIcon_Sword_Widsith_Awaken",
      "name": "苍古自由之誓",
      "desc": "如同悠古的歌声一般苍蓝的直剑，如同风之国土自由的誓言一般锐利的武器。",
      "affix": 111503,
      "level": 90,
      "affixLevel": 0,
      "promoteLevel": 6
    },
    "reliquarySet": [
      2140040,
      2140041
    ]
  },
  "uidDataCombatValue": {
    "kid": 2046824,
    "roleid": 10000065,
    "uid": 138638352,
    "health": 28460.025390625,
    "attack": 1794.4952392578125,
    "defense": 750.773681640625,
    "critRate": 0.13940000534057617,
    "critDamage": 1.0906000137329102,
    "recharge": 1.103600025177002,
    "elementMastery": 214.78079223632812,
    "heal": 0.5090000033378601,
    "addHurt": {
      "physical": 0,
      "fire": 0,
      "elec": 0.4659999907016754,
      "water": 0,
      "grass": 0,
      "wind": 0,
      "rock": 0,
      "ice": 0
    },
    "baseHP": 12288.654296875,
    "baseATK": 820.4718627929688,
    "baseDEF": 750.773681640625
  },
  "uidDataByReliquary": [
    {
      "kid": 9383961,
      "roleid": 10000065,
      "uid": 138638352,
      "id": 71554,
      "icon": "UI_RelicIcon_14001_5",
      "name": "冰雪故园的终期",
      "rank": 5,
      "type": "时之沙",
      "level": 20,
      "mainAffix": {
        "name": "FIGHT_PROP_ATTACK_PERCENT",
        "value": 0.4659999907016754,
        "score": null
      },
      "appendAffix": [
        {
          "name": "FIGHT_PROP_CRITICAL",
          "value": 0.0272000003606081
        },
        {
          "name": "FIGHT_PROP_HP",
          "value": 448.1300048828125
        },
        {
          "name": "FIGHT_PROP_ATTACK",
          "value": 48.630001068115234
        },
        {
          "name": "FIGHT_PROP_HP_PERCENT",
          "value": 0.1573999971151352
        }
      ]
    },
    {
      "kid": 9383960,
      "roleid": 10000065,
      "uid": 138638352,
      "id": 74523,
      "icon": "UI_RelicIcon_14004_2",
      "name": "少女飘摇的思念",
      "rank": 5,
      "type": "死之羽",
      "level": 20,
      "mainAffix": {
        "name": "FIGHT_PROP_ATTACK",
        "value": 311,
        "score": null
      },
      "appendAffix": [
        {
          "name": "FIGHT_PROP_CHARGE_EFFICIENCY",
          "value": 0.05829999968409538
        },
        {
          "name": "FIGHT_PROP_CRITICAL_HURT",
          "value": 0.2175999917089939
        },
        {
          "name": "FIGHT_PROP_ATTACK_PERCENT",
          "value": 0.11079999804496764
        },
        {
          "name": "FIGHT_PROP_CRITICAL",
          "value": 0.06219999864697456
        }
      ]
    },
    {
      "kid": 9383963,
      "roleid": 10000065,
      "uid": 138638352,
      "id": 74533,
      "icon": "UI_RelicIcon_14004_3",
      "name": "少女易逝的芳颜",
      "rank": 5,
      "type": "理之冠",
      "level": 20,
      "mainAffix": {
        "name": "FIGHT_PROP_HEAL_ADD",
        "value": 0.35899999737739563,
        "score": null
      },
      "appendAffix": [
        {
          "name": "FIGHT_PROP_HP",
          "value": 687.1300048828125
        },
        {
          "name": "FIGHT_PROP_CRITICAL_HURT",
          "value": 0.0544000007212162
        },
        {
          "name": "FIGHT_PROP_ATTACK_PERCENT",
          "value": 0.040800001472234726
        },
        {
          "name": "FIGHT_PROP_HP_PERCENT",
          "value": 0.15159999951720238
        }
      ]
    },
    {
      "kid": 9383959,
      "roleid": 10000065,
      "uid": 138638352,
      "id": 74543,
      "icon": "UI_RelicIcon_14004_4",
      "name": "远方的少女之心",
      "rank": 5,
      "type": "生之花",
      "level": 20,
      "mainAffix": {
        "name": "FIGHT_PROP_HP",
        "value": 4780,
        "score": null
      },
      "appendAffix": [
        {
          "name": "FIGHT_PROP_ELEMENT_MASTERY",
          "value": 16.31999969482422
        },
        {
          "name": "FIGHT_PROP_CRITICAL_HURT",
          "value": 0.147599995136261
        },
        {
          "name": "FIGHT_PROP_HP_PERCENT",
          "value": 0.19819999858736992
        },
        {
          "name": "FIGHT_PROP_CHARGE_EFFICIENCY",
          "value": 0.04529999941587448
        }
      ]
    },
    {
      "kid": 9383962,
      "roleid": 10000065,
      "uid": 138638352,
      "id": 74514,
      "icon": "UI_RelicIcon_14004_1",
      "name": "少女片刻的闲暇",
      "rank": 5,
      "type": "空之杯",
      "level": 20,
      "mainAffix": {
        "name": "FIGHT_PROP_ELEC_ADD_HURT",
        "value": 0.4659999907016754,
        "score": null
      },
      "appendAffix": [
        {
          "name": "FIGHT_PROP_HP_PERCENT",
          "value": 0.08740000054240227
        },
        {
          "name": "FIGHT_PROP_CRITICAL_HURT",
          "value": 0.17100000008940697
        },
        {
          "name": "FIGHT_PROP_ATTACK_PERCENT",
          "value": 0.093299999833107
        },
        {
          "name": "FIGHT_PROP_ATTACK",
          "value": 31.1200008392334
        }
      ]
    }
  ],
  "status": 0
};

let testRet = await calcDmg(testData);
console.log(testRet);