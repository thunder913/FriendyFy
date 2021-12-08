import React, { Component } from 'react'
import './InterestsDropdown.css'
import CreatableSelect from 'react-select/creatable';
import { getAllInterests } from '../../services/interestService.js'
import { useThemeContext } from '../../contexts/ThemeContext';
import { useEffect, useState } from 'react/cjs/react.development';

const customStyles = {
  singleValue: (provided, state) => {
    const transition = '300ms';

    return { ...provided, transition };
  }
}

const InterestsDropdown = ({setInterests, placeholder}) => {
  const [dropDownOpt, setDropDownOpt] = useState([]);
  const [styles, setStyles] = useState({});
  const {theme} = useThemeContext();
  const renderData = async () => {
    let interests = await getAllInterests().then(async res => await res.json());
    let stateInterests = interests.map(x => ({ label: x.label, value: x.id }));
    setDropDownOpt(stateInterests);
  }

  const onChange = (event) => {
    setInterests(event);
  }

  useEffect(() => {
    if(theme === 'dark'){
      setStyles({
        ...theme.colors,
        primary25: '#595757',
        primary: 'black',
        neutral0: '#3F3B3B',
        neutral80: 'white',
        neutral60: 'black',
        neutral10: '#595757',
        dangerLight: '#523737'});
    }
    renderData();
  }, [])

  return (
    <div className="interests-input">
      <CreatableSelect
        options={dropDownOpt}
        onChange={onChange}
        isMulti
        placeholder={placeholder}
        theme={(theme) => ({
          ...theme,
          colors: (styles.legth ? styles : {...theme.colors})
        })}
        styles={customStyles}
      />
    </div>
  )
}

export default InterestsDropdown;