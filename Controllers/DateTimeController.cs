using Microsoft.AspNetCore.Mvc;

namespace Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class DateTimeController : ControllerBase
{
    [HttpGet("UtcNow")]
    public ActionResult<DateTime> UtcNow()
    {
        return Ok(new UtcNowResponse());
    }
}

public class UtcNowResponse
{
    public DateTime UtcNow { get; set; } = DateTime.UtcNow.AddSeconds(0.5);
}