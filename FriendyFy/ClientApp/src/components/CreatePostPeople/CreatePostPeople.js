import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AsyncPaginate } from "react-select-async-paginate";
import { getFriends } from "../../services/friendService";
import { useLoggedIn } from "../../contexts/LoggedInContext";

const friends = [
    {label:"gosho", value:"gosho1"},
    {label:"gosho2", value:"gosho2"},
    {label:"gosho3", value:"gosho3"},
    {label:"gosho4", value:"gosho4"},
    {label:"gosho5", value:"gosho5"},
    {label:"gosho6", value:"gosho6"},
    {label:"gosho7", value:"gosho7"},
    {label:"gosho8", value:"gosho8"},
    {label:"gosho9", value:"gosho9"},
    {label:"gosho10", value:"gosho10"},
    {label:"gosh", value:"gosh"},
    {label:"gosh1", value:"gosh1"},
    {label:"gosh2", value:"gosh2"},
    {label:"gosh3", value:"gosh3"},
    {label:"gosh4", value:"gosh4"},
    {label:"gosh5", value:"gosh5"},
    {label:"gosh6", value:"gosh6"},
    {label:"gosh7", value:"gosh7"},
    {label:"gosh8", value:"gosh8"},
    {label:"gosh9", value:"gosh9"},
    {label:"gosh10", value:"gosh10"},
    {label:"gosh23", value:"gosh23"},
    {label:"gos24", value:"gosh24"},
]

const CreatePostPeople = (props) => {
    const [regionName, setRegionName] = useState(null);
    const {loggedIn} = useLoggedIn();
  
    const loadOptions = async (searchQuery, loadedOptions, { page }) => {
  
      const response = await getFriends(loggedIn.userName, 10, (page-1)*10).then(async res => await (res.json()));
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