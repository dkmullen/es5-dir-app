

var uri = "mongodb://dkmullen:meThELOU@clusterdir-shard-00-02-jphcz.mongodb.net:27017,clusterdir-shard-00-00-jphcz.mongodb.net:27017,clusterdir-shard-00-01-jphcz.mongodb.net:27017/dir-project?ssl=true&replicaSet=ClusterDIR-shard-0&authSource=admin";
var uri2 = 'mongodb://localhost:27017/directory-app';

module.exports = {
    'secret': 'fakesecret',
    'mongoUrl' : uri
};
// To start mongo on Windows - "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe"
