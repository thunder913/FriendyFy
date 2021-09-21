import React, {useState} from "react";
import './RegisterGender.css'
const RegisterGender = () => {
    const [gender, setGender] = useState('');
    
    function onGenderChange(e) {
        setGender(e.target.value);
    }
    return ( <div className="gender-buttons" onChange={onGenderChange}>
    <div className="radio" style={{ backgroundColor: gender === 'male' ? '#3197ee' : '' }}>
        <input className="radio-button"
            type="radio"
            name='gender'
            value='male'
            id='male' />
        <label className="radio-label" htmlFor="male">Male</label>
    </div>
    <div className="radio" style={{ backgroundColor: gender === 'female' ? 'rgb(241, 84, 233)' : '' }}>
        <input
            className="radio-button"
            type="radio" name='gender'
            value='female'
            id='female' />
        <label className="radio-label" htmlFor="female">Female</label>
    </div>
    <div className="radio" style={{ backgroundColor: gender === 'other' ? 'rgb(226, 158, 10)' : '' }}>
        <input
            className="radio-button"
            type="radio" name='gender'
            value='other'
            id='other' />
        <label className="radio-label" htmlFor="other">Other</label>
    </div>
</div>)
}

export default RegisterGender