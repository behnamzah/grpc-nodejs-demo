require('dotenv').config()
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');

let { blogs } = require('./data/blogs')
const PROTO_PATH = __dirname + '/proto/blog.proto'
const PORT = process.env.PORT || 5100
const BIND_ADDRESS = `0.0.0.0:${PORT}`;

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
}

let packageDefinition =  protoLoader.loadSync(PROTO_PATH, options);
let blogProto = grpc.loadPackageDefinition(packageDefinition).blog;

/**
 * Get blog details
 * @param call
 * @param callback
 */

function getDetails(call, callback){
    callback(null, { message: _.find(blogs, {id: call.request.id})});
}

function main(){

    // create new grpc server
    let server = new grpc.Server();

    // register handlers
    server.addService(blogProto.Blog.service, {getDetails: getDetails});

    // define the server host/port
    // server.bindAsync is an async function
    // and the callback function indicates that the operation is complete. 
    // So, you should call server.start in the callback.
    server.bindAsync(
        BIND_ADDRESS, 
        grpc.ServerCredentials.createInsecure(),
        (err, port)=>{
            if (err != null) {
                return console.error(err);
            }
            // start grpc server
            server.start();
            console.log(`gRPC listening on : ${port}`);
        }
    );

}

main();