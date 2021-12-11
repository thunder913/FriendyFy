import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";

const SearchPageResults = ({feed, loadMoreResults, hasMoreEvents, hasMorePeople}) => {
    return(
        <InfiniteScroll
        className={"search-feed"}
        dataLength={feed.length}
        next={loadMoreResults}
        hasMore={(hasMoreEvents || hasMorePeople)}
        loader={<Loader
            type="TailSpin"
            color="#50A6FA"
            height={100}
            width={100}
            className="loader"
        />}
        scrollableTarget="scrollableDiv"
        endMessage={
            <p style={{ textAlign: 'center' }}>
                <b>{feed.length ? 'You reached the final result' : 'Use the search filters to find some people and events!'}</b>
            </p>
        }>
        {feed.map(item => (<div className="search-result">
            <div className="image">
                <img src={item.imageUrl} alt="" />
            </div>
            <p className="name">{item.name}</p>
            {item.type === 'profile' ? <p className="mutual-friends">{item.mutualFriends} Mutual friends</p> : <div className="interests">
                {item.interests.map(x => <span>{x.label}</span>)}</div>}
            <Link to={'/' + item.type + '/' + item.id} className="view-button">View</Link>
        </div>))}
    </InfiniteScroll>
    )
}

export default SearchPageResults;