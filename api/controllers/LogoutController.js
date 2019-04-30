/**
 * LogoutController
 *
 * @description :: Server-side logic for managing logouts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	logout:function(req,res){
		// res.clearCookie('username')
		// res.clearCookie('userkey')
		req.session.destroy(function(err){
	            if(err){
	                console.log("退出失败!");
	                return;
	            }
	            //清除登录cookie
	            // res.clearCookie('username')
	            // res.clearCookie('userkey')
	            res.redirect('/');
	            return res;
	        });
	}
};
