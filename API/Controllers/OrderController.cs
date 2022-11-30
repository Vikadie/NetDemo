using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize] // no anonymous access
    public class OrderController : BaseApiController
    {
        private readonly StoreContext _context;
        public OrderController(StoreContext context)
        {
            _context = context;

        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        { // to get all the orders from a user
            return await _context.Orders // from table Orders
                // .Include(o => o.OrderItems) // to include all respective items inside each order
                .ProjectOrderToOrderDto()
                .Where(b => b.BuyerId == User.Identity.Name) // of specific user
                .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        { // to get a specific order => so the function get the id from Query {id}
            return await _context.Orders
                // .Include(o => o.OrderItems) if used it will eagerly load and get an Order without all params that we request
                // therefore we use a mapping function that projects it directly to OrderDto ProjectOrderToOrderDto()
                .ProjectOrderToOrderDto()
                .Where(b => b.BuyerId == User.Identity.Name && b.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
        {
            // we need our basket
            var basket = await _context.Baskets // will create an Extensio Method specially for this RetirieveBasketWithItems
                .RetirieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

            // if no basket
            if (basket == null) return BadRequest(new ProblemDetails { Title = "Could not locate basket" });

            // we need to build our list of ordered items
            var items = new List<OrderItem>();

            // we take a look in our basket items and for each we create our order item and get the products from the DB, and then check if
            // this is the correct price when we add them
            foreach (var item in basket.Items)
            {
                var productItem = await _context.Products.FindAsync(item.ProductId);
                var itemOrdered = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    PictureUrl = productItem.PictureUrl,
                    Name = productItem.Name
                };

                var orderItem = new OrderItem
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                };

                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }

            // price information
            var subTotal = items.Sum(item => item.Price * item.Quantity);
            var deliveryFee = subTotal >= 20000 ? 0 : 500;

            var order = new Order
            {
                OrderItems = items,
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDto.ShippingAddress,
                SubTotal = subTotal,
                DeliveryFee = deliveryFee,
                PaymentIntentId = basket.PaymentIntentId // required to recognize the event sent from Stripe out the order payment
            };

            // track it in the EntityFramework
            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);

            if (orderDto.SaveAddress)
            {
                var user = await _context.Users
                    .Include(a => a.Address) // to get the current address of the user
                    .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

                // new user Address variable
                var address = new UserAddress
                {
                    FullName = orderDto.ShippingAddress.FullName,
                    Address1 = orderDto.ShippingAddress.Address1,
                    Address2 = orderDto.ShippingAddress.Address2,
                    City = orderDto.ShippingAddress.City,
                    State = orderDto.ShippingAddress.State,
                    Zip = orderDto.ShippingAddress.Zip,
                    Country = orderDto.ShippingAddress.Country
                };

                // update of the address
                user.Address = address;
                // in this case we need to tell that we will update the user as well (track it in the EntityFramework)
                // _context.Update(user); // BUT not needed as our entity is tracked by EntityFramework and is aware that we changes the Address
            }

            var results = await _context.SaveChangesAsync() > 0;

            if (results) return CreatedAtRoute("GetOrder", new {id = order.Id}, order.Id);
            // CreatedAtRoute( the route name, the required parameters of the route, the value that the function should return)

            // if no changes during the SaveChanges to the DB
            return BadRequest("Problem creating order");
        }
    }
}