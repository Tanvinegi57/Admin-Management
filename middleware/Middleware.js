module.exports ={
    BlockePermis: (req, res, next) =>{
        if(req.user.title === "Super-Admin"){
            next();
          }
          else if(req.user.BlockedPermission == 1){
            next();
          }
          else{
            return res.status(403).send(" You are not admin also you have no permission of block....");
          }
      },
      DeletePermis:function (req, res, next) {
        if(req.user.title === "Super-Admin"){
            next();
          }
          else if(req.user.DeletedPermission == 1){
            next();
          }
          else{
            return res.status(403).send(" You are not admin also you have no permission of deletion....");
          }
      },
      EditPermis:function (req, res, next) {
        if(req.user.title === "Super-Admin"){
            next();
          }
          else if(req.user.EditPermission == 1){
            next();
          }
          else{
            return res.status(403).send(" You are not admin also you have no permission of edit....");
          }
      },
      IsAdmin:function (req, res, next) {
        if(req.user.title === "Super-Admin"){
          next();
        }
      return res.status(403).send(" You are not admin ....");
      },
      RegPermi:function (req, res, next) {
        if(req.user.title === "Super-Admin"){
            next();
          }
          else if(req.user.RegistrationPermission == 1){
            next();
          }
          else{
            return res.status(403).send(" You are not admin also you have no permission of registration....");
          }
      },
      UnblockPermis:function (req, res, next) {
        if(req.user.title === "Super-Admin"){
            next();
          }
          else if(req.user.UnblockedPermission == 1){
            next();
          }
          else{
            return res.status(403).send(" You are not admin also you have no permission of unblock....");
          }
      }
} 
  

