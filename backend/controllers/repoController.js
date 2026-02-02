const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");
const User = require("../models/userModel");
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


const createRepository = async (req, res) =>{
    const { owner, name, issues, content, description, visibility } = req.body;
    
    try{

        await connectClient();
        const db = client.db("githubclone");
        const repoCollection = db.collection("repositories");

        if(!name){
            return res.status(400).json({error: "Repository name is required!"});
        };

        if(!ObjectId.isValid(owner)){
            return res.status(400).json({ error: "Invalid user ID!"});
        };

        const newRepository = {
            name,
            description,
            content,
            visibility,
            owner,
            issues
        };

        const result = await repoCollection.insertOne(newRepository);

        res.status(201).json({ message: "Repository Created!", repositoryId: result._id});

    } catch(err){
        console.error("Error via creating repository : ", err.message);
        res.status(500).send("Server Error!");
    }
};

const getAllRepositories = async (req, res) =>{
    res.send("All Repository Fethed!");
};

const fetchRepositoryById = async (req, res) =>{
    res.send("Repository details fetched!");
};

const fetchRepositoryByName = async (req, res) =>{
    res.send("Repository was Created!");
};
const fetchRepositoryForCurrentUser = async (req, res) =>{
    res.send("Repositories for logged in user fetched!");
};

const updateRepositoryById = async (req, res) =>{
    res.send("Repository Updated!");
};

const toggleVisibilityById = async (req, res) =>{
    res.se;nd("Visibility Toggled!");
}

const deleteRepositoryById = async (req, res) =>{
    res.send("Repository Deleted!");
};

module.exports = {
    createRepository,
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoryForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById,
}