using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities.OrderAggregate;

namespace API.DTOs
{
    public class OrderDto
    {
        
        public int Id { get; set; }
        public string BuyerId { get; set; } // or User.UserName
        public ShippingAddress ShippingAddress { get; set; }
        public DateTime OrderDate { get; set; } 
        public List<OrderItemDto> OrderItems { get; set; }
        public long SubTotal { get; set; }
        public long DeliveryFee { get; set; }
        public string OrderStatus { get; set; }
        public long Total { get; set; }
    }
}