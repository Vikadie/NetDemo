using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _useManager;
        
        private readonly TokenService _tokenService;
        public AccountController(
            UserManager<User> useManager,
            TokenService tokenService
            )
        {
            _tokenService = tokenService;
            _useManager = useManager; //will aloow us to login and register with the already available in the UserManager
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) //returns User object based on the LoginDto provided autmatically in the body
        {
            var user = await _useManager.FindByNameAsync(loginDto.Username); // will return User of null if the user is not in the DB
            if (user == null || !await _useManager.CheckPasswordAsync(user, loginDto.Password))
            {
                return Unauthorized();
            }
            // to use JWT we should return it with inside a UserDto object/class
            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user)
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult> Resigster(RegisterDto registerDto) // as we are not going to login the user, the function doen;t return anything
        {
            var user = new User{UserName=registerDto.Username, Email=registerDto.Email};

            var result = await _useManager.CreateAsync(user, password: registerDto.Password); // we will need to check the result for Validation Errors

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors) //we loop over each error to add it to the Validaiton Errors
                {
                    ModelState.AddModelError(error.Code, error.Description); //(key, errorMessage) just like in GetValidationError() of BuggyController
                }

                return ValidationProblem();
            }

            await _useManager.AddToRoleAsync(user, "Member"); // if no problem we assign the newly registered user membership role

            return StatusCode(201); // we return OK, created, with no other info
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _useManager.FindByNameAsync(User.Identity.Name);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user)
            };
        }
    }
}