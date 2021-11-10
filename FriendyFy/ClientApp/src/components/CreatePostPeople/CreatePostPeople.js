import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { useLoggedIn } from "../../contexts/LoggedInContext";
import { getFriends } from "../../services/friendService";
import './CreatePostPeople.css';

const CreatePostPeople = (props) => {
    const [regionName, setRegionName] = useState(null);
    const {loggedIn} = useLoggedIn();
  
    const loadOptions = async (searchQuery, loadedOptions, { page }) => {
  
      const response = await getFriends(loggedIn.userName, 10, (page-1)*10, searchQuery).then(async res => await (res.json()));
      let friends = [];
      response.friends.forEach(friend => {
          friends.push({label: friend.fullName, value: friend.username})
      });

      return {
        options: friends,
        hasMore: response.friends.length >= 1,
        additional: {
          page: searchQuery ? 2 : page + 1,
        },
      };
    };
  
    const onChange = (option) => {
      if (typeof props.onChange === "function") {
        props.onChange(option);
      }
    };
  
    return (
      <AsyncPaginate
        loadOptions={loadOptions}
        onChange={onChange}
        placeholder="Tag Friends"
        isMulti
        additional={{
          page: 1,
        }}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary25: '#595757',
            primary: 'rgb(212, 212, 212)',
            neutral0: '#3F3B3B',
            neutral80: 'white',
            neutral60: '#aaaaaa',
            neutral10: '#595757',
            dangerLight: '#523737',
          }
        })}
        className="people-picker"
      />
    );
  };
export default CreatePostPeople;