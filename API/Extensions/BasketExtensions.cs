using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Extensions
{
    public static class BasketExtensions
    {
        public static BasketDto MapBasketToDto(this Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Brand = item.Product.Brand,
                    Type = item.Product.Type,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Quantity = item.Quantity
                }).ToList()
            };
        }
    }
}