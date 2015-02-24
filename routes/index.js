var mongoose = require( 'mongoose' );
var Todo     = mongoose.model( 'Todo' );
var Activity = mongoose.model( 'Activity');
var Display  = mongoose.model( 'Todo' );
var DebugMode= false;

exports.login = function ( req, res, next){
    res.render('login');
};
exports.index = function ( req, res, next ){
    var user_id = req.cookies ?
    req.cookies.user_id : undefined;
    if(DebugMode)
        console.log("\n"+"index() called");
    Todo.
        find({ user_id : user_id }).
        sort( '-updated_at' ).
        exec( function ( err, todos ){
            Activity.
                find({}).
                sort('date').
                exec( function (err,acts) {
                    if (err) return next(err);
                    res.render('index', {
                        title : 'EESA Accounting System Beta',
                        todos : todos,
                        acts: acts
                    });
                });
      });

    Display=Todo;
    ( function( err, todo, count ){
        if( err ) return next( err );
        // ...
        });
};
function translatedep(name)
{
    switch (name){
        case "UL":
            return "不限" ;break;
        case "AC":
            return "學術部";break;
        case "PE":
            return "體育部";break;
        case "PD":
            return "公關部";break;
        case "AW":
            return "美宣部";break;
        case "MIS":
            return "資訊部";break;
    }

};
exports.create_activity     =function(req,res,next){
    var d=new Date();
    if(DebugMode)
        console.log("\n"+"create_activity() called");
    var test= d.toLocaleDateString();
    new Activity({
        content    : req.body.act_content,
        date       : test
    }).save( function ( err, act, count ){
            if( err )
                return next( err );
            res.redirect( '/' );
        });
    ( function( err, todo, count ){
        if( err ) return next( err );
        // ...
    });
};
exports.delete_activity     = function (req,res,next) {
    if(DebugMode)
        console.log("\n"+"delete_activity() called");
    Activity.findById( req.params.id, function ( err, act ){
        act.remove( function ( err, act ){
            if( err ) return next( err );
            res.redirect( '/' );
        });
    });
    ( function( err, todo, count ){
        if( err ) return next( err );

        // ...
    });
};
exports.create_transactions = function ( req, res, next ){
    if(DebugMode)
        console.log("\n"+"create_transactions() called");
    var d=new Date();
    var test= d.toLocaleDateString();
    new Todo({
         income     : req.body.income,
         outcome	 : req.body.outcome,
         department : req.body.depart,
         depName    : translatedep(req.body.depart),
         summary    : req.body.income-req.body.outcome,
         activity   : req.body.activity,
         reminder   : req.body.reminder,
         updated_at : d,
         date       : test
    }).save( function ( err, todo, count ){
        if( err )
            return next( err );
        res.redirect( '/accounting' );
    });
    ( function( err, todo, count ){
        if( err ) return next( err );
            // ...
    });
};



exports.destroy_transactions = function ( req, res, next ){
    if(DebugMode)
        console.log("\n"+"destroy_transactions() called");
  Todo.findById( req.params.id, function ( err, todo ){
    var user_id = req.cookies ?
      req.cookies.user_id : undefined;
    todo.remove( function ( err, todo ){
      if( err ) return next( err );
 
      res.redirect( '/accounting' );
    });
  });
  ( function( err, todo, count ){
  if( err ) return next( err );
 
  // ...
});
};
 
exports.edit_transactions = function( req, res, next ){
    if(DebugMode)
        console.log("\n"+"edit_transactions() called");
 
  Todo.
    find({ user_id : user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );
 
      res.render( 'edit', {
        title   : 'Express Todo Example',
        todos   : todos,
        current : req.params.id
      });
    });
    ( function( err, todo, count ){
  if( err ) return next(
      err );
 
  // ...
});
};

exports.update_transactions = function( req, res, next ){
  Todo.findById( req.params.id, function ( err, todo ){
      if(DebugMode)
          console.log("\n"+"update_transactions() called");
 
 
    todo.content    = req.body.content;
    todo.updated_at = Date.now();
    todo.save( function ( err, todo, count ){
      if( err ) return next( err );
 
      res.redirect( '/' );
    });
  });
  ( function( err, todo, count ){
  if( err ) return next( err );
 
  // ...
});
};



exports.findDep=function( req, res, next ){
    if(DebugMode)
        console.log("\n"+"findDep() called");
    Todo.
        find({department:req.params.classify}).
        sort( '-updated_at' ).
        exec( function ( err, todos ){
            Activity.
                find({}).
                sort('date').
                exec( function (err,acts) {
                    if (err) return next(err);
                    res.render('index', {
                        title : 'EESA Accounting System Beta',
                        todos : todos,
                        acts: acts
                    });
                });
        });
    ( function( err, todo, count ){
        if( err ) return next( err );
        res.redirect( '/' );
        // ...
    });
};


exports.findAct=function(req,res,next){
    if(DebugMode){
        console.log("\n"+"findAct() called");
        console.log(req.params.classify);
    }
    Todo.
        find({activity:req.params.classify}).
        sort( '-updated_at' ).
        exec( function ( err, todos ){
            Activity.
                find({}).
                sort('date').
                exec( function (err,acts) {
                    if (err) return next(err);
                    res.render('index', {
                        title : 'EESA Accounting System Beta',
                        todos : todos,
                        acts: acts
                    });
                });
        });
    ( function( err, todo, count ){
        if( err ) return next( err );
        res.redirect( '/' );
        // ...
    });
};