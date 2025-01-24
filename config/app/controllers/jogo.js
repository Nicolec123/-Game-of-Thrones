module.exports.jogo = function (application, req, res) {
  if (req.session.usuario){
  res.render("jogo")
  } else {
    res.render("index")
    return;
  }
    
    
}

module.exports.sair = function (application, req, res) {
  req.session.destroy(function(err){
    res.redirect("/")
  })
  
 
}

