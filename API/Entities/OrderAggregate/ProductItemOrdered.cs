using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.OrderAggregate
{
    public class ProductItemOrdered
    {
        // contains snapshot of the item when it was ordered to keep the historic properties of an item when it was ordered
        // it will be stores inside the orderItem table
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
    }
}