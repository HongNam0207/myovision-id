namespace MyoVisionID.Api.Services.Time
{
    public interface IDateTimeService
    {
        DateTime Now { get; }
        DateTime UtcNow { get; }
    }

    public class DateTimeService : IDateTimeService
    {
        public DateTime Now => DateTime.UtcNow.AddHours(7).AddHours(7);
        public DateTime UtcNow => DateTime.UtcNow.AddHours(7);
    }
}

