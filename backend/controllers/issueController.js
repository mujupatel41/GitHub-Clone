const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const { deleteOne } = require("../models/repoModel");
const ObjectId = require("mongodb").ObjectId;

dotenv.config();

let uri = process.env.MONGODB_URL;

let client;

async function connectClient(){
    if(!client){
        client = new MongoClient(uri);

        await client.connect();
    };
}

const createIssue = async (req, res) =>{
    const { title, description, repoId } = req.body;

    try{
        await connectClient();
        const db = client.db("githubclone");
        const issueCollection = db.collection("issues");

        const repository = await db.collection("repositories").findOne({ _id: new ObjectId(repoId) });
        if (!repository) {
        return res.status(404).json({ error: "Repository not found!" });
        }

        if(!title){
            return res.status(400).json({error: "Issue title is required!"});
        }

        if(!ObjectId.isValid(repoId)){
            return res.status(400).json({ error: "Invalid repo ID!"});
        };

        let details = {
            title,
            description,
            repository: new ObjectId(repoId)
        }

        const result = await issueCollection.insertOne(details);

        res.status(201).json({message: "Issue created successfully!", result});

    } catch(err){
        console.error("Error via creating Issue : ", err.message);
        res.status(500).send("Server Error!");
    }
};

const updateIssueById = async (req, res) =>{
    const id = req.params.id;
    const { title, description, status } = req.body;

    try{
        await connectClient();
        const db = client.db("githubclone");
        const issueCollection = db.collection("issues");

        const updatedIssue = await issueCollection.updateOne({_id: new ObjectId(id)},
            {$set: {title: title, description: description, status: status}});
        
        if(updatedIssue.mathedCount == 0){
            return res.status(404).json({error: "Issue Not Found!"});
        }

        res.json({message: "Issue Updated Successfully!", updatedIssue});
    } catch(err){
        console.error("Error via updating Issue : ", err.message);
        res.status(500).send("Server Error!");
    }
};

const deleteIssueById = async (req, res) =>{
    const id = req.params.id;

    try{
        await connectClient();
        const db = client.db("githubclone");
        const issueCollection = db.collection("issues");

        const deletedIssue = await issueCollection.deleteOne({_id: new ObjectId(id)});

        if(deletedIssue.deletedCount == 0){
            return res.status(404).json({error: "issue not found!"});
        }

        res.json({message: "Issue Deleted!", deletedIssue});
    } catch(err){
        console.error("Error via deleting Issue : ", err.message);
        res.status(500).send("Server Error!");
    }
};

const getAllIssues = async (req, res) =>{
    
    try{
        await connectClient();
        const db = client.db("githubclone");
        const issueCollection = db.collection("issues");

        const issues = await issueCollection.find({}).toArray();

        if(!issues){
            return res.status(404).json({error: "issues not found"});
        }
        res.json(issues);
    } catch(err){
        console.error("Error via fething Issues : ", err.message);
        res.status(500).send("Server Error!");
    }
};

const getIssueById = async (req, res) =>{
    const id = req.params.id;

    try{
        await connectClient();
        const db = client.db("githubclone");
        const issueCollection = db.collection("issues");

        const issue = await issueCollection.findOne({_id: new ObjectId(id)});

        if(!issue){
            return res.status(404).json({error: "issue not found"});
        }

        res.json(issue);
    } catch(err){
        console.error("Error via fething Issue by ID : ", err.message);
        res.status(500).send("Server Error!");
    }
};

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById,
};