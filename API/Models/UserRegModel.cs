namespace API.Models
{
    public class UserRegModel
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int Age { get; set; }

        public string Gender { get; set; }
        public string Weight { get; set; }
        public decimal Height { get; set; }
        public decimal ActivityLevel { get; set; }
        public string TargetCalories { get; set; }
    }
}
