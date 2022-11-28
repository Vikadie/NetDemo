using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtensions
    {
        public static IQueryable<OrderDto> ProjectOrderToOrderDto (this IQueryable<Order> query)
        {
            return query.Select(order => new OrderDto // order is of type Order and should be returned as OrderDto
            {
                Id = order.Id,
                BuyerId = order.BuyerId,
                ShippingAddress = order.ShippingAddress,
                OrderDate = order.OderDate,
                SubTotal = order.SubTotal,
                DeliveryFee = order.DeliveryFee,
                OrderStatus = order.OrderStatus.ToString(), // the enum as string part will be returned
                Total = order.GetTotal(), // we use the prepared property for this
                OrderItems = order.OrderItems.Select(item => new OrderItemDto
                {
                    ProductId = item.ItemOrdered.ProductId,
                    Name = item.ItemOrdered.Name,
                    PictureUrl = item.ItemOrdered.PictureUrl,
                    Price = item.Price,
                    Quantity = item.Quantity
                }).ToList()
            }).AsNoTracking(); // required as we could not track it without an owner
            // no need to track it automatically, which is the default behaviour, since we will only use it in the get requests
        }
    }
}