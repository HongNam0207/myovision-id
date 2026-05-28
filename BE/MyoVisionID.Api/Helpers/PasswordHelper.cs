namespace MyoVisionID.Api.Helpers
{
    public static class PasswordHelper
    {
        public static bool VerifyPassword(string inputPassword, string storedPasswordHash)
        {
            return inputPassword == storedPasswordHash;
        }

        public static string HashPassword(string password)
        {
            return password;
        }
    }
}
