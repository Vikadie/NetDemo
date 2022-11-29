using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly PaymentService _paymentsService;
        public PaymentsController(PaymentService paymentsService, StoreContext context)
        {
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

            if (intent == null) return BadRequest(new ProblemDetails{Title = "Problem Creating payment intent"});

            // as the basket may need to be updated with our new PaymentIntentId 
            // so we set it to the basket along with the ClientSecret
            basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
            basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

            // update and save
            _context.Update(basket);

            var result = await _context.SaveChangesAsync() > 0;
            if (!result) return BadRequest(new ProblemDetails{Title = "Problem updating basket with intent"});

            return basket.MapBasketToDto(); // this will return 201 ok along with the basket
        }
    }
}