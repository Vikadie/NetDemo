using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new();

        // props for Stripe (when made on later stage will require drop of the DB and rebuild or make migrations again)
        public string PaymentIntentId { get; set; } // we create payment intent on Stripe before we allow the user to actually make the payment
        // PaymentIntentId will be required in our Order class as well
        public string ClientSecret { get; set; } // stored inside our basket, passed back to our client, so that is use it to make the payment to Stripe directly w/o going through our API

        // util functions
        public void AddItem(Product product, int quantity)
        {
            if (Items.All(item => item.ProductId != product.Id))
            {
                Items.Add(new BasketItem { Product = product, Quantity = quantity });
            }
            
            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
            if (existingItem != null) {
                existingItem.Quantity += quantity;
            }
        }

        public void RemoveItem(int productId, int quantity) {
            var item = Items.FirstOrDefault(item => item.ProductId == productId);
            if (item == null) return;
            item.Quantity -= quantity;
            if (item.Quantity <= 0) {
                Items.Remove(item);
            }
        }
    }
}