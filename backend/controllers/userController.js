const getAllUsers = (req, res) =>{
    console.log("All Users Fetched!");
};

const signup =  (req, res) =>{
    console.log("Signed Up!");
};

const login = (req, res) =>{
    console.log("Logging In!");
};

const getUserProfile = (req, res) =>{
    console.log("Profile Fetched!");
};

const updateUserProfile = (req, res) =>{
    console.log("Profile Updated!");
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