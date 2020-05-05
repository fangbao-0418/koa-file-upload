/*
 * @Author: fangbao
 * @Date: 2020-05-05 22:51:31
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-06 00:09:42
 * @FilePath: /eslint-plugin-xt-react/Users/fb/Documents/xituan/file-upload/server/app.js
 */
const Koa = require('koa');
const path = require('path')
const app = new Koa();
const koaBody = require('koa-body');
const logger = require('koa-logger');
const fs = require('fs')

const root = path.resolve(__dirname, '../client');

app.use(logger());
app.use(require('koa-static')(root));
app.use(koaBody({ multipart: true }));

app.use(async ctx => {
  const url = ctx.request.url
  switch (url) {
    case '/api/upload':
      console.log(ctx.request, 'hello world2')
      const file = ctx.request.files.file

      // console.log(file, 'file')

      fs.readFile(file.path, (err, data) => {
        if (err) throw err;
        console.log(data, 'file data');
      });

      const filename = file.name
      const dest = path.resolve(__dirname, `../.temp/${filename}`)
      fs.copyFile(file.path, dest, (err, data) => {
        // console.log(err, data, 'err')
      });

      ctx.body = 'uploaded'
      break
    default:
      // ctx.body = 'Hello World';
      ctx.throw(400, 'name required')
      break
  }
  // ctx.body = 'Hello World';
});

app.listen(3000);