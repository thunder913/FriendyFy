import React from 'react';
import './TermsOfService.css';

const TermsOfService = () =>(
    <ul className="terms-of-service">
        <li><button href="">Privacy</button></li>
        <li><button href="">Terms</button></li>
        <li><button href="">Cookies</button></li>
        <li><button href="">FriendyFy © {new Date().getFullYear()}</button></li>
    </ul>
    )

export default TermsOfService;