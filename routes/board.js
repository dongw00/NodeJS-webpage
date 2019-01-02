const express = require('express');
const router = express.Router();
const BoardContents = require('../models/boardSchema');
const multer = require('multer');
const moment = require('moment');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost/KAU';

/* Multer storage options */
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, 'public/upload');
  },
  filename: function(req, file, callback) {
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    callback(null, basename + '-' + Date.now() + extension);
  },
});

const upload = multer({ storage: storage });

/* init view */
router.get('/', (req, res) => {
  let page = req.query.page;
  let boardNum = req.query.boardNum;
  if (page == null) page = 1;
  if (boardNum == null) boardNum = 0;
  /* 글쓰기 가능 여부를 위한 세션 확인 */
  let canWrite = false;
  if (req.session.user_id != null) canWrite = true;
  let skipSize = (page - 1) * 10;
  const limitSize = 10;
  let pageNum = 1;
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
          boardNum: boardNum,
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
router.post('/submit', upload.single('UploadFile'), (req, res) => {
  /* 글 add */
  if (req.session.user_id == null) res.redirect('/');
  else {
    /* 게시글 추가 모드 */
    if (req.body.mode === 'add') {
      const newBoardContents = new BoardContents();
      newBoardContents.title = req.body.title;
      newBoardContents.writer = req.body.writer;
      newBoardContents.contents = req.body.contents;
      newBoardContents.important = req.body.important;
      newBoardContents.subject = req.body.subject;
      /* File upload */
      newBoardContents.fileUp = req.file;
      console.log(req.file);
      newBoardContents.save();
      res.redirect('/board');
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

/* 게시물 삭제*/
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
          db.close();
          res.redirect('/board');
        });
      }
    );
  }
});

/* 검색 */
router.get('/search', (req, res) => {
  const search_word = req.query.searchWord;
  let boardNum = req.query.boardNum;
  if (boardNum == null) boardNum = 0;
  let searchCondition;
  if (req.query.searchWord != null) searchCondition = { $regex: search_word };

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

router.get('/download', (req, res) => {
  const filePath = req.query.path;
  console.log(filePath);
  res.download(filePath);
});

module.exports = router;
