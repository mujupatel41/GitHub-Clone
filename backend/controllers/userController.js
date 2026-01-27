const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;

dotenv.config();

const uri = process.env.MONGODB_URL;

let client;

async function connectClient(){
    if(!client){
        client = new MongoClient(uri);

        await client.connect();
    };
}

const signup =  async (req, res) =>{
    const {username, password, email} = req.body;
    
    try{
        await connectClient();
        const db = client.db("githubclone");
        const usersCollections = db.collection("users");

        const user = await usersCollections.findOne({username});
        if(user){
            return res.status(400).json({message: "User already exists!"});
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUser: [],
            starRepos: [],
        };

        const result = await usersCollections.insertOne(newUser);

        const token = jwt.sign({id: result.insertedId},
            process.env.JWT_SECRET_KEY,
            {expiresIn: "160h"}
        );

        res.json({token});
    } catch(err){
        console.error("Error during signup : ", err.message);
        res.status(500).send("Server Error!");
    }
};

const login = async (req, res) =>{

    const {email, password} = req.body;

    try{

        await connectClient();

        const db = client.db("githubclone");
        const usersCollections = db.collection("users");

        const user = await usersCollections.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid credentials!"});
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials!"});
        };

        const token = jwt.sign({id: user._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn: "160h"},
        );

        res.json({token, userId: user._id});

    } catch(err){
        console.error("Error during login : ", err.message);
        res.status(500).send("Server Error");
    }
};

const getAllUsers = async (req, res) =>{
    try{
        await connectClient();

        const db = client.db("githubclone");
        const usersCollections = db.collection("users");

        const users = await usersCollections.find({}).toArray();

        res.json(users);

    } catch(err){
        console.error("Error via fetching users : ", err.message);
        res.status(500).send("Server Error");
    }
};

const getUserProfile = async (req, res) =>{
    const id = req.params.id;
    
    try{

         await connectClient();

        const db = client.db("githubclone");
        const usersCollections = db.collection("users");

        const user = await usersCollections.findOne({_id: new ObjectId(id)});
        if(!user){
            return res.status(404).json({message: "User not found!"});
        };

        res.send(user);
    } catch(err){
        console.error("Error via getting user Profile : ", err.message);
        res.status(500).send("Server Error");
    }
};

const updateUserProfile = async (req, res) =>{
    res.send("Profile Updated!");
};

const deleteUserProfile = async (req, res) =>{
    console.log("Profile Deleted!");
};

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};