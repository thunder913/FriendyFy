import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCog, faCog } from '@fortawesome/free-solid-svg-icons'
import './UserOptions.css';
import OutsideClickHandler from 'react-outside-click-handler';
import { CSSTransition } from 'react-transition-group';
import { DarkModeToggle } from "react-dark-mode-toggle-2";
import { useLoggedIn } from '../../contexts/LoggedInContext';
import { changeUserTheme, logout } from '../../services/userService'
import { useThemeContext } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
const UserOptions = () => {
    const [show, setShow] = useState(false);
    const { loggedIn, setLoggedIn } = useLoggedIn();
    const { changeTheme, theme } = useThemeContext();
    const [isDarkMode, setIsDarkMode] = useState(false);

    const logoutUser = () => {
        logout()
            .then(async () => {
                await setLoggedIn(false);
            });
    }

    const changeThemeEvent = () => {
        let theme = !isDarkMode ? 'dark' : 'light';
        changeTheme(theme);
        setIsDarkMode(prev => !prev);
        if(loggedIn){
            changeUserTheme(loggedIn.userName, theme)
                .then(res => {
                    if(res.status === 200){
                        changeTheme(theme);
                    }
                });
        }
    }

    useEffect(() => {
        setIsDarkMode(theme === 'dark' ? true : false);
    }, [theme])

    return (<div className="navigation-settings" >
        <div className="circle-right" onClick={() => setShow(true)}>
            <FontAwesomeIcon icon={loggedIn ? faUserCog : faCog} />
        </div>
        <OutsideClickHandler
            onOutsideClick={() => {
                setShow(false);
            }}>
            <CSSTransition
                in={show}
                timeout={200}
                classNames="animation-options"
                unmountOnExit
                onEnter={() => setShow(true)}
                onExited={() => setShow(false)}>
                <div className="user-options">
                    {loggedIn ? <Link to="/settings" className="user-option-button">Preferences</Link> : ''}
                    {loggedIn ? <button className="user-option-button" onClick={logoutUser}>Logout</button> :
                        <Link to="/" className="user-option-button" onClick={logoutUser}>Login</Link>}
                    <DarkModeToggle
                        onChange={() => { changeThemeEvent(); }}
                        isDarkMode={isDarkMode}
                        size={70}
                        speed={1.2}
                        className="toggle-mode"
                    />
                </div>
            </CSSTransition>
        </OutsideClickHandler>
    </div >)
}

export default UserOptions;