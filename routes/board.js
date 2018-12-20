const express = require('express');
const router = express.Router();
const BoardContents = require('../models/boardSchema');
const multer = require('multer');
const moment = require('moment');
const upload = multer({ dest: './tmp/' });
/*let _storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './tmp/');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: _storage });
*/
const fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/KAU';

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
  const boardNum = req.query.boardNum;
  let important;

  /* 공지사항 */
  BoardContents.find({ subject: boardNum, important: 1 })
    .sort({ date: -1 })
    .exec((err, impContents) => {
      if (err) throw err;
      important = impContents;
    });

  /* rendering */
  BoardContents.count((err, totalCount) => {
    if (err) throw err;
    pageNum = Math.ceil(totalCount / limitSize);
    BoardContents.find({ subject: boardNum, important: 0 })
      .sort({ date: -1 })
      .skip(skipSize)
      .limit(limitSize)
      .exec((err, pageContents) => {
        if (err) throw err;
        res.render('board/index', {
          user_id: req.session.user_id,
          contents: pageContents,
          impContents: important,
          pagination: pageNum,
          can_write: canWrite,
        });
      });
  });
});

/* 게시글 Detail view */
router.get('/Detail_view', (req, res) => {
  BoardContents.findOne({ _id: req.query.id }, (err, rawContent) => {
    if (err) throw err;
    rawContent.count++;
    rawContent.save(err => {
      if (err) throw err;
      res.render('board/page/viewPage/index', {
        user_id: req.session.user_id,
        content: rawContent,
      });
    });
  });
});

/* Wrting post */
router.get('/posting', (req, res) => {
  if (req.session.user_id == null) res.redirect('/');
  else {
    res.render('board/page/posting/index', {
      user_id: req.session.user_id,
      mode: 'add',
    });
  }
});

/* edit mode */
router.get('/edit', (req, res) => {
  if (req.session.user_id == null) res.redirect('/');
  else {
    BoardContents.findOne({ _id: req.query.id }, (err, rawContent) => {
      if (err) throw err;
      rawContent.save(err => {
        if (err) throw err;
        res.render('board/page/posting/index', {
          user_id: req.session.user_id,
          content: rawContent,
          mode: 'edit',
        });
      });
    });
  }
});

/* submit */
router.post('/submit', upload.array('UploadFile'), (req, res) => {
  /* 글 add */
  if (req.session.user_id == null) res.redirect('/');
  else {
    if (req.body.mode === 'add') {
      let newBoardContents = new BoardContents();
<<<<<<< HEAD
      let upFile = req.files;
      if (isSaved(upFile)) {
        newBoardContents.title = req.body.title;
        newBoardContents.writer = req.body.writer;
        newBoardContents.contents = req.body.contents;
        newBoardContents.important = req.body.important;
        newBoardContents.subject = req.body.subject;
        newBoardContents.date = moment().format('YYYY MMM Do');
        newBoardContents.save(err => {
          if (err) throw err;
          BoardContents.findOne(
            { _id: newBoardContents._id },
            { _id: 1 },
            (err, newBoardId) => {
              if (err) throw err;
              if (upFile != null) {
                let renaming = renameUploadFile(newBoardId.id, upFile);

                for (var i = 0; i < upFile.length; i++) {
                  fs.rename(renaming.tmpname[i], renaming.fsname[i], err => {
                    if (err) {
                      console.log(err);
                      return;
                    }
                  });
                }

                for (var i = 0; i < upFile.length; i++) {
                  BoardContents.update(
                    { _id: newBoardId.id },
                    { $push: { fileUp: renaming.fullname[i] } },
                    err => {
                      if (err) throw err;
                    }
                  );
                }
              }
            }
          );
        }); // mongoDB 저장
        res.redirect('/board');
      } else {
        console.log('파일이 저장되지 않았습니다!');
      }
=======
      newBoardContents.title = req.body.title;
      newBoardContents.writer = req.body.writer;
      newBoardContents.contents = req.body.contents;
      newBoardContents.important = req.body.important;
      if (req.body.subject == null) newBoardContents.subject = 0;
      newBoardContents.subject = req.body.subject;
      newBoardContents.date = moment().format('YYYY MMM Do');
      newBoardContents.save(); // mongoDB 저장
      res.redirect('/board');
>>>>>>> 6ca38fb619912184085292abad600cceecd066da
      /* 게시물 edit */
    } else if (req.body.mode === 'edit') {
      BoardContents.update(
        { _id: req.body.id },
        {
          $set: {
            title: req.body.title,
            contents: req.body.contents,
            subject: req.body.subject,
            important: req.body.important,
          },
        },
        err => {
          if (err) throw err;
        }
      );
      res.redirect('/board');
    } else console.log('error');
  }
});

router.get('/delete', (req, res) => {
  if (req.session.user_id == null) res.redirect('/');
  else {
    let contentId = parseInt(req.query.id);
    MongoClient.connect(
      url,
      (err, db) => {
        if (err) throw err;
        var dbo = db.db('KAU');
        var myquery = { _id: contentId };
        dbo.collection('boards').deleteOne(myquery, (err, obj) => {
          if (err) throw err;
          console.log('1 document deleted');
          db.close();
          res.redirect('/board');
        });
      }
    );
  }
});

router.get('/search', (req, res) => {
  const search_word = req.query.searchWord;
  let boardNum = req.query.boardNum;
  if (boardNum == null) boardNum = 0;
  let searchCondition;
  if (req.query.searchWord != null) searchCondition = { $regex: search_word };
  /* 글쓰기 가능 여부를 위한 세션 확인 */
  let canWrite = false;
  if (req.session.user_id != null) canWrite = true;
  BoardContents.find({
    subject: boardNum,
    title: searchCondition,
  })
    .sort({ date: -1 })
    .exec((err, searchContents) => {
      if (err) throw err;
      res.render('board/index', {
        user_id: req.session.user_id,
        contents: searchContents,
        impContents: searchContents,
        can_write: canWrite,
        pagination: 1,
      });
    });
});

router.get('/download/:path', (req, res) => {
  const path = req.params.path;
  res.download('./upload/' + path, path);
  console.log(path);
});

function isSaved(upFile) {
  let savedFile = upFile;
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
