import React from 'react';
import './LeftNavigation.css';
import LeftNavigationButtons from '../LeftNavigationButtons/LeftNavigationButtons';
function LeftNavigationEvents() {

    return (
        <aside className="events">
            <LeftNavigationButtons />
        </aside>
    )
}

export default LeftNavigationEvents;