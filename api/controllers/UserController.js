/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  user: function(req, res) {
    User.find().sort('id ASC').exec(function afterFind(err, zookeepers) {
      if (err) {
        // uh oh
        // (handle error; e.g. `return res.serverError(err)`)
        return;
      }

      console.log(zookeepers);
      var dates = [];
      for (var i = 0; i < zookeepers.length; i++) {
        var user = zookeepers[i].toObject();
        if (user.level == 1) {
          dates[i] = [user.id, user.name, '老师', user.password, ''];
        } else if (user.level == 2)
          dates[i] = [user.id, user.name, '学生', user.password, user.class];
      }

      res.view('user', {
        menu: 'menu2',
        date: dates
      });
    });
  },

  adduser: function(req, res) {
    var id = req.param('id');
    var name = req.param('name');
    var classid = req.param('classid');
    var pass = req.param('pass');
    var level = req.param('level');
    if (!id || !name || !classid || !pass) {
      return res.badRequest(sails__('Params Error'));
    }
    console.log("传值成功");
    var row = {};
    row.id = id;
    row.name = name;
    row.level = level;
    row.pass = pass;
    row.classid = classid;
    console.log(row);

    User.findOrCreate({
      id: row.id
    }, {
      id: row.id,
      name: row.name,
      level: row.level,
      password: row.pass,
      class: row.classid,
    }).exec(function createFindCB(error, createdOrFoundRecords) {
      if (error) {
        return res.serverError(error);
      }
      console.log(createdOrFoundRecords);
      if (createdOrFoundRecords.name == row.name && createdOrFoundRecords.password == row.pass) {
        return res.json(1);
      } else {
        return res.json(0);
      }
    });
  },
  deluser: function(req, res) {
    var id = req.param('id');
    console.log(id);
    if (!id) {
      return res.badRequest(sails__('Params Error'));
    }
    User.destroy({
      id: id
    }).exec(function(err) {
      if (err) {
        console.log("有毒啊");
        return res.negotiate(err);
      }
      return res.json(1);
    });
  },
  getAndUser: function(req, res) {
    var id = req.param('id');
    var password = req.param('password');
    if (!id) {
      return res.badRequest(sails__('Params Error'));
    }
    console.log(id + " " + password);
    User.findOne({
      id: id
    }).exec(function(err, finn) {
      if (err) {
        return res.serverError(err);
      }
      if (!finn) {
        return res.json(500, {
          error: 'notFound'
        })
      }
      console.log(finn);
      var user = finn.toObject();
      if (user.password == password) {
        console.log("密码正确");
        return res.json({
          user: {
            id: user.id,
            name: user.name,
            class: user.class,
            level: user.level
          }
        });
      } else {
        console.log("密码错误");
        return res.json({
          pass: {}
        });
      }
    });
  },
};
