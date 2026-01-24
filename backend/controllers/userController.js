const getAllUsers = (req, res) =>{
   res.send("All Users Fetched!");
};

const signup =  (req, res) =>{
    res.send("Signed Up!");
};

const login = (req, res) =>{
    res.send("Logging In!");
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