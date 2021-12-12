import React, { useEffect, useState } from 'react'
import './InterestsDropdown.css'
import CreatableSelect from 'react-select/creatable';
import { getAllInterests } from '../../services/interestService.js'
import { useThemeContext } from '../../contexts/ThemeContext';

const customStyles = {
  singleValue: (provided, state) => {
    const transition = '300ms';

    return { ...provided, transition };
  }
}

const InterestsDropdown = ({setInterests, placeholder, defaultData}) => {
  const [dropDownOpt, setDropDownOpt] = useState([]);
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
    renderData();
  }, [])

  return (
    <div className="interests-input">
      <CreatableSelect
        options={dropDownOpt}
        onChange={onChange}
        isMulti
        placeholder={placeholder}
        theme={(th) => ({
          ...th,
          colors: (theme === 'dark' ? {
              ...th.colors,
              primary25: '#595757',
              primary: 'rgb(212, 212, 212)',
              neutral0: '#3F3B3B',
              neutral80: 'white',
              neutral60: '#aaaaaa',
              neutral10: '#595757',
              dangerLight: '#523737',
          } : {...th.colors})
      })}
        styles={customStyles}
        value={defaultData}
      />
    </div>
  )
}

export default InterestsDropdown;