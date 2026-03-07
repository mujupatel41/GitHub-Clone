import React, { useState, useEffect } from "react";
import "./Dashboard.css"

const Dashboard = () =>{
    const [ repositories, setRepositories ] = useState([]);
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ suggestedRepositories, setSuggestedRepositories ] = useState([]);
    const [ searchResults, setSearchResults ] = useState([]);

    useEffect(()=>{
        const userId = localStorage.getItem("userId");

        const fetchRepositories = async () => {
            try {
                const response = await fetch(`http://localhost:5000/repo/user/${userId}`);
                const data = await response.json();
            
                
                setRepositories(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching repositories:", error);
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
        if(searchQuery == ""){
            setSearchResults(repositories);
        } else{
            const filteredRepo = repositories.filter((repo) => repo.name.toLowerCase().include(searchQuery.toLowerCase()));
            setSearchResults(filteredRepo);
        }
    },[searchQuery, repositories])

    return (
        <section id="dashboard">
            <aside>
                <h3>Suggested Repositories</h3>
                {suggestedRepositories.map((repo) => {
                    return (
                        <div key={repo._id}>
                            <h4>{repo.name}</h4>
                            <i>{repo.owner.username}</i>
                        </div>
                    )
                })}
            </aside>
            <main>
                <h2>Your Repositories</h2>
                {repositories.map((repo) => {
                    return (
                        <div key={repo._id}>
                            <h4>{repo.name}</h4>
                            <i>{repo.owner}</i>
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