const express = require("express");
const dotenv = require("dotenv"); 
const mongoose = require("mongoose");
const http = require("http");
const bodyParser = require("body-parser");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/initRepo");
const { addRepo } = require("./controllers/addRepo");
const { commitRepo } = require("./controllers/commitRepo");
const { pushRepo } = require("./controllers/pushRepo");
const { pullRepo } = require("./controllers/pullRepo");
const { revertRepo }= require("./controllers/revertRepo");

dotenv.config();

yargs(hideBin(process.argv))
.command("start", "Starts a new Server",{}, startServer )
.command("init", "Initialized a new repository", {}, initRepo)
.command(
    "add <file>",
    "Add a file to repository",
    (yargs) =>{
        yargs.positional("file", {
            describe: "File to add to the staging area",
            type: "string"
        });
    },
    (argv)=>{
        addRepo(argv.file)
    }
).command(
    "commit <message>",
    "Commit the staged file",
    (yargs) =>{
        yargs.positional("message", {
            describe: "Commit message",
            type: "string"
        });
    },
    (argv)=>{
        commitRepo(argv.message)
    }
).command("push", "Push commit to s3", {}, pushRepo
).command("pull", "Pull Commits from s3", {}, pullRepo
).command("revert <commitID>",
    "Revert to a specific commit",
    (yargs) =>{
        yargs.positional("CommitID", {
            describe: "Commit ID to revert to",
            type: "string"
        })
    },
    (argv)=>{
        revertRepo(argv.commitID)
    }
    
).demandCommand(1, "You atleast need one command").help().argv;

function startServer(){
    const app = express();
    const port = process.env.PORT || 3000;
    
    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURI = process.env.MONGODB_URL;

    mongoose.connect(mongoURI)
    .then(()=> console.log("MongoDB Connected!"))
    .catch((err)=>console.error("Unable to connect: ", err));

}