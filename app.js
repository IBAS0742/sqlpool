
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

var diyigeTableService = require('./mysqlInit/mysqlinit.js').diyigeTableService;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/list', function (req, res) {
  diyigeTableService.getAll(function(results){
    res.json({datas : results});
  },"diyige");
});
console.info("test list by http://localhost:3002/list");

app.get('/index/insert',function(req,res){
  var mingchen = req.query.mingchen,
      nianling = req.query.nianling,
      mima = req.query.mima;
  diyigeTableService.insert({
    mingchen : mingchen,
    nianling : nianling,
    mima : mima
  },function(results){
    res.json({result : results});
  },"diyige");
});
console.info("test insert by http://localhost:3002/index/insert?mingchen=ibas&nianling=123&mima=123456");

app.get('/index/delete',function(req,res){
  diyigeTableService.delete({
    conditionStr :  "nianling=13"
  },function(results){
    res.json({result : results});
  },"diyige");
});
console.info("test delete by http://localhost:3002/index/delete");

app.get('/index/update',function(req,res){
  diyigeTableService.update({
    conditionStr :  "nianling=1",
    setStr : "mingchen ='lala'"
  },function(results){
    res.json({result : results});
  },"diyige");
});
console.info("test update by http://localhost:3002/index/update");

app.get('/index/select',function(req,res){
  if (req.query.method == 1) {
    diyigeTableService.select({
      conditionStr :  "nianling=1",
      cols : ['mingchen','nianling']
    },function(results){
      res.json({result : results});
    },"diyige");
  } else {
    diyigeTableService.select({
      condition : {
        "nianling" : {
          sig : "=",
          value : "1"
        }
      },
      cols : ['mingchen','nianling']
    },function(results){
      res.json({result : results});
    },"diyige");
  }
});
console.info("test select by http://localhost:3002/index/select");

app.get('/index/tran',function(req,res){
  diyigeTableService.executeTransaction(
      [
        "select * from diyige",
        "select * from diyige"
      ],
      function(err,info){
        if (err) {
          res.json({"data" : err});
        } else {
          res.json({"data" : info});
        }
      });
});
console.info("test transaction by http://localhost:3002/index/tran");

app.get('/index/ext',function(req,res){
  diyigeTableService.myMethod(function(result){
    res.json({"data" : result});
  });
});
console.info("test ext method by http://localhost:3002/index/ext");

app.listen(3002, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  console.warn("你可能需要先建立数据库，名称为nodejs,接着建立表名为diyige的数据表");
  console.info("表 diyige 的创建方法为:");
  console.info("CREATE TABLE `diyige` (\r\n" +
      "    `mingchen` varchar(255) NOT NULL,\r\n" +
      "    `nianling` int(11) NOT NULL,\r\n" +
      "    `mima` varchar(255) DEFAULT NULL\r\n" +
      ") ENGINE=InnoDB DEFAULT CHARSET=utf8")
});
