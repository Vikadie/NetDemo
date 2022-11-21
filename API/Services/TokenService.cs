using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    { // should be added to the ConfigureServices in our Startup class
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        public TokenService(UserManager<User> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;            // the configs in appSettings... 
        }

        // 1 single method
        public async Task<string> GenerateToken(User user) // the token is a simple string
        {
            // we specify the info in the payload part of the JWT (not header and signature). Inside payload there are the claims for this user that we will verify
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email), // (claim type, corresponding field from which to search for)
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // now we will add the signature specifics
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"])); // should be set in appsettings and it should be at least 12 characters
            // based on the created key we generate our credentials
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenOptions = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        }
    }
}