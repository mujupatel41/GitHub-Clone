import React, { useState, useEffect } from "react";
import "./Dashboard.css"
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange } from '@mui/material/colors';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';

const Dashboard = () =>{
    const [ repositories, setRepositories ] = useState([]);
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ suggestedRepositories, setSuggestedRepositories ] = useState([]);
    const [ searchResults, setSearchResults ] = useState([]);

    useEffect(()=>{
        const userId = localStorage.getItem("userId");
console.log(userId)
        const fetchRepositories = async () => {
            try {
                const response = await fetch(`http://localhost:5000/repo/user/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setRepositories(data);
                } else {
                    // No repositories found for the user
                    setRepositories([]);
                }
            } catch (error) {
                console.error("Error fetching repositories:", error);
                setRepositories([]);
            }
        };

        const fetchSuggestedRepositories = async () => {
            try {
                const response = await fetch(`http://localhost:5000/repo/all`);
                const data = await response.json();
            
                
                setSuggestedRepositories(data);
                // console.log(data);
            } catch (error) {
                console.error("Error fetching repositories:", error);
            }
        };

        if (userId) {
            fetchSuggestedRepositories();
            fetchRepositories();
        } else {
            console.warn("No userId found in localStorage");
        }
    }, []);

    useEffect(()=>{
        if(searchQuery === ""){
            setSearchResults(repositories);
        } else{
            const filteredRepo = repositories.filter((repo) => repo.name.toLowerCase().includes(searchQuery.toLowerCase()));
            setSearchResults(filteredRepo);
        }
    },[searchQuery, repositories])

    console.log(searchResults)

    return (
        <section id="dashboard">
            <aside id="user-repo">
                <div id="username">
                    <AccountCircleIcon className="user-icon" />
                    <b className="username-text">{repositories.length > 0 ? repositories[0].ownerDetails.username : 'No repos'}</b>
                </div>

                <div id="top-repo">
                    <p>Top Repositories</p>
                    <button className="new-repo-btn"><DriveFolderUploadOutlinedIcon className="btn-icon" />New</button>
                </div>
                
                <div id="search">
                    <input type="text" className="user-repo-search" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}  placeholder="Find a repository.." />
                </div>
                {searchResults.map((repo) => {
                    return (
                        <div className="user-repo" key={repo._id}>
                            <AccountCircleIcon className="user-icon" />
                            <p>{repo.ownerDetails.username}/{repo.name}</p>
                        </div>
                    )
                })}
            </aside>

            <main id="main">
                <h3>Suggested Repositories</h3>
                {suggestedRepositories.map((repo) => {
                    return (
                        <div key={repo._id}>
                            <h4>{repo.name}</h4>
                            <i>{repo.owner.username}</i>
                        </div>
                    )
                })}
            </main>
            
            <aside>
                <h3>Upcoming Events</h3>
                <ul>
                    <li>Tech Conference - 15-Mar</li>
                    <li>Developer Meetup - 26-Apr</li>
                    <li>React Sumit - 21-May</li>
                </ul>
            </aside>
        </section>
    )
};

export default Dashboard;