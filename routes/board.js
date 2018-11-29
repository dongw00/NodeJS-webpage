var express = require('express');
var router = express.Router();
var BoardContents = require('../models/boardSchema');
var multer = require('multer');
var upload = multer({ dest: './tmp/' });
var fs = require('fs');

/* 게시판 */
router.get('/', (req, res) => {
  var page = req.param('page');
  if (page == null) {
    page = 1;
  }

  var skipSize = (page - 1) * 10;
  var limitSize = 10;
  var pageNum = 1;

  BoardContents.count({ delete: false }, function(err, totalCount) {
    if (err) throw err;
    pageNum = Math.ceil(totalCount / limitSize);
    BoardContents.find({ deleted: false })
      .sort({ date: -1 })
      .skip(skipSize)
      .limit(limitSize)
      .exec((err, pageContents) => {
        if (err) throw err;
        res.render('board/index', {
          user_id: req.session.user_id,
          title: 'Board',
          contents: pageContents,
          pagination: pageNum,
        });
      });
  });
});

router.get('/write', (req, res) => {
  res.render('board/components/write', { title: '글쓰기' });
});

// TODO
router.get('/password', (req, res) => {
  var id = req.param('id');

  BoardContents.findOne({ _id: id }, function(err, rawContents) {
    res.send(rawContents.password);
  });
});

router.post('/post', upload.array('UploadFile'), (req, res) => {
  var mode = req.param('mode');

  var addNewTitle = req.body.addContentSubject;
  var addNewWriter = req.body.addContentWriter;
  var addNewPassword = req.body.ps;
  var addNewContent = req.body.addContents;
  var upFile = req.files;

  var modTitle = req.body.modContentSubject;
  var modContent = req.body.modContents;
  var modId = req.body.modId;

  if (mode == 'add') {
    if (isSaved(upFile)) {
      addBoard(
        addNewTitle,
        addNewWriter,
        addNewContent,
        addNewPassword,
        upFile
      );
      res.redirect('/board');
    } else {
      console.log('파일이 저장되지 않았습니다!');
    }
  } else {
    modBoard(modId, modTitle, modContent);
    res.redirect('/board');
  }
});

router.get('/delete', function(req, res) {
  var contentId = req.param('id');
  BoardContents.update(
    { _id: contentId },
    { $set: { deleted: true } },
    function(err) {
      if (err) throw err;
      res.redirect('/notice');
    }
  );
});

router.get('/download/:path', (req, res) => {
  var path = req.params.path;
  res.download('./upload/' + path, path);
  console.log(path);
});

function addBoard(title, writer, content, password, upFile) {
  var newContent = content.replace(/\r\n/gi, '\\r\\n');

  var newBoardContents = new BoardContents();
  newBoardContents.writer = writer;
  newBoardContents.title = title;
  newBoardContents.contents = newContent;
  newBoardContents.password = password;

  newBoardContents.save(function(err) {
    if (err) throw err;
    BoardContents.findOne({ _id: newBoardContents._id }, { _id: 1 }, function(
      err,
      newBoardId
    ) {
      if (err) throw err;

      if (upFile != null) {
        var renaming = renameUploadFile(newBoardId.id, upFile);

        for (var i = 0; i < upFile.length; i++) {
          fs.rename(renaming.tmpname[i], renaming.fsname[i], function(err) {
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
            function(err) {
              if (err) throw err;
            }
          );
        }
      }
    });
  });
}

function modBoard(id, title, content) {
  var modContent = content.replace(/\r\n/gi, '\\r\\n');
  BoardContents.findOne({ _id: id }, function(err, originContent) {
    if (err) throw err;
    originContent.updated.push({
      title: originContent.title,
      contents: originContent.contents,
    });
    originContent.save(function(err) {
      if (err) throw err;
    });
  });
  BoardContents.update(
    { _id: id },
    { $set: { title: title, contents: modContent, date: Date.now() } },
    function(err) {
      if (err) throw err;
    }
  );
}

function isSaved(upFile) {
  // 파일 저장 여부 확인해서 제대로 저장되면 디비에 저장되는 방식
  var savedFile = upFile;
  var count = 0;
  if (savedFile != null) {
    // 파일 존재시 -> tmp폴더에 파일 저장여부 확인 -> 있으면 저장, 없으면 에러메시지
    for (var i = 0; i < savedFile.length; i++) {
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
  // 리네임과, 파일의 경로를 따오기 위해 필요함.
  var order = num;
  var dirname = __dirname.split('/');
  var result = '';

  for (var i = 0; i < dirname.length - order; i++) {
    result += dirname[i] + '/';
  }
  return result;
}

function renameUploadFile(itemId, upFile) {
  // 업로드 할때 리네이밍 하는 곳!
  var renameForUpload = {};
  var newFile = upFile; // 새로 들어 온 파일
  var tmpPath = [];
  var tmpType = [];
  var index = [];
  var rename = [];
  var fileName = [];
  var fullName = []; // 다운로드 시 보여줄 이름 필요하니까 원래 이름까지 같이 저장하자!
  var fsName = [];

  for (var i = 0; i < newFile.length; i++) {
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
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  var fullDate = year + '' + month + '' + day + '' + hour + '' + min + '' + sec;
  return fullDate;
}

module.exports = router;
