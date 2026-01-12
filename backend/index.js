const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/initRepo");
const { addRepo } = require("./controllers/addRepo");
const { commitRepo } = require("./controllers/commitRepo");
const { pushRepo } = require("./controllers/pushRepo");
const { pullRepo } = require("./controllers/pullRepo");
const { revertRepo }= require("./controllers/revertRepo");

yargs(hideBin(process.argv))
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
    addRepo
).command(
    "commit <message>",
    "Commit the staged file",
    (yargs) =>{
        yargs.positional("message", {
            describe: "Commit message",
            type: "string"
        });
    },
    commitRepo
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
    revertRepo
).demandCommand(1, "You atleast need one command").help().argv;