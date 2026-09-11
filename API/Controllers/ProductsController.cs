using API.DataBase;
using API.Models;
using API.Models.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [EnableCors]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {   

        private readonly MyDBContext _db;

        public ProductsController(MyDBContext context) { _db = context; }

        [HttpGet]
        public IActionResult Index()
        {   
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            var products = _db.Products.Where(p => p.UserId == int.Parse(userId)).ToList();
            return Ok(products);
        }

        [HttpPost("create")]
        public IActionResult Create([FromBody] ProductModel product)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if(_db.Users.Any(u => u.Id == int.Parse(userId)))
            {
                Product newProduct = new Product
                {
                    Name = product.Name,
                    Calories = product.Calories,
                    Proteins = product.Proteins,
                    Fats = product.Fats,
                    Carbs = product.Carbs,
                    Unit = product.Unit,
                    PortionSize = product.PortionSize,
                    UserId = int.Parse(userId)
                };

                _db.Products.Add(newProduct);
                _db.SaveChanges();
                return Ok(new {products = newProduct});
            }

            return BadRequest("Invalid user");
        }

        [HttpPut("update/{id}")]
        public IActionResult Update(int id, [FromBody] ProductModel product)
        {   
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var productToUpdate = _db.Products.FirstOrDefault(p => p.Id == id && p.UserId == int.Parse(userId));

            if (productToUpdate == null)
            {
                return NotFound("Product not found");
            }

            // Update the product properties
            productToUpdate.Name = product.Name;
            productToUpdate.Calories = product.Calories;
            productToUpdate.Proteins = product.Proteins;
            productToUpdate.Fats = product.Fats;
            productToUpdate.Carbs = product.Carbs;
            productToUpdate.Unit = product.Unit;
            productToUpdate.PortionSize = product.PortionSize;

            _db.SaveChanges();
            return Ok(new { products = productToUpdate });
        }

        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var productToDelete = _db.Products.FirstOrDefault(p => p.Id == id && p.UserId == int.Parse(userId));

            if (productToDelete == null)
            {
                return NotFound("Product not found");
            }

            _db.Products.Remove(productToDelete);
            _db.SaveChanges();
            return Ok(new { message = "Product deleted successfully" });
        }
    }
}
