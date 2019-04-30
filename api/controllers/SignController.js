/**
 * SignController
 *
 * @description :: Server-side logic for managing Signs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  go: function(req, res) {
    Sign.find().sort('class asc').sort('date desc').sort('sign desc').sort('id ASC').exec(function afterFind(err, zookeepers) {
      if (err) {
        // uh oh
        // (handle error; e.g. `return res.serverError(err)`)
        return;
      }

      console.log(zookeepers);
      var dates = [];
      for (var i = 0; i < zookeepers.length; i++) {
        var sign = zookeepers[i].toObject();
        if (sign.sign == 1) {
          dates[i] = [sign.id, sign.name, sign.class, "已签到", sign.date];
        } else {
          dates[i] = [sign.id, sign.name, sign.class, "旷课", sign.date];
        }
      }
      res.view('sign', {
        menu: 'menu1',
        date: dates
      });
    });
  },
  getsign: function(req, res) {
    var date = req.param('date');
    console.log(date);
    var classid = req.param('class');
    console.log(classid);
    if (!date || !classid) {
      return res.badRequest(sails__('Params Error'));
    }
    Sign.find({
      date: date,
      class: classid
    }).sort('id ASC').exec(function afterFind(err, zookeepers) {
      if (err) {
        // uh oh
        // (handle error; e.g. `return res.serverError(err)`)
        return;
      }

      console.log(zookeepers);
      return res.json({
        date: zookeepers
      });
    });
  },
  updateSign:function(req,res){
	  var date = req.param('date');
      console.log(date);
      var id = req.param('id');
      console.log(id);
      if (!date || !id) {
        return res.badRequest(sails__('Params Error'));
      }
	  Sign.update({
        id: id,
		date:date
      }, {
        sign: 1
      }).exec(function afterwards(err, updated) {
        if (err) {
          console.log(err, false);
          return;
        }
        res.json(0);
      });
  },
  push: function(req, res) {
    var id = req.param('id');
    console.log(id);
    var date = req.param('date');
    console.log(date);
    var name = req.param('name');
    console.log(name);
    var classid = req.param('class');
    console.log(classid);
    var sign = req.param('sign');
    console.log(sign);
    if (!id || !date || !name || !classid || !sign) {
      return res.badRequest(sails__('Params Error'));
    }
    Sign.findOrCreate({
      id: id,
      date: date
    }, {
      id: id,
      name: name,
      class: classid,
      date: date,
      sign: sign
    }).exec(function createFindCB(error, createdOrFoundRecords) {
      if (error) {
        return res.serverError(error);
      }
      if (createdOrFoundRecords.id == id && createdOrFoundRecords.sign == sign && createdOrFoundRecords.date == date) {
        //新建
        console.log("新建成功");
        return res.json(1);
      } else {
        //存在
        Sign.update({
          id: id,
          date: date,
        }, {
          sign: sign
        }).exec(function afterwards(err, updated) {
          if (err) {
            console.log(err, false);
            return;
          }
          console.log("更新成功");
          return;
        });
        return res.json(0);
      }
    });
  },
};
