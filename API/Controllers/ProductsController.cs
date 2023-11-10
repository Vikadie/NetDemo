using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    // [ApiController] // removed since it exists in the BaseApiController
    // [Route("api/[controller]")] // no need to repeat it anymore, since it exists in the BaseApiContriller
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper; // to use mapper it needs the dependency injection on this one with initilized filed from parameter
        private readonly ImageService _imageService;

        public ProductsController(StoreContext context, IMapper mapper, ImageService imageService)
        {
            _mapper = mapper;
            _imageService = imageService;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams pp)
        {
            // return await _context.Products.ToListAsync(); // return all, no sorting, pagination etc. thus without any params
            var query = _context.Products
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

        [HttpGet("{id}", Name = "GetProduct")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return product;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new { brands, types });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
        {
            Product product = _mapper.Map<Product>(productDto); // this can be done 2 ways 1- using .Map<output type>(input object) or 2- .Map(output obj, input obj)

            // work with image in case we have it
            if (productDto.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(productDto.File);

                if (imageResult.Error != null) return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;
            }

            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);

            return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct([FromForm] UpdateProductDto productDto)
        {
            Product product = await _context.Products.FindAsync(productDto.Id);

            if (product == null) return NotFound();

            _mapper.Map(productDto, product); // here we use the 2- .Map(output obj, input obj), so that it directly output the updated obj

            // if we have the file
            if (productDto.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(productDto.File);

                if (imageResult.Error != null) return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                // delete the old image from Cloudinary, if it is there based on PublicId existence
                if (!string.IsNullOrEmpty(product.PublicId))
                {
                    await _imageService.DeleteImageAsync(product.PublicId);
                }

                // save the new image data
                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(product);

            return BadRequest(new ProblemDetails { Title = "Problem updating product" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            Product product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();

            // delete the old image from Cloudinary, if it is there based on PublicId existence
            if (!string.IsNullOrEmpty(product.PublicId))
            {
                await _imageService.DeleteImageAsync(product.PublicId);
                // currently we do not care if there is a problem with the image deletion on Cloudinary, 
                // so, if a problem, the deletion of the product will not happen

                //TODO!! log this error and add it to a task for reviewing and deleting the product later on.
            }

            _context.Products.Remove(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting product" });
        }
    }
}