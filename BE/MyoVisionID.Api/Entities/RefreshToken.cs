namespace MyoVisionID.Api.Entities
{
    public class RefreshToken
    {
        public long RefreshTokenId { get; set; }
        public long UserId { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiredAt { get; set; }
        public bool IsRevoked { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(7);
        public DateTime? RevokedAt { get; set; }

        public virtual User User { get; set; } = null!;
    }
}

