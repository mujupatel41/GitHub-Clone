const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

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
        const db = client.db("mujupatel41");
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
            {expiresIn: "1h"}
        );

        res.json({token});
    } catch(err){
        console.error("Error during signup : ", err.message);
        res.status(500).send("Server Error!");
    }
};

const login = (req, res) =>{
    res.send("Logging In!");
};

const getAllUsers = (req, res) =>{
   res.send("All Users Fetched!");
};

const getUserProfile = (req, res) =>{
    res.send("Profile Fetched!");
};

const updateUserProfile = (req, res) =>{
    res.send("Profile Updated!");
};

const deleteUserProfile = (req, res) =>{
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