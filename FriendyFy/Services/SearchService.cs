using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using ViewModels;
using ViewModels.ViewModels;

namespace FriendyFy.Services
{
    public class SearchService : ISearchService
    {
        private readonly IEventService eventService;
        private readonly IUserService userService;

        public SearchService(IEventService eventService,
            IUserService userService)
        {
            this.eventService = eventService;
            this.userService = userService;
        }

        public SearchResultsViewModel GetSearchResults(string search, string userId, int take, int skipPeople, int skipEvents)
        {
            var takeCount = take / 2;
            var users = this.userService.GetUserSearchViewModel(search, userId, take/2, skipPeople);
            var events = this.eventService.GetEventSearchViewModel(search, take/2, skipEvents);

            var hasMoreUsers = true;
            var hasMoreEvents = true;
            if (users.Count < takeCount)
            {
                hasMoreUsers = false;
            }
            if (events.Count < takeCount)
            {
                hasMoreEvents = false;
            }

            if (!hasMoreUsers && hasMoreEvents)
            {
                var eventsTake = take - takeCount - users.Count;
                events.AddRange(this.eventService.GetEventSearchViewModel(search, eventsTake, skipEvents + events.Count));
                if (events.Count < eventsTake + takeCount)
                {
                    hasMoreEvents = false;
                }
            }
            else if (hasMoreUsers && !hasMoreEvents)
            {
                var usersTake = take - takeCount - events.Count;
                users.AddRange(this.userService.GetUserSearchViewModel(search, userId, usersTake, skipPeople + users.Count));
                if (users.Count < usersTake + takeCount)
                {
                    hasMoreUsers = false;
                }
            }

            var searchResults = new List<SearchResultViewModel>();
            searchResults.AddRange(users);
            searchResults.AddRange(events);
            searchResults = searchResults.OrderBy(x => Guid.NewGuid()).ToList();

            var viewmodel = new SearchResultsViewModel()
            {
                EventsCount = skipEvents + events.Count,
                PeopleCount = skipPeople + users.Count,
                HasMoreEvents = hasMoreEvents,
                HasMorePeople = hasMoreUsers,
                SearchResults = searchResults
            };

            return viewmodel;
        }

        public SearchPageResultsViewModel PerformSearch(int take, int skipPeople, int skipEvents, string searchWord, List<int> interestIds, SearchType searchType, 
            bool showOnlyUserEvents, DateTime eventDate, bool hasEventDate, string userId)
        {
            var people = new List<SearchPageResultViewModel>();
            var events = new List<SearchPageResultViewModel>();
            var hasMoreUsers = true;
            var hasMoreEvents = true;
            if (searchType == SearchType.Person && !showOnlyUserEvents)
            {
                people.AddRange(this.userService.GetSearchPageUsers(take, skipPeople, searchWord, interestIds, userId));
                hasMoreUsers = people.Count() == take;
            }
            else if (searchType == SearchType.Event)
            {
                events.AddRange(this.eventService.GetSearchPageEvents(skipEvents, take, searchWord, interestIds, showOnlyUserEvents, eventDate, hasEventDate, userId));
                hasMoreEvents = events.Count() == take;
            }
            else if (searchType == SearchType.Both)
            {
                var takeCount = take / 2;
                if (!showOnlyUserEvents)
                {
                    people.AddRange(this.userService.GetSearchPageUsers(takeCount, skipPeople, searchWord, interestIds, userId));
                }
                events.AddRange(this.eventService.GetSearchPageEvents(skipEvents, takeCount, searchWord, interestIds, showOnlyUserEvents, eventDate, hasEventDate, userId));


                if (people.Count < takeCount)
                {
                    hasMoreUsers = false;
                }
                if (events.Count < takeCount)
                {
                    hasMoreEvents = false;
                }
            }

            var results = new List<SearchPageResultViewModel>();
            results.AddRange(people);
            results.AddRange(events);

            var viewmodel = new SearchPageResultsViewModel()
            {
                EventsCount = skipEvents + events.Count,
                PeopleCount = skipPeople + people.Count,
                HasMoreEvents = hasMoreEvents,
                HasMorePeople = hasMoreUsers,
                SearchResults = results.OrderBy(x => Guid.NewGuid()).ToList()
            };

            return viewmodel;
        }
    }
}
