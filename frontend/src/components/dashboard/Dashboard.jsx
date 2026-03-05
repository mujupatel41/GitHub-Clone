import React, { useState, useEffect } from "react";

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
                console.log(data);
            } catch (error) {
                console.error("Error fetching repositories:", error);
            }
        };

        if (userId) {
            fetchSuggestedRepositories();
        } else {
            console.warn("No userId found in localStorage");
        }
    }, [])

    return (
        <h1>Dashboard</h1>
    )
};

export default Dashboard;