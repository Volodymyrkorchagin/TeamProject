using API.DataBase;
using API.Models;
using API.Models.Database;
using API.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace API.Controllers
{
    [EnableCors]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly MyDBContext _db;
        private IConfiguration _config;
        private JwtService _jwt;

        public UserController(MyDBContext db, IConfiguration configuration, JwtService jwtService)
        {
            _db = db;
            _config = configuration;
            _jwt = jwtService;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return Ok(new { message = "API is running" });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegModel user)
        {
            // Перевіряємо обов'язкові текстові поля
            if (
                    string.IsNullOrEmpty(user.Username) &&
                    string.IsNullOrEmpty(user.Email) &&
                    string.IsNullOrEmpty(user.Password)
                )
            {
                return BadRequest(new { message = "Username, Email, and Password are required." });
            }

            try
            {
                var newUser = new User
                {
                    Username = user.Username,
                    Email = user.Email,
                    Age = user.Age,
                    Gender = user.Gender,
                    Weight = user.Weight,
                    Height = user.Height,
                    ActivityLevel = user.ActivityLevel,
                    TargetCalories = user.TargetCalories,
                    Password = BCrypt.Net.BCrypt.HashPassword(user.Password)
                };

                if (_db.Users.FirstOrDefault(x => x.Email == user.Email) == null)
                {

                    _db.Users.Add(newUser);
                    _db.SaveChanges();



                    var tokenHandler = new JwtSecurityTokenHandler();

                    var token = tokenHandler.CreateToken(_jwt.GenerateToken(newUser));
                    var tokenString = tokenHandler.WriteToken(token);

                    return Ok(new
                    {
                        token = tokenString
                    });
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Database error: " + ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginModel user)
        {
            if (!string.IsNullOrEmpty(user.Email) && !string.IsNullOrEmpty(user.Password))
            {

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
                var dbUser = _db.Users.FirstOrDefault(x => x.Email == user.Email);

                if(dbUser != null && BCrypt.Net.BCrypt.Verify(user.Password, dbUser.Password))
                {
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var token = tokenHandler.CreateToken(_jwt.GenerateToken(dbUser));
                    var tokenString = tokenHandler.WriteToken(token);
                    return Ok(new
                    {
                        token = tokenString
                    });
                }
            }

            return BadRequest(new { message = "Email and Password are required." });
        }
    }
}