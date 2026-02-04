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
    const {userId} = req.user;
    
    try{
        await connectClient();
        const db = client.db("githubclone");
        const repoCollection = db.collection("repositories");

        const repository = await repoCollection.find({owner: userId}).toArray();
        
        if(!repository || repository.length == 0){
            return res.status(404).json({error: "User Reposiories Not Found!"});
        }
        res.json(repository);
    } catch(err){
        console.error("Error via fething User Repositories : ", err.message);
        res.status(500).send("Server Error!");
    }
};

const updateRepositoryById = async (req, res) =>{
    const repoId = req.params.id;
    const {content, description} = req.body;

    try{
        await connectClient();
        const db = client.db("githubclone");
        const repoCollection = db.collection("repositories");

        const result = await repoCollection.updateOne(
            {_id: new ObjectId(repoId)},
            { $set: { content, description } }
        );

        if(result.matchedCount == 0){
            return res.status(404).json({error: "No document found to update!"});
        }

        res.json({message: "Repository Updated Successfully!", 
            result
        });
    } catch(err){
        console.error("Error via Updating Repository : ", err.message);
        res.status(500).send("Server Error!");
    }
};

const toggleVisibilityById = async (req, res) =>{
    const repoId = req.params.id;

    try{
        await connectClient();
        const db = client.db("githubclone");
        const repoCollection = db.collection("repositories");

        const repository = await repoCollection.findOne({_id: new ObjectId(repoId)});

        if(!repository){
            return res.status(404).json({error: "No document found to update!"});
        }

        const result = await repoCollection.updateOne(
            {_id: new ObjectId(repoId)},
            { $set: { visibility: !repository.visibility } }
        );

        res.json({message: "Repository Visibility Toggled!", 
            result
        });
    } catch(err){
        console.error("Error via Toggling visibility : ", err.message);
        res.status(500).send("Server Error!");
    }
}

const deleteRepositoryById = async (req, res) =>{
    const repoId = req.params.id;

    try{   
        await connectClient();
        const db = client.db("githubclone");
        const repoCollection = db.collection("repositories");

        const result = await repoCollection.deleteOne({_id: new ObjectId(repoId)});
        if(result.matchedCount == 0){
            return res.status(404).json({error: "No repository found to delete!"});
        }

        res.json({message: "Repository Deleted Successfully!"});
    } catch(err){
        console.error("Error via Deleting Repository : ", err.message);
        res.status(500).send("Server Error!");
    }
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