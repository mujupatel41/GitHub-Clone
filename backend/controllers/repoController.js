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

    try{
        await connectClient();
        const db = client.db("githubclone");
        const repoCollection = db.collection("repositories");

        const repositories = await repoCollection.aggregate([
    {
        // Convert the 'owner' string to an actual ObjectId before the join
        $addFields: {
            ownerId: { $toObjectId: "$owner" }
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "ownerId", // Use the converted field here
            foreignField: "_id",
            as: "owner"
        }
    },
    { $unwind: "$owner" },
    {
        // Optional: Exclude sensitive info like passwords from the owner object
        $project: {
            "owner.password": 0,
            "owner.email": 0
        }
    }
]).toArray();

        res.json(repositories)
    } catch(err){
        console.error("Error via fething repositories : ", err.message);
        res.status(500).send("Server Error!");
    }
};

const fetchRepositoryById = async (req, res) =>{
    const repoID = req.params.id;
    
    try{
        await connectClient();
        const db = client.db("githubclone");
        const repoCollection = db.collection("repositories");

        const repository = await repoCollection.aggregate([
            {
                $match: {
                    _id: new ObjectId(repoID),
                }
            },
            {
                // Convert the 'owner' string to an actual ObjectId before the join
                $addFields: {
                    ownerId: { $toObjectId: "$owner" }
                }
            },
            {
                // 3. Now you can populate (lookup) the user
                $lookup: {
                    from: "users",
                    localField: "ownerId",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            {
                // 4. Flatten the ownerDetails array into an object
                $unwind: "$owner"
            },
            {
                // Optional: Exclude sensitive info like passwords from the owner object
                $project: {
                    "owner.password": 0,
                    "owner.email": 0
                }
            }
    
        ]).toArray();
        res.json(repository);
    } catch(err){
        console.error("Error via fething repository by ID : ", err.message);
        res.status(500).send("Server Error!");
    }
};

const fetchRepositoryByName = async (req, res) =>{
    const repoName = req.params.name;
    
    try{
        await connectClient();
        const db = client.db("githubclone");
        const repoCollection = db.collection("repositories");

        const repository = await repoCollection.aggregate([
            {
                $match: {
                    name: repoName,
                }
            },
            {
                // Convert the 'owner' string to an actual ObjectId before the join
                $addFields: {
                    ownerId: { $toObjectId: "$owner" }
                }
            },
            {
                // 3. Now you can populate (lookup) the user
                $lookup: {
                    from: "users",
                    localField: "ownerId",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            {
                // 4. Flatten the ownerDetails array into an object
                $unwind: "$owner"
            },
            {
                // Optional: Exclude sensitive info like passwords from the owner object
                $project: {
                    "owner.password": 0,
                    "owner.email": 0
                }
            }
    
        ]).toArray();
        res.json(repository);
    } catch(err){
        console.error("Error via fething repository by Name : ", err.message);
        res.status(500).send("Server Error!");
    }
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