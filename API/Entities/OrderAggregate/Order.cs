using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.OrderAggregate
{
    public class Order
    {
        public int Id { get; set; }
        public string BuyerId { get; set; } // or User.UserName
        [Required]
        public ShippingAddress ShippingAddress { get; set; }
        public DateTime OderDate { get; set; } = DateTime.UtcNow; // or DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc); because Postgres is not uacceptiong anything except the UtcNow // when created it will be set automatically
        public List<OrderItem> OrderItems { get; set; }
        public long SubTotal { get; set; }
        public long DeliveryFee { get; set; }
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending; // initially when created it will be pending
        // required for Stripe
        public string PaymentIntentId { get; set; }
        // util funcs
        public long GetTotal()
        {
            return SubTotal + DeliveryFee;
        }
    }
}