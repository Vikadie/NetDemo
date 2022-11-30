using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace API.Services
{
    public class PaymentService
    {
        private readonly IConfiguration _config;
        public PaymentService(IConfiguration config)
        {
            _config = config;
            
        }

        // we create the service givivng us back from Stripe the PaymentIntent object
        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
        {
            // 1/ Stripe configuration
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];
            // 2/ we get teh service from Stripe - PaymentIntentService
            var service = new PaymentIntentService();
            // 3/ we get teh payemnt intent
            var intent = new PaymentIntent();
            // 4/ specify how much the items in our basket worth - price should come from Product table
            var subtotal = basket.Items.Sum(item => item.Quantity * item.Product.Price);
            var deliveryFee = subtotal >= 20000 ? 0 : 500;

            // 5/ check to see if we should update or create new payment intent
            if (string.IsNullOrEmpty(basket.PaymentIntentId)) {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = subtotal + deliveryFee,
                    Currency = "bgn",
                    PaymentMethodTypes = new List<string> {"card"}
                };

                // 6/ create the intent using the options
                intent = await service.CreateAsync(options);

            } else {
                // 6/ we will update the intent
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = subtotal + deliveryFee
                };
                await service.UpdateAsync(basket.PaymentIntentId, options);
            }

            // 8/ we return intent
            return intent;
        }
    }
}