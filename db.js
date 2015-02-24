var mongoose = require( 'mongoose' );
var bcrypt   = require( 'bcrypt');
var Schema   = mongoose.Schema;
var SALT_WORK_FACTOR = 10;
 
var Todo = new Schema({
    date       : String,
    income     : Number,
    outcome    : Number,
    summary    : Number,
    department : String,
    depName    : String,
    activity   : String,
    reminder   : String,
    updated_at : Date
});

var Activity =new Schema({
    content    :String,
    year       :Number,
    Conceal    :Boolean
});

var userSchema=new Schema({
   username    :{type:String,required:true,unique:true},
   password    :{type:String,required:true,unique:true},
   year        :{type:String,required:true,unique:true}
});

userSchema.pre('save',function(next){
    var user=this;
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err) return next(err);
        bcrypt.hash(user.password,salt,function(err,hash){
            if(err) return next(err);
            user.password=hash;
            next();
        })
    });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
        if(err) return cb(err);
        cb(null,isMatch);
    })
}





var getBalanece =function(){
    db.todos.aggregate()
}
var User =mongoose.model('User',userSchema);
var Todo=mongoose.model( 'Todo', Todo );
var Activity=mongoose.model( 'Activity', Activity );
mongoose.connect( 'mongodb://localhost/express-todo' );

var db=mongoose.connection;
db.on('error',function(){console.log('connection err:')});
db.once('open',function callback(){
    console.log("Connected to DB");
});


