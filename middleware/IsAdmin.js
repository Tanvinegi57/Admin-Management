module.exports = function (req, res, next) {
    if(req.user.title === "Super-Admin"){
      next();
    }
  return res.status(403).send(" You are not admin ....");
  };
  


