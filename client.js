require('dotenv').config()
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

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

function main(){

    // create new grpc client
    let client = new blogProto.Blog(BIND_ADDRESS,grpc.credentials.createInsecure());
    let blogId;

    // insure about blog id
    // default id is 1
    if (process.argv.length >= 3) {
        blogId = process.argv[2];
    } else {
        blogId = 1;
    }

    client.getDetails({id: blogId}, (err, response) => {
        console.log('Blog Details for Blog Id:', blogId, '\n', response.message);
    });
}

main()
