import React from "react"
import { Link } from "react-router-dom";
import './SiteInfoButtons.css'
const SiteInfoButtons = () =>(
    <ul className="terms-of-service">
        <li><Link to="/privacy">Privacy</Link></li>
        <li><Link to="/tos">Terms</Link></li>
        <li><Link to="/cookies">Cookies</Link></li>
        <li><Link to="/">FriendyFy © {new Date().getFullYear()}</Link></li>
    </ul>
    )

    export default SiteInfoButtons;