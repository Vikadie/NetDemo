using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    // [ApiController] // removed since it exists in the BaseApiController
    // [Route("api/[controller]")] // no need to repeat it anymore, since it exists in the BaseApiContriller
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;

        public ProductsController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParams pp)
        {
            // return await _context.Products.ToListAsync(); // return all, no sorting, pagination etc. thus without any params
            var query =  _context.Products
                .Sort(pp.OrderBy) // added from the Products Extensions
                .Search(pp.SearchTerm) // added from the Products Extensions
                .Filter(pp.Brands, pp.Types) // added from the Products Extensions
                .AsQueryable();
            // alternative of Extensions methods used here (see ProductExtensions)
            // query = orderBy switch // query from the database using orderBy
            // {
            //     "price" => query.OrderBy(p => p.Price),
            //     "priceDesc" => query.OrderByDescending(p => p.Price),
            //     _ => query.OrderBy(p => p.Name)
            // };

            var products = await PagedList<Product>.ToPagedList(query, pp.PageNumber, pp.PageSize);

            // all metadata is returned in the Response Headers via the custom static method
            Response.AddPaginationHeader(products.MetaData);
            
            return products;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) {
                return NotFound();
            }
            return product;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new {brands, types});
        }
    }
}