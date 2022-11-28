using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;

        public AccountController(
            UserManager<User> userManager,
            TokenService tokenService,
            StoreContext context
            )
        {
            _context = context;
            _tokenService = tokenService;
            _userManager = userManager; //will aloow us to login and register with the already available in the UserManager
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) //returns User object based on the LoginDto provided autmatically in the body
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username); // will return User or null if the user is not in the DB
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                return Unauthorized();
            }

            var userBasket = await RetrieveBasket(loginDto.Username); // if the user has a basket to find it and continue, if not it will be null
            var anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]); // if there is anonymous basket, if not it will be null

            if (anonBasket != null) 
            {
                if (userBasket != null) _context.Baskets.Remove(userBasket); // if there is a user basket, it will be removed
                anonBasket.BuyerId = user.UserName; // anon basket transferred to the user
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();
            }
            // to use JWT we should return it with inside a UserDto object/class
            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult> Resigster(RegisterDto registerDto) // as we are not going to login the user, the function doen;t return anything
        {
            var user = new User{UserName=registerDto.Username, Email=registerDto.Email};

            var result = await _userManager.CreateAsync(user, password: registerDto.Password); // we will need to check the result for Validation Errors

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors) //we loop over each error to add it to the Validaiton Errors
                {
                    ModelState.AddModelError(error.Code, error.Description); //(key, errorMessage) just like in GetValidationError() of BuggyController
                }

                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member"); // if no problem we assign the newly registered user membership role

            return StatusCode(201); // we return OK, created, with no other info
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var userBasket = await RetrieveBasket(User.Identity.Name); // if the user has a basket to find it and continue, if not it will be null

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketToDto()
            };
        }

        [Authorize]
        [HttpGet("savedAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress() 
        {
            return await _userManager.Users
                .Where(x => x.UserName == User.Identity.Name)
                .Select(user => user.Address)
                .FirstOrDefaultAsync();
        }

        // copied from the BasketController as it is
        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId)) {
                Response.Cookies.Delete("buyerId"); // remove the cookie from the response, if it exists in Request.Cookies["buyerId"]
                return null;
            }
            return await _context.Baskets // the Baskets table is added to the context in the StoreContext.cs
                .Include(i => i.Items) // if there are Items inside, include them
                .ThenInclude(p => p.Product) // along with the respective product info
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId); // search by the buyerId to ckeck if he has a basket, if not a basket returns Null as Default value
        }
    }
}