using ViewModels.ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface ISearchService
    {
        SearchResultsViewModel GetSearchResults(string search, string userId, int take, int skipPeople, int skipEvents);
    }
}
