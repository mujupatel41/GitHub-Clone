import React, { useState, useEffect } from "react";
import "./Dashboard.css"
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange } from '@mui/material/colors';

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

    console.log(repositories)

    return (
        <section id="dashboard">
            <aside id="user-repo">
                
                <h4 id="username"><Stack direction="row" spacing={2}>
                    <Avatar src="/broken-image.jpg" />
                </Stack>{repositories.length > 0 ? repositories[0].ownerDetails.username : 'No repos'}</h4>
                <div id="search">
                    <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}  placeholder="Search.." />
                </div>
                {searchResults.map((repo) => {
                    return (
                        <div key={repo._id}>
                            <h4>{repo.name}</h4>
                            <i>{repo.owner.username}</i>
                        </div>
                    )
                })}
            </aside>

            <main>
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