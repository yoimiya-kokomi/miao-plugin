import express from 'express'
import template from 'express-art-template'
import fs from 'fs'
import lodash from 'lodash'

/*
* npm run app web-debug开启Bot后
* 可另外通过 npm run web 开启浏览器调试
* 访问 http://localhost:8000/ 即可看到对应页面
* 页面内的资源需使用 {{_res_path}}来作为resources目录的根目录
* 可编辑模板与页面查看效果
* todo: 预览页面的热更
*
* */

let app = express()

let _path = process.cwd()

app.engine('html', template)
app.set('views', _path + '/resources/')
app.set('view engine', 'art')
app.use(express.static(_path + '/resources'))
app.use('/plugins', express.static('plugins'))

app.get('/', function (req, res) {
  let fileList = fs.readdirSync(_path + '/data/ViewData/') || []
  console.log(fileList)
  let html = [
    '在npm run web-dev模式下触发截图消息后，可在下方选择页面进行调试',
    '如果页面内资源路径不正确请使用{{_res_path}}作为根路径，对应之前的../../../../',
    '可直接修改模板html或css刷新查看效果'
  ]
  let li = {}
  for (let idx in fileList) {
    let ret = /(.+)\.json$/.exec(fileList[idx])
    if (ret && ret[1]) {
      let data = JSON.parse(fs.readFileSync(_path + '/data/ViewData/' + ret[1] + '.json', 'utf8'))
      let text = [(data._app || 'genshin'), ret[1]]
      if (data._plugin) {
        text.unshift(data._plugin)
      }
      li[text.join('')] = (`<li style="font-size:18px; line-height:30px;"><a href="/${ret[1]}">${text.join(' / ')}</a></li>`)
    }
  }
  res.send(html.join('</br>') + '<ul>' + lodash.values(li).join('') + '</ul>')
})

app.get('/:type', function (req, res) {
  let page = req.params.type
  if (page == 'favicon.ico') {
    return res.send('')
  }
  let data = JSON.parse(fs.readFileSync(_path + '/data/ViewData/' + page + '.json', 'utf8'))
  data = data || {}
  data._res_path = ''
  data._sys_res_path = data._res_path

  let app = data._app || 'genshin'
  if (data._plugin) {
    data._res_path = `/plugins/${data._plugin}/resources/`
    data.pluResPath = data._res_path
  }
  let htmlPath = ''
  if (data._plugin === 'genshin') {
    console.log(htmlPath)
    htmlPath = 'html/'
  }
  let tplPath = `${app}/${htmlPath}${page}/${page}.html`
  if (data._plugin) {
    console.log(data._plugin, app, htmlPath, page)
    tplPath = `../plugins/${data._plugin}/resources/${htmlPath}/${app}/${page}.html`
  } else if (data._no_type_path) {
    tplPath = `${app}/${page}.html`
  }
  res.render(tplPath, data)
})

app.listen(8000)
console.log('页面服务已启动，触发消息图片后访问 http://localhost:8000/ 调试页面')
