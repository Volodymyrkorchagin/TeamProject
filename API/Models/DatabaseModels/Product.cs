namespace API.Models.Database
{
    public class Product
    {
        public int Id               { get; set; }
        public string Name          { get; set; }
        public string Unit          { get; set; }
        public decimal PortionSize  { get; set; }
        public decimal Calories     { get; set; }
        public decimal Proteins     { get; set; }
        public decimal Fats         { get; set; }
        public decimal Carbs        { get; set; }
        public int UserId           { get; set; }
        public User User            { get; set; }
    }
}
