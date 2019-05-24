# Korea Aerospace Univ. Airbone Software Lab. homepage

http://ec2-13-209-40-215.ap-northeast-2.compute.amazonaws.com:8080/

## :mega: Intro

이 페이지는 **송동호 교수님 웹SW 프로젝트 과목 프로젝트로 만들어진 홈페이지**입니다. <br />
<br />

## 😎 Stack

- Node.js v10.15.0 (express)
- Bootstrap v4.1.3
- ~~jQuery v1.12.4~~ -> Vanilla JS ES6+ (Translating)
- mongoDB
  <br />

## Project execution

```
npm install
sudo service mongodb start
nodemon app.js
```

> Default port number : 8080
> <br />

## Project File structure

- `/models/` : MongoDB Schema File
  - `boardSchema` : board's DB schema
  - `member.js` : members page's DB schema
  - `user.js` : account info (admin, etc..)
- `/public/` : static file folder (such as javaScript files, CSS files, images files etc.)
  - `javascripts/dist` : Compile to ES5 syntax (bc of IE compatibility) - babel 7
  - `robots.txt` : To give instructions about site to web robots
- `/routes/` : Routing specific directory
- `/views/` : View part. EJS is similar with java jsp, Ruby erb

## ETC

- Password encryption method: bcrypt(Password Hash Function)
- When saving a default admin account info, you should save it on `/.env`
