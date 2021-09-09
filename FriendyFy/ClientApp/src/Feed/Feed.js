import React from 'react';
import './TermsOfService.css';

const Feed = () =>(
    <ul className="terms-of-service">
        <li><a href="">Privacy</a></li>
        <li><a href="">Terms</a></li>
        <li><a href="">Cookies</a></li>
        <li><a href="">FriendyFy © {new Date().getFullYear()}</a></li>
    </ul>
    )

export default TermsOfService;