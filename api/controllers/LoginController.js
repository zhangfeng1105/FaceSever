/**
 * LoginController
 *
 * @description :: Server-side logic for managing logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  login: function(req, res) {
    console.log('准备登陆');
    // var user = User.find({ name:req.body.name}).populate('name').populate('password');
    // console.log(user[0].name);
    Manager.find({
      name: req.body.name
    }).exec(function findUser(err, found) {
      if (err) {
        console.log(err, false);
      }
      console.log(req.body.name);
      console.log(req.body.password);
      console.log(found.length);
      if (found.length == 0) {
        res.json(-1);
      } else {
        var manager = found.pop().toObject();
        if (manager.password == req.body.password) {
          req.session.user = manager;
          res.json(1);
        } else if (manager.password != req.body.password) {
          res.json(0);
        }
      }
    });
  },


  resetpass: function(req, res) {
    res.view('resetpass', {
      menu: ''
    });
  },
  resetpasspost: function(req, res) {
    var oldpassword = req.body.oldpassword;
    var newpassword = req.body.newpassword;
    console.log(oldpassword);
    console.log(newpassword);
    console.log(req.session.user);
    if (req.session.user.password == oldpassword) {
      User.update({
        name: req.session.user.name
      }, {
        password: newpassword
      }).exec(function afterwards(err, updated) {
        if (err) {
          console.log(err, false);
          return;
        }
        res.json(0);
        req.session.destroy(function(err) {
          if (err) {
            console.log("退出失败!");
            return;
          }
        });
      });
    } else {
      res.json(-1); //密码错误
    }
  }
};
