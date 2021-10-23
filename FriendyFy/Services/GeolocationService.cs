using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using System.IO;
using System.Net;
using System.Runtime.Serialization.Json;

namespace FriendyFy.Services
{
    public class GeolocationService : IGeolocationService
    {

        public string GetUserLocation(double latitude, double longiitude)
        {
            WebClient webClient = new WebClient();
            webClient.Headers.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; .NET CLR 1.0.3705;)");
            webClient.Headers.Add("Referer", "http://www.microsoft.com");
            var jsonData = webClient.DownloadData("http://nominatim.openstreetmap.org/reverse?format=json&lat=" + latitude + "&lon=" + longiitude);
            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(RootObject));
            RootObject rootObject = (RootObject)ser.ReadObject(new MemoryStream(jsonData));

            return rootObject.address.city ?? rootObject.address.suburb ?? rootObject.address.state ?? rootObject.display_name;
        }
    }
}
