﻿using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using FriendyFy.Services.Contracts;
using Microsoft.Extensions.Configuration;
using static FriendyFy.Data.GoogleMapsApi.GoogleMapsClasses;

namespace FriendyFy.Services;

public class GeolocationService : IGeolocationService
{
    private readonly IConfiguration configuration;
    public GeolocationService(IConfiguration configuration)
    {
        this.configuration = configuration;
    }
    
    public async Task<string> GetUserLocationAsync(double latitude, double longitude)
    {
        HttpClient httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; .NET CLR 1.0.3705;)");
        var url = $"https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&key={configuration["GoogleMapsApiKey"]}";
        var jsonData = await httpClient.GetByteArrayAsync(url);

        var googleObject = JsonSerializer.Deserialize<Root>(jsonData);
        string country = null, city = null, cityAlt = null;
        if (googleObject.status == "OK" && googleObject.results.Any())
        {
            for (int r = 0, rl = googleObject.results.Count(); r < rl; r += 1)
            {
                var result = googleObject.results[r];

                if (city == null && result.types.Any(x => x == "locality"))
                {
                    for (int c = 0, lc = result.address_components.Count(); c < lc; c += 1)
                    {
                        var component = result.address_components[c];

                        if (component.types[0] == "locality")
                        {
                            city = component.long_name;
                            break;
                        }
                    }
                }
                else if (city == null && cityAlt == null && result.types.Any(x => x == "administrative_area_level_1"))
                {
                    for (int c = 0, lc = result.address_components.Count(); c < lc; c += 1)
                    {
                        var component = result.address_components[c];

                        if (component.types[0] == "administrative_area_level_1")
                        {
                            cityAlt = component.long_name;
                            break;
                        }
                    }
                }
                else if (country == null && result.types.Any(x => x == "country"))
                {
                    country = result.address_components[0].long_name;
                }

                if (city != null && country != null)
                {
                    break;
                }
            }
        }
        return city ?? cityAlt;

    }
}