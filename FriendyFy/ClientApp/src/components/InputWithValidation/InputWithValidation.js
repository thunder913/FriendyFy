import React from "react";
import './InputWithValidation.css';

const InputWithValidation = (props) => {
    return(
        <div className="input">
        <div className="input-error">{props.errorBubble ? props.error : ''}</div>
            <input 
            className={props.error !== null ? 'error' : ''} 
            type={ props.type ?? "text"} 
            placeholder={props.placeholder} 
            value={props.value} 
            onChange={props.changeHandler} 
            onFocus={(e) => props.setErrorBubble(true)}
            onBlur={(e) => props.setErrorBubble(false)}
            autocomplete="new-password"
            id={props.id}
            />
    </div>
    )
}

export default InputWithValidation;