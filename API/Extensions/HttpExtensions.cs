using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.RequestHelpers;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, MetaData metaData)
        {
            // var options = new JsonSerializerOptions{PropertyNamingPolicy=JsonNamingPolicy.CamelCase};
            response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData, new JsonSerializerOptions{
                PropertyNamingPolicy=JsonNamingPolicy.CamelCase
            }));
            // in order "Pagination" to be available in our client (React), because iti snot the same domain we should also add:
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}