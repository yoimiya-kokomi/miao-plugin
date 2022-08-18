# Miao-Plugin说明

Miao-Plugin是一个Yunzai-Bot的升级插件，提供包括角色查询等升级功能。

具体功能可在安装插件后 通过 #喵喵帮助 进行查看。如需进行设置可通过 #喵喵设置 命令进行管理。

---

# 安装与更新

请将miao-plugin放置在Yunzai-Bot的plugins目录下，重启Yunzai-Bot后即可使用。

推荐使用git进行安装，以方便后续升级。在Yunzai根目录夹打开终端，运行

```
// 使用gitee
git clone https://gitee.com/yoimiya-kokomi/miao-plugin.git ./plugins/miao-plugin/

// 使用github
git clone https://github.com/yoimiya-kokomi/miao-plugin.git ./plugins/miao-plugin/
```

进行安装。建议使用上述命令进行安装，以便于后续更新。 管理员发送`#喵喵更新`即可自动更新

如果是手工下载的zip压缩包，请将解压后的miao-plugin文件夹（请删除压缩自带的-master后缀）放置在Yunzai目录下的plugins文件夹内。

## Yunzai版本与支持

### V2-Yunzai

在V3整体稳定前，推荐使用V2版Yunzai安装miao-plugin。 由于官方Yunzai已经停止更新，可使用喵喵版V2-Yunzai

在Yunzai根目录夹打开终端，运行

```
// 使用gitee
git remote set-url origin https://gitee.com/yoimiya-kokomi/Yunzai-Bot

// 使用github
git remote set-url origin https://github.com/yoimiya-kokomi/Yunzai-Bot
```

即可切换Yunzai远程仓库地址，运行git pull拉取更新即可使用喵喵版V2-Yunzai（版本>2.2.0)

V2-Yunzai在较长一段时间内会维持更新，进行一些Bugfix及更新卡池等信息

### V3-Yunzai

目前V3-Yunzai正在重构中，具体可参见 [Yunzai-V3](https://github.com/Le-niao/Yunzai-Bot) ，miao-plugin已经初步支持V3版本Yunzai，可直接使用。

由于miao-plugin对V3-Yunzai正在适配中，部分功能可能尚未适配或工作不正常，如遇问题可通过issue提报

[issue#13](https://github.com/yoimiya-kokomi/miao-plugin/issues/74) : 如启动时报 Cannot find package 'image-size'
的错误，直接在yunzai根目录下`pnpm add image-size -w` 或使用cnpm、npm等包管理工具安装image-size库即可

---

# 功能说明

## #雷神面板

### #更新面板

`#更新面板` 依赖于面板查询API，面板服务由 http://enka.shinshin.moe/ 提供

查询功能经Enka官方授权([issue#63](https://github.com/yoimiya-kokomi/miao-plugin/issues/63#issuecomment-1199348789))，感谢Enka提供的面板查询服务

如果可以的话，也请在Patreon上支持Enka，或提供闲置的原神账户，具体可在[Enka官网](http://enka.shinshin.moe/) Discord联系

[issue#63](https://github.com/yoimiya-kokomi/miao-plugin/issues/63#issuecomment-1199734496) :
国内网络如Enka服务访问不稳定，可尝试更换 [@MiniGrayGay](https://github.com/MiniGrayGay) 大佬提供的中转服务 复制`config/profile_default.js`
为`config/profile.js`，修改其中enkaApi的url配置，配置完成后重启Bot即可生效

* 【链接1】：https://enka.microgg.cn/
* 【链接2】：https://enka.minigg.cn/

### #雷神伤害

喵喵面板附带的伤害计算功能由喵喵本地计算。如计算有偏差 #雷神伤害 查看伤害加成信息，如确认伤害计算有误可提供伤害录屏截图及uid进行反馈

### #雷神圣遗物

圣遗物评分为喵喵版评分规则

---

其余文档咕咕咕中

---

# 免责声明

1. 功能仅限内部交流与小范围使用，请勿将Yunzai-Bot及Miao-Plugin用于以盈利为目的的场景
3. 图片与其他素材均来自于网络，仅供交流学习使用，如有侵权请联系，会立即删除

# 其他

* [官方Yunzai-Bot-V3](https://github.com/Le-niao/Yunzai-Bot) : [Gitee](https://gitee.com/Le-niao/Yunzai-Bot)
  / [Github](https://github.com/Le-niao/Yunzai-Bot)
* [喵喵Yunzai-Bot-V2](https://github.com/Le-niao/Yunzai-Bot) : [Gitee](https://gitee.com/yoimiya-kokomi/Yunzai-Bot)
  / [Github](https://github.com/yoimiya-kokomi/Yunzai-Bot)
* [喵喵插件 Miao-Plugin](https://github.com/yoimiya-kokomi/miao-plugin) : [Gitee](https://gitee.com/yoimiya-kokomi/miao-plugin)
  / [Github](https://github.com/yoimiya-kokomi/miao-plugin)
* [Enka](https://enka.network/): 感谢Enka提供的面板服务
* [Snap.Genshin](https://www.snapgenshin.com/home/) : 感谢 DGP Studio
  开发的 [胡桃API](https://github.com/DGP-Studio/Snap.HutaoAPI)
* QQ群（暂时停止新加入，请见谅）
    * Yunzai-Bot 官方QQ群：213938015
    * 喵喵Miao-Plugin QQ群：607710456
* [爱发电](https://afdian.net/@kokomi) 欢迎老板打赏，喵~

