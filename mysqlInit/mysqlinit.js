
var mysqlPool = require("sqlpool").sqlpool;

throw new Error("please complete the connection information");
mysqlPool.init(
    {
        host: 'localhost',
        user: '*******',
        password: '******'
    },"nodejs","diyige"
);

var diyigeTableService = mysqlPool.methods;

diyigeTableService.myMethod = function(callback) {
    var defaultDear = this.defaultDear; //[*]这里仅仅需要时才要编写
    this.defaultGetOneConnection(function(connection,tableName){
        connection.query("select * from diyige",function(err,results) {
            defaultDear(err,results,callback);  //[*]这里已经在上方定义了该函数
        });
    });
};

module.exports.diyigeTableService = diyigeTableService ;
