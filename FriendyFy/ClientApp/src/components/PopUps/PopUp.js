import React, { useEffect } from 'react'
import './PopUp.css'
import useScrollBlock from '../../hooks/useScrollBlock'
import { CSSTransition } from 'react-transition-group'

const PopUp = ({ children, show, setShow, escClose, manyPopUps }) => {
    const [blockScroll, allowScroll] = useScrollBlock();

    const closePopUpEvent = () => {
        setShow(false);
    }

    const escPressed = (e) => {
        if (e.keyCode === 27) {
            closePopUpEvent();
        }
    }

    useEffect(() => {
        if (!manyPopUps) {
            if (show) {
                blockScroll();
                if (escClose) {
                    window.addEventListener("keydown", escPressed, false);
                    return () => {
                        window.removeEventListener("keydown", escPressed, false);
                    };
                }
            } else {
                allowScroll();
            }
        }
        //eslint-disable-next-line
    }, [show])


    return (<CSSTransition
        in={show}
        timeout={400}
        classNames={"main-popup"}
        onEnter={() => setShow(true)}
        onExited={() => setShow(false)}
        unmountOnExit>
        {children}
    </CSSTransition>)
}

export default PopUp;