import React, {useState, useEffact} from 'react';
import axios from 'axios';
import {useAuth} from '../../authContext';

import {PageHeader} from '@primer/react/drafts';
import { Box, Button } from '@primer/react';
import "./auth.css";

import Logo from '../../assets/github-icon.svg'

const Login = () =>{

    useEffect(()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setCurrentUser(null);
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [Loading, setLoading] = useState(false);
    const {currentUser, setCurrentUser} = useAuth();


    return (
        <div className="login-wraper">
            <div className="login-logo-container">
                <img className='logo-login' src={Logo} alt="github-logo" />
            </div>

            <div className="login-box-wrapper">
                <div className="login-heading">
                    <Box sx={{ padding: 1 }}>
                        <PageHeader>
                            
                        </PageHeader>
                    </Box>
                </div>
            </div>
        </div>
    )
};

export default Login;