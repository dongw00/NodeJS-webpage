const express = require('express');
const router = express.Router();
const BoardContents = require('../models/boardSchema');
const multer = require('multer');
const moment = require('moment');
const upload = multer({ dest: './tmp/' });
const fs = require('fs');

/* init view */
router.get('/', (req, res) => {
  let page = req.query.page;
  if (page == null) page = 1;
  /* 글쓰기 가능 여부를 위한 세션 확인 */
  let canWrite = false;
  if (req.session.user_id != null) canWrite = true;
  let skipSize = (page - 1) * 10;
  const limitSize = 10;
  let pageNum = 1;

  BoardContents.count((err, totalCount) => {
    if (err) throw err;
    pageNum = Math.ceil(totalCount / limitSize);
    BoardContents.find()
      .sort({ date: -1 })
      .skip(skipSize)
      .limit(limitSize)
      .exec((err, pageContents) => {
        if (err) throw err;
        res.render('board/index', {
          user_id: req.session.user_id,
          contents: pageContents,
          pagination: pageNum,
          /* 로그인한 경우만 글쓰기 가능 */
          can_write: canWrite,
        });
      });
  });
});

/* 게시글 Detail view */
router.get('/Detail_view', (req, res) => {
  let contentId = req.query.id;

  BoardContents.findOne({ _id: contentId }, (err, rawContent) => {
    if (err) throw err;
    rawContent.count += 1;

    rawContent.save(err => {
      if (err) throw err;
      res.render('board/components/article', {
        content: rawContent,
      });
    });
  });
});

/* Wrting post */
router.get('/posting', (req, res) => {
  res.render('board/page/posting/index', {
    user_id: req.session.user_id,
  });
});

/* submit */
router.post('/submit', (req, res) => {
  const addNewTitle = req.body.title;
  const addNewWriter = req.body.writer;
  const addNewContents = req.body.contents;
  //const upFile = req.files;
  const addNewSubject = req.body.subject;
  //const addImportant = req.body.important;

  /* 글 add */
  if (req.body.mode == 'add') {
    let newBoardContents = new BoardContents();
    newBoardContents.title = addNewTitle;
    newBoardContents.writer = addNewWriter;
    newBoardContents.contents = addNewContents;
    newBoardContents.subject = addNewSubject;
    newBoardContents.date = moment().format('YYYY MMM Do');

    newBoardContents.save(err => {
      if (err) console.log(err);
      else console.log('success');
    });

    console.log(
      `addNewTitle = ${addNewTitle}
      addNewWriter = ${addNewWriter},
      addNewContents = ${addNewContents},
      addNewSubject = ${addNewSubject}`
    );
    res.redirect('/board');
    // if (isSaved(upFile)) {
    //   addBoard(
    //     addNewTitle,
    //     addNewWriter,
    //     addNewContents,
    //     //upFile,
    //     addNewSubject,
    //     addImportant
    //   );
    //   res.redirect('/board');
    // } else {
    //   console.log('파일이 저장되지 않았습니다!');
    // }
    /* 글 수정 */
  } else if (req.body.mode == 'edit') {
    modBoard(modId, modTitle, modContent);
    res.redirect('/board');
  }
});

router.get('/delete', (req, res) => {
  let contentId = req.params.id;
  BoardContents.update({ _id: contentId }, { $set: { deleted: true } }, err => {
    if (err) throw err;
    res.redirect('/board');
  });
});

router.get('/download/:path', (req, res) => {
  const path = req.params.path;
  res.download('./upload/' + path, path);
  console.log(path);
});

function modBoard(id, title, content) {
  const modContent = content.replace(/\r\n/gi, '\\r\\n');
  BoardContents.findOne({ _id: id }, (err, originContent) => {
    if (err) throw err;
    originContent.updated.push({
      title: originContent.title,
      contents: originContent.contents,
    });
    originContent.save(err => {
      if (err) throw err;
    });
  });
  BoardContents.update(
    { _id: id },
    { $set: { title: title, contents: modContent, date: Date.now() } },
    err => {
      if (err) throw err;
    }
  );
}

function isSaved(upFile) {
  const savedFile = upFile;
  let count = 0;
  if (savedFile != null) {
    // 파일 존재시 -> tmp폴더에 파일 저장여부 확인 -> 있으면 저장, 없으면 에러메시지
    for (let i = 0; i < savedFile.length; i++) {
      if (fs.statSync(getDirname(1) + savedFile[i].path).isFile()) {
        //fs 모듈을 사용해서 파일의 존재 여부를 확인한다.
        count++; // true인 결과 갯수 세서
      }
    }
    if (count == savedFile.length) {
      //올린 파일 갯수랑 같으면 패스
      return true;
    } else {
      // 파일이 다를 경우 false를 리턴함.
      return false;
    }
  } else {
    // 파일이 처음부터 없는 경우
    return true;
  }
}

function getDirname(num) {
  //원하는 상위폴더까지 리턴해줌. 0은 현재 위치까지, 1은 그 상위.. 이런 식으로
  //리네임과, 파일의 경로를 따오기 위해 필요함.
  const order = num;
  const dirname = __dirname.split('/');
  let result = '';

  for (let i = 0; i < dirname.length - order; i++) {
    result += dirname[i] + '/';
  }
  return result;
}

function renameUploadFile(itemId, upFile) {
  // 업로드 할때 리네이밍 하는 곳!
  let renameForUpload = {};
  const newFile = upFile; // 새로 들어 온 파일
  let tmpPath = [];
  let tmpType = [];
  let index = [];
  let rename = [];
  let fileName = [];
  let fullName = []; // 다운로드 시 보여줄 이름 필요하니까 원래 이름까지 같이 저장하자!
  let fsName = [];

  for (let i = 0; i < newFile.length; i++) {
    tmpPath[i] = newFile[i].path;
    tmpType[i] = newFile[i].mimetype.split('/')[1]; // 확장자 저장해주려고!
    index[i] = tmpPath[i].split('/').length;
    rename[i] = tmpPath[i].split('/')[index[i] - 1];
    fileName[i] =
      itemId +
      '_' +
      getFileDate(new Date()) +
      '_' +
      rename[i] +
      '.' +
      tmpType[i]; // 파일 확장자 명까지 같이 가는 이름 "글아이디_날짜_파일명.확장자"
    fullName[i] = fileName[i] + ':' + newFile[i].originalname.split('.')[0]; // 원래 이름까지 같이 가는 이름 "글아이디_날짜_파일명.확장자:보여줄 이름"
    fsName[i] = getDirname(1) + 'upload/' + fileName[i]; // fs.rename 용 이름 "./upload/글아이디_날짜_파일명.확장자"
  }
  renameForUpload.tmpname = tmpPath;
  renameForUpload.filename = fileName;
  renameForUpload.fullname = fullName;
  renameForUpload.fsname = fsName;
  return renameForUpload;
}

function getFileDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const fullDate =
    year + '' + month + '' + day + '' + hour + '' + min + '' + sec;
  return fullDate;
}

module.exports = router;
