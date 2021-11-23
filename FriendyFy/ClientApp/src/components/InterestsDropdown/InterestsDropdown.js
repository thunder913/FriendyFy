import React, { Component } from 'react'
import './InterestsDropdown.css'
import CreatableSelect from 'react-select/creatable';
import {getAllInterests} from '../../services/interestService.js'

const customStyles = {
  singleValue: (provided, state) => {
    const transition = '300ms';

    return { ...provided, transition };
  }
}

export default class InterestsDropdown extends Component {

  constructor(props){
    super(props)
    this.state = {
      dropDownOpt : [],
      setInterests: props.setInterests,
      placeholder: props.placeholder
    }
  }

 async renderData(){
    // const API = await axios.get('https://jsonplaceholder.typicode.com/comments')
    // const serverResponse = API.data

    // const dropDownValue = serverResponse.map((response) => ({
    //   "value" : response.id,
    //   "label" : response.email

    let interests = await getAllInterests().then(async res => await res.json());
    let stateInterests = interests.map(x => ({label: x.label, value: x.id}));

    this.setState(
      {
        dropDownOpt: stateInterests
      }
    )
  }

  onChange(event){
    this.state.setInterests(event);
  }

  componentDidMount(){
      this.renderData()
  }

  render() {
    return (
      <div className="interests-input">
        <CreatableSelect 
           options={this.state.dropDownOpt} 
           onChange={this.onChange.bind(this)}
           isMulti
           placeholder={this.state.placeholder}
           theme={(theme) => ({
             ...theme,
             colors: {
               ...theme.colors,
               primary25: '#595757',
               primary: 'black',
               neutral0: '#3F3B3B',
               neutral80: 'white',
               neutral60: 'black',
               neutral10: '#595757',
               dangerLight: '#523737'
             }
           })}
           styles={customStyles}
        />
      </div>
    )
  }
}