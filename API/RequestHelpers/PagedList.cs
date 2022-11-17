using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PagedList<T> : List<T> // paginated list that is going to be returned
    {
        public PagedList(List<T> items, int count, int pageNumber, int pageSize) // created using "Generate a constructor..." from the additional menu
        {
            MetaData = new MetaData
            {
                TotalCount = count,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
            };
            AddRange(items); // when returning we will have the list of items + our MetaData
        }

        public MetaData MetaData { get; set; }
        
        //to use it we need this method
        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
        {
            var count = await query.CountAsync(); // executed agains the database
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(); // with .Skip we do the offset command in the DB

            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}