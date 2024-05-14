const PROTO_PATH = "./cve.proto";
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const CveService = grpc.loadPackageDefinition(packageDefinition).CveService;;

const client = new CveService(
    "localhost:30043",
    grpc.credentials.createInsecure()
);

module.exports = client;