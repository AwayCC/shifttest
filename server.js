var db=require( './db' );
var express = require( 'express' );
var routes  = require( './routes' );
var http    = require( 'http' );
var path    = require( 'path' );
var app     = express();
var engine  = require( 'ejs-locals' );
var mongoose = require( 'mongoose' );
var LocalStrategy =require('passport-local').Strategy;
var connect = require("connect");
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

// Configuring Passport
var passport= require( 'passport');
var expressSession=require('express-session');

var User =mongoose.model('User');
var user =new User({ username:"cosine",password:"tester",year:2014});
user.save(function(err){
    if(err)
        console.log(err);
    else
        console.log('user: '+user.username+' saved.');
});
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(function(username,password,done){
    User.findOne({username:username},function(err,user){
        if(err)
            return done(err);
        if(!user) {
            return done(null,false,{message :"Unknown user" + username});}
        user.comparePassword(password,function(err,isMatch){
            if(err) return done(err);
            if(isMatch) {
                return done(null,user);
            }
            else {
                return done(null,false,{message: "Invalid password"});
            }
        });
    });
}));

// all environments
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.engine( 'ejs', engine );
app.set( 'views', path.join( __dirname, 'views' ));
app.set( 'view engine', 'ejs' );
app.use( express.favicon());
app.use( express.logger( 'dev' ));
app.use( express.cookieParser());
app.use( express.bodyParser());
app.use( express.session({ secret: 'keyboard cat' }));
app.use( passport.initialize());
app.use( passport.session());
app.use( express.json());
app.use( express.urlencoded());
app.use( express.methodOverride());
app.use( app.router );
app.use( express.static( path.join( __dirname, '/public' )));

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// development only
if( 'development' == app.get( 'env' )){
    app.use( express.errorHandler());
}
app.param('classify', function (req, res, next, id) {
    console.log('CALLED ONLY ONCE');
    next();
})

// Routes
app.get(  '/',            routes.login );
app.get('/account', ensureAuthenticated, function(req, res){
    console.log("app.get /account");
    res.render('account', { user: req.user });
});
app.get('/login', function(req, res){
    console.log("app.get /login");
    res.render('login', { user: req.user, message: req.session.messages });
});
app.post('/login', function(req, res, next) {
    console.log("login post");
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            req.session.messages =  [info.message];
            console.log("Loggin Failed");
            return res.redirect('/login')
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/accounting');
        });
    })(req, res, next);
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

/*app.listen(3000, function() {
 console.log('Express server listening on port 3000');
 });*/
//app.get(  '/accounting'                 ,routes.index);
app.get('/accounting', ensureAuthenticated, function(req, res){
    console.log(ensureAuthenticated);
    routes.index(req,res);
});
//app.get(  '/'                           ,function(req,res){ res.sendfile('login.ejs',{root: __dirname + "/views"})} );
app.post( '/accounting/create_transactions'        ,ensureAuthenticated,routes.create_transactions );
app.get(  '/accounting/destroy_transactions/:id'   ,ensureAuthenticated,routes.destroy_transactions);
app.get(  '/accounting/edit_transactions/:id'      ,ensureAuthenticated,routes.edit_transactions);
app.post( '/accounting/update_transactions/:id'    ,ensureAuthenticated,routes.update_transactions);
app.get(  '/accounting/findDep/:classify'          ,ensureAuthenticated,routes.findDep);
app.get(  '/accounting/findAct/:classify'          ,ensureAuthenticated,routes.findAct);
app.post( '/accounting/create_activity'            ,ensureAuthenticated,routes.create_activity);
app.get(  '/accounting/delete_activity/:id'        ,ensureAuthenticated,routes.delete_activity);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("ensured");
        return next();
    }
    res.redirect('/login')
}

http.createServer( app ).listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});