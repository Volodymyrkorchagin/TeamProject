using API.Models.Database;

namespace API.Models
{
    public class ProductModel
    {
        public string Name { get; set; }
        public decimal Calories { get; set; }
        public decimal Proteins { get; set; }
        public decimal Fats { get; set; }
        public decimal Carbs { get; set; }
    }
}
