using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly PaymentService _paymentsService;
        private readonly IConfiguration _config;
        public PaymentsController(PaymentService paymentsService, StoreContext context, IConfiguration config)
        {
            _config = config;
            _paymentsService = paymentsService;
            _context = context;

        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            var basket = await _context.Baskets
                .RetirieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

            if (basket == null) return NotFound();

            var intent = await _paymentsService.CreateOrUpdatePaymentIntent(basket);

            if (intent == null) return BadRequest(new ProblemDetails { Title = "Problem Creating payment intent" });

            // as the basket may need to be updated with our new PaymentIntentId 
            // so we set it to the basket along with the ClientSecret
            basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
            basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

            // update and save
            _context.Update(basket);

            var result = await _context.SaveChangesAsync() > 0;
            if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with intent" });

            return basket.MapBasketToDto(); // this will return 201 ok along with the basket
        }

        [HttpPost("webhook")] // it needs to be anonymous, becaise Stripe won't work either
        public async Task<ActionResult> StripeWebHook()
        {
            // read the request that Stripe is sending us after the payment has been successfully recieved
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            try
            {
                // to access the StripeEvent we need to create it
                var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"],
                    _config["StripeSettings:WhSecret"], throwOnApiVersionMismatch: false);

                // access the charge, because we listen to the Charge event (cast to Charge object)
                var charge = (Charge)stripeEvent.Data.Object;

                // from charge we want to get access to PaymentIntentId and get hold of the order from our database that matches this IntentId
                var order = await _context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == charge.PaymentIntentId);

                // change the status of the charge and if succeeded change the status of our order
                if (charge.Status == "succeeded") order.OrderStatus = OrderStatus.PaymentReceived;

                // save changes
                await _context.SaveChangesAsync();

                // we need to return something to let the Stripe that we have received its request to stop sending it
                return new EmptyResult();
            }
            catch (StripeException)
            {
                return BadRequest();
            }
        }
    }
}