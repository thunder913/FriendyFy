import React, { useEffect } from 'react';
import './LeftNavigation.css';
import LeftNavigationButtons from '../LeftNavigationButtons/LeftNavigationButtons';
function LeftNavigationEvents() {

    // useEffect(() => {
    //     let opacity = 1;
    //     const startPoint = 500;
    //     const checkpoint = 700;
    //     var lastScrollTop = 0;
    //     window.addEventListener("scroll", () => {
    //         const currentScroll = window.pageYOffset;
    //         let eventsElement = document.querySelector(".events");
    //         if (currentScroll <= checkpoint) {
    //             if (currentScroll > startPoint || eventsElement.style.opacity < 1) {
    //                 opacity = 1 - currentScroll / checkpoint;
    //                 eventsElement.style.opacity = opacity;
    //                 eventsElement.style.visibility = 'visible';
    //             }
    //         } else {
    //             eventsElement.style.visibility = 'hidden';
    //         }

    //         //TODO make it show when scrolling top jut a little
    //         var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    //         if (st > lastScrollTop) {
    //             // downscroll code
    //         } else {
    //             // upscroll code
    //         }
    //         lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    //     });
    // })

    return (
        <aside className="events">
            <LeftNavigationButtons />
        </aside>
    )
}

export default LeftNavigationEvents;