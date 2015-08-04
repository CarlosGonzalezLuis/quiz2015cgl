// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function (req, res, next){
   if (req.session.user){
       next();
   } else {
       res.redirect('/login');
   }
};

// Get /login  -- Formulario de login
exports.new = function (req, res) {
   var errors = req.session.errors || {};
   req.session.errors = {};

   res.render('sessions/new', {errors: errors});
};

// POST /login -- Crear la sesion
exports.create = function (req, res) {

   var login      = req.body.login;
   var password   = req.body.password;

   var userController = require('./user_controller');
   userController.autenticar(login, password, function(error, user) {

      if (error) { //si hay error retornamos mensajes de error de sesión
        req.session.errors = [{"message": 'Se ha producido un error: '+error}];
        res.redirect("/login");
        return;
      }

      // Crear req.session.user y guardar campos id y username
      // la sesión se define por la existencia de: req.session.user
      req.session.user = {id:user.id, username:user.username};

      // Crea req.session.tiempo para guardar la hora del reloj del sistema en autologout
      req.session.tiempo = new Date().getTime();
      req.session.autoLogout= false; //para mostrar mensaje alert desconexion +2 min.      

      res.redirect(req.session.redir.toString());// redirección a path anterior a login
   });
};

// DELETE /logout   --Destruir sesion
exports.destroy = function (req, res) {
   delete req.session.user;
   if (req.session.autoLogout){//si el valor paso a true en app.js
      res.redirect("/login");//redireccionamos y mostramos mensaje de alert desconexion +2 min.
   }else{
   res.redirect(req.session.redir.toString());// redirect a path anterior a login
   }
};

