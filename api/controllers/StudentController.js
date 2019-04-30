/**
 * StudentController
 *
 * @description :: Server-side logic for managing Students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  del: function(req, res) {
    var id = req.param('id');
    if (!id) {
      return res.badRequest(sails__('Params Error'));
    }
    console.log(id);
    Student.destroy({
      id: id
    }).exec(function(err) {
      if (err) {
        return res.negotiate(err);
      }
      return res.json(1);
    });
  },
  addstudent: function(req, res) {
    console.log("路由正确");
    var id = req.param('id');
    console.log(id);
    var name = req.param('name');
    console.log(name);
    var classid = req.param('classid');
    console.log(classid);
    if (!id || !name || !classid) {
      return res.badRequest(sails__('Params Error'));
    }
    console.log("传值成功");
    var row = {};
    row.id = id;
    row.name = name;
    row.class = classid;
    console.log(row);
    req.file('image').upload({
      dirname: require('path').resolve(sails.config.appPath, 'data/image')
    }, async function(err, uploadedFiles) {
      if (err) return exits.serverError(err);
      else {
        console.log("正在上传");
        if (uploadedFiles.length > 0) {
          row.image = require('path').basename(uploadedFiles[0].fd);
          // var destPath = require('path').resolve(sails.config.paths.public, 'data/term_images/' + row.iamge);
          if (row.image) {
            Student.findOrCreate({
              id: row.id
            }, {
              id: row.id,
              name: row.name,
              class: row.class,
              image: row.image,
              count: 0,
            }).exec(function createFindCB(error, createdOrFoundRecords) {
              if (error) {
                var path = require('path').resolve(sails.config.appPath, 'data/image/' + row.image);
                require('fs').unlinkSync(path);
                console.log("图片已删除");
                return res.serverError(error);
              }
              console.log(createdOrFoundRecords);
              if (createdOrFoundRecords.name == row.name && createdOrFoundRecords.image == row.image) {
                return res.json(1);
              } else {
                var path = require('path').resolve(sails.config.appPath, 'data/image/' + row.image);
                require('fs').unlinkSync(path);
                console.log("图片已删除");
                return res.json(0);
              }
            });
          }
        }
      }
    });
  },

  student: function(req, res) {
    Student.find().sort('id ASC').exec(function afterFind(err, zookeepers) {
      if (err) {
        // uh oh
        // (handle error; e.g. `return res.serverError(err)`)
        return;
      }

      console.log(zookeepers);
      var dates = [];
      for (var i = 0; i < zookeepers.length; i++) {
        var student = zookeepers[i].toObject();
        dates[i] = [student.id, student.name, student.class, student.count];
      }
      res.view('student', {
        menu: 'menu3',
        date: dates
      });
    });
  },
  getstudent: function(req, res) {
    var id = req.param('id');
    if (!id) {
      return res.badRequest(sails__('Params Error'));
    }
    Student.findOne({
      id: id
    }).exec(function(err, finn) {
      if (err) {
        return res.serverError(err);
      }
      if (!finn) {
        return res.notFound('Could not find Finn, sorry.');
      }
      if (!finn.image) {
        finn.image = 0;
      } else {
        finn.image = 1;
      }
      return res.view('student_detail', {
        layout: false,
        id: id,
        name: finn.name,
        iamge: finn.image,
      });
    });

  },
  uploadImg: async function(req, res) {
    var id = req.param('id');
    if (!id) {
      return res.badRequest(sails__('Params Error'));
    }
    Student.findOne({
      id: id
    }).exec(function(err, finn) {
      if (err) {
        return res.serverError(err);
      }
      if (!finn) {
        return res.notFound('Could not find Finn, sorry.');
      }

      var old = finn;
      console.log(old);
      var row = {};
      req.file('image').upload({
        dirname: require('path').resolve(sails.config.appPath, 'data/image')
      }, async function(err, uploadedFiles) {
        if (err) return exits.serverError(err);
        else {
          console.log("正在上传");
          if (uploadedFiles.length > 0) {
            row.image = require('path').basename(uploadedFiles[0].fd);
            // var destPath = require('path').resolve(sails.config.paths.public, 'data/term_images/' + row.iamge);
            var fs = require('fs');
            if (row.image) {
              Student.update({
                id: id
              }, {
                image: row.image,
              }).exec(function afterwards(err, updated) {
                if (err) {
                  // handle error here- e.g. `res.serverError(err);`
                  return;
                }
                //删除老照片
                if (old && old.image != null && old.image !="") {
                  var path = require('path').resolve(sails.config.appPath, 'data/image/' + old.image);
                  require('fs').unlinkSync(path);
                }
                console.log('Updated all users named "Walter Jr" to have name ' + updated[0].name);
              });
            }
          }
          return res.json(1);
        }
      });

    });

  },
  getImage: async function(req, res) {
    var id = req.param('id');
    if (!id) {
      return res.badRequest(sails__('Params Error'));
    }
    console.log(id);

    Student.findOne({
      id: id
    }).exec(function(err, finn) {
      if (err) {
        return res.serverError(err);
      }
      if (!finn) {
        return res.notFound('Could not find Finn, sorry.');
      }
      var student = finn;
      console.log(student, "找到了");
      if (!student.image) {
        return res.json(0);
      }
      var SkipperDisk = require('skipper-disk');
      var fileAdapter = SkipperDisk( /* optional opts */ );

      // set the filename to the same file as the user uploade
      res.set("Content-disposition", "attachment; filename='" + student.image + "'");

      // Stream the file down
      fileAdapter.read(require('path').resolve(sails.config.appPath, 'data/image', student.image))
        .on('error', function(err) {
          return res.serverError(err);
        }).pipe(res);
      return res;
    });
  },
  andgetstudent: function(req, res) {
    var classid = req.param('classid');
    if (!classid) {
      return res.badRequest(sails__('Params Error'));
    }
    Student.find().where({
      class: classid
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
      return res.json({
        student: finn,
      });
    });
  },
  andgetImage: async function(req, res) {
      var id = req.param('id');
      if (!id) {
        return res.badRequest(sails__('Params Error'));
      }
      console.log(id);

      Student.findOne({
        id: id
      }).exec(function(err, finn) {
        if (err) {
          return res.serverError(err);
        }
        if (!finn) {
          return res.notFound('Could not find Finn, sorry.');
        }
        var student = finn;
        console.log(student, "找到了");
        if (!student.image) {
          return res.json(500, {
            error: 'notFound'
          });
        }
        var SkipperDisk = require('skipper-disk');
        var fileAdapter = SkipperDisk( /* optional opts */ );
        res.set("Content-disposition", "attachment; filename='" + student.image + "'");
        fileAdapter.read(require('path').resolve(sails.config.appPath, 'data/image', student.image))
          .on('error', function(err) {
            return res.serverError(err);
          }).pipe(res);
        return res;
      });
  },

};
