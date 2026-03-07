import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { PageHeader, Button } from '@primer/react';
import "./auth.css";

import logo from "../../assets/github-icon.svg";

const Signup = () =>{

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) =>{
        e.preventDefault();

        try{
            setLoading(true);
            const res = await axios.post("http://localhost:5000/signup", {
                email: email,
                password: password,
                username: username
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);

            setLoading(false);

            window.location.href = "/";
        } catch(err){
            console.error(err);
            alert("Signup Failed!");
            setLoading(false);
        }
    }

    return (
        <div className="login-wraper">
           

            <div className="login-box-wrapper">
                <div className="login-logo-container">
                    <img className='logo-login' src={logo} alt="github-logo" />
                </div>

                <div className="login-heading" style={{ padding: 8 }}>
                        <PageHeader>
                            <PageHeader.TitleArea variant="large">
                                <PageHeader.Title>Sign Up</PageHeader.Title>
                            </PageHeader.TitleArea>
                        </PageHeader>
                </div>

                <div className="login-box">
                    <div>
                        <label className='label' htmlFor="Username">Username</label>

                        <input autoComplete='off' name='Username' value={username}
                            onChange={(e)=>setUsername(e.target.value)} id='Username' className='input' type='text' />

                    </div>

                    <div>
                        <label className='label' htmlFor="email">Email</label>

                        <input autoComplete='off' name='email' value={email}
                            onChange={(e)=>setEmail(e.target.value)} id='email' className='input' type="email" />
                    </div>

                    <div className="div">
                        <label className='label' htmlFor="password">Password</label>

                        <input autoComplete='off' name='password' value={password}
                            onChange={(e)=>setPassword(e.target.value)} id='password' className='input' type="password" />
                    </div>

                    <Button variant='primary' disabled={loading} className='login-btn'
                        onClick={handleSignup}>{loading? "Loading..." : "Sign Up"}</Button>
                </div>

                <div className="pass-box">
                    <p>Already have an account? <Link to="/auth">Login</Link></p>
                </div>
            </div>
        </div>
        
    )
};

export default Signup;