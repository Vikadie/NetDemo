using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities.OrderAggregate;

namespace API.DTOs
{
    public class CreateOrderDto
    {
        public bool SaveAddress { get; set; } // if the user would like to save the address of this order as its main address of the user
        public ShippingAddress ShippingAddress { get; set; }
    }
}