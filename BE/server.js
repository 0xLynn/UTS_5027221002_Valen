const PROTO_PATH = "./cve.proto";
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require('mongodb');

const mongoURI = "mongodb+srv://bhiss:bhiss@cluster0.hayyitg.mongodb.net";
const dbName = "cve_database";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const cvesProto = grpc.loadPackageDefinition(packageDefinition);

// Dummy
const arrayOfCves = [
    { id: "1", title: "CVE-2024-001", severity: "High", platform: "Linux" },
    { id: "2", title: "CVE-2024-002", severity: "Medium", platform: "Windows" },
    { id: "3", title: "CVE-2024-003", severity: "Low", platform: "Mac" }
];

let db;

MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log("Connected to MongoDB");
        db = client.db(dbName);
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    });

const server = new grpc.Server();

server.addService(cvesProto.CveService.service, {
    getAll: (_, callback) => {
        try {
            // Implement code to fetch all CVEs from database
            const getAllCves = arrayOfCves;
            callback(null, { cves: getAllCves });
        } catch (error) {
            console.error("Error fetching cves:", error);
            callback({
                code: grpc.status.INTERNAL,
                details: "Internal server error"
            });
        }
    },

    get: (call, callback) => {
        try {
            // Implement code to fetch a single CVE by ID from database
            const cve = arrayOfCves.find(cve => cve.id === call.request.id);
            if (cve) {
                callback(null, cve);
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "cve not found"
                });
            }
        } catch (error) {
            console.error("Error fetching cve:", error);
            callback({
                code: grpc.status.INTERNAL,
                details: "Internal server error"
            });
        }
    },

    insert: (call, callback) => {
        try {
            // Implement code to insert a new CVE into database
            const cveData = call.request;
            const newCve = { id: uuidv4(), ...cveData };
            arrayOfCves.push(newCve);
            callback(null, newCve);
        } catch (error) {
            console.error("Error inserting cve:", error);
            callback({
                code: grpc.status.INTERNAL,
                details: "Internal server error"
            });
        }
    },

    update: (call, callback) => {
        try {
            // Implement code to update an existing CVE in database
            const cveIndex = arrayOfCves.findIndex(cve => cve.id === call.request.id);
            if (cveIndex !== -1) {
                arrayOfCves[cveIndex] = { ...arrayOfCves[cveIndex], ...call.request };
                callback(null, arrayOfCves[cveIndex]);
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "cve not found"
                });
            }
        } catch (error) {
            console.error("Error updating cve:", error);
            callback({
                code: grpc.status.INTERNAL,
                details: "Internal server error"
            });
        }
    },

    remove: (call, callback) => {
        try {
            // Implement code to remove a CVE from database
            const indexToRemove = arrayOfCves.findIndex(cve => cve.id === call.request.id);
            if (indexToRemove !== -1) {
                arrayOfCves.splice(indexToRemove, 1);
                callback(null, {});
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Cve not found"
                });
            }
        } catch (error) {
            console.error("Error removing cve:", error);
            callback({
                code: grpc.status.INTERNAL,
                details: "Internal server error"
            });
        }
    }
});

// Start the gRPC server
server.bindAsync("localhost:30043", grpc.ServerCredentials.createInsecure(), () => {
    console.log("Server running at port 30043");
});
