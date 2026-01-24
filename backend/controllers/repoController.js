const createRepository = (req, res) =>{
    res.send("Repository was Created!");
};

const getAllRepositories = (req, res) =>{
    res.send("All Repository Fethed!");
};

const fetchRepositoryById = (req, res) =>{
    res.send("Repository details fetched!");
};

const fetchRepositoryByName = (req, res) =>{
    res.send("Repository was Created!");
};
const fetchRepositoryForCurrentUser = (req, res) =>{
    res.send("Repositories for logged in user fetched!");
};

const updateRepositoryById = (req, res) =>{
    res.send("Repository Updated!");
};

const toggleVisibilityById = (req, res) =>{
    res.se;nd("Visibility Toggled!");
}

const deleteRepositoryById = (req, res) =>{
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