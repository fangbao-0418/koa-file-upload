/*
 * @Author: fangbao
 * @Date: 2020-05-05 22:51:31
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-27 14:15:26
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/fangbao/node/koa-file-upload/server/app.js
 */
const Koa = require('koa');
const path = require('path')
const app = new Koa();
const koaBody = require('koa-body');
const logger = require('koa-logger');
const fs = require('fs');
/**
 * querystring 模块提供用于解析和格式化 URL 查询字符串的实用工具。 它可以使用以下方式访问：
 * http://nodejs.cn/api/querystring.html#querystring_querystring_encode
 */
const querystring = require('querystring');
const root = path.resolve(__dirname, '../client');

app.use(logger());
app.use(require('koa-static')(root));
app.use(koaBody({ multipart: true }));

app.use(async ctx => {
  const url = ctx.request.url
  switch (url) {
    case '/api/upload':
      const file = ctx.request.files.file
      const filename = file.name
      const dest = path.resolve(__dirname, `../.temp/${filename}`)
      console.log(dest, 'dest')
      console.log(file.path, 'file path')
      fs.copyFile(file.path, dest, (err, data) => {
        console.log(err, data, 'err')
      });

      ctx.body = 'uploaded'
      break
    case '/api/export':
      ctx.set('Access-Control-Allow-Origin', '*')
      ctx.set('Access-Control-Allow-Headers', 'Authorization,token')
      /** 跨域获取response headers */
      ctx.set('Access-Control-Expose-Headers', 'Content-Disposition,token')
      ctx.set('token', 'abc')
      const filePath = path.resolve(__dirname, `../.temp/商品导出.xlsx`)
      // 
      ctx.attachment(querystring.escape('速度速度.xlsx'))
      const data = await fs.readFileSync(filePath, (err, data) => {
        if (err) throw err;
        console.log(data, 'read data');
        return data
        // return
      })
      // 设置response header
      // ctx.set('Content-disposition', 'attachment;filename=%E4%B8%8A%E6%9E%B6%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BFPI20052710572200406503.xlsx');
      ctx.body = data
      break
    default:
      ctx.throw(400, 'error')
      break
  }
});

app.listen(3009);