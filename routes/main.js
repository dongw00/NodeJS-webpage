module.exports = app => {
  /* Homepage */
  app.get('/', (req, res) => {
    res.render('home/index', {
      //user_id: req.session.user_id,
    });
  });

  /* 연구실 소개 */
  app.get('/professor', (req, res) => {
    res.render('professor/index', {
      //user_id: req.session.user_id,
    });
  });

  /* 공지사항 */
  app.get('/notice', (req, res) => {
    res.render('notice/index', {
      //user_id: req.session.user_id,
    });
  });

  /* Login */
  /*
  app.get("/login", (req, res) => {
    if(req.session.user_id!=null)
      res.redirect("/");
    var chk = 0;
    if(req.query.checked=="fail")
      chk = 1;

    res.render("login/index",{
      user_id: req.session.user_id,
      checked: chk
    });
  });
*/
  /*
  app.post("/login/check", (req, res) =>{
    // 모델 정의
    var User = require('../models/user');
    
    User.findOne({id: req.body.your_name, pwd: req.body.your_pass}, function(err, user){
      if(err) return res.status(500).json({error: err});
      if(!user){
        return res.redirect('/login?checked=fail');
      }
      // user exist
      // save session
      if(req.body.remember_me == "remember"){ // remember me 체크박스
        req.session.user_id = req.body.your_name
        req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
      }else{
        req.session.user_id = req.body.your_name
      }
      // redirect to main
      res.redirect('/');
    });
  });
*/

  /* Logout */
  /*
  app.get("/logout", (req, res) => {
    if(req.session.user_id){
      req.session.destroy(function(err){
        if(err){
          console.log(err);
        }else{
          res.redirect('/');
        }
      })
    }else{
      res.redirect('/');
    }
  });
  */
  /*
  /* test계정 생성 */
  // id: test, pwd: test
  /*
  app.get("/create", (req, res) => {
    var User = require('../models/user');
    User.findOne({id: "test", pwd: "test"}, function(err, user){
      if(err) return res.status(500).json({error: err});
      if(!user){
        var book = new User();
        book.id = "test";
        book.pwd = "test"
        book.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }
            res.json({result: 1});
        });
      }
      return res.redirect('/login');
    });
  });
*/

  /* members */
  app.get('/members', (req, res) => {
    res.render('members/index', {
      //user_id: req.session.user_id,
    });
  });

  /* researches */
  app.get('/researches', (req, res) => {
    res.render('researches/index', {
      //user_id: req.session.user_id,
    });
  });
};
