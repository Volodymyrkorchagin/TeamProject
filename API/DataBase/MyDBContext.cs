using API.Models.Database;
using Microsoft.EntityFrameworkCore;

namespace API.DataBase
{
    public class MyDBContext : DbContext
    {
        public MyDBContext(DbContextOptions<MyDBContext> options) : base(options){}

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
       
    }
}
