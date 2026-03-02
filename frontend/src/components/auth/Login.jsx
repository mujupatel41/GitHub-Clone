import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext';
import { Link } from 'react-router-dom';

import { PageHeader, Button } from '@primer/react';
import "./auth.css";

import logo from '../../assets/github-icon.svg'

const Login = () =>{

    const { currentUser, setCurrentUser } = useAuth();

    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setCurrentUser(null);
    }, [setCurrentUser]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:5000/login", {
                email,
                password,
            });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            setCurrentUser(res.data.userId);
            setLoading(false);
            window.location.href = "/";
        } catch (err) {
            console.error(err);
            alert("Login Failed!");
            setLoading(false);
        }
    };

    return (
        <div className="login-wraper">

            <div className="login-box-wrapper">
                <div className="login-logo-container">
                    <img className='logo-login' src={logo} alt="github-logo" />
                </div>

                <div className="login-heading" >
                        <PageHeader>
                            <PageHeader.TitleArea variant="large">
                                <PageHeader.Title>Login</PageHeader.Title>
                            </PageHeader.TitleArea>
                        </PageHeader>
                </div>

                <div className="login-box">
                    <div>
                        <label className='label' htmlFor="email">Email</label>
                        <input
                            autoComplete='off'
                            name='email'
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            id='email'
                            className='input'
                            type="email"
                        />
                    </div>

                    <div className="div">
                        <label className='label' htmlFor="password">Password</label>
                        <input
                            autoComplete='off'
                            name='password'
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            id='password'
                            className='input'
                            type="password"
                        />
                    </div>

                    <Button
                        variant='primary'
                        disabled={loading}
                        className='login-btn'
                        onClick={handleLogin}
                    >
                        {loading ? "Loading..." : "Login"}
                    </Button>
                </div>

                <div className="pass-box">
                    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                </div>
            </div>
        </div>
    )
};

export default Login;