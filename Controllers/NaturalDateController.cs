using dates.Models;
using Grpc.Net.Client;
using Microsoft.AspNetCore.Mvc;

namespace dates.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class NaturalDateController : ControllerBase
{
    private readonly string serviceUrl;
    public NaturalDateController(IConfiguration configuration)
    {
        serviceUrl = configuration.GetValue<string>("Urls:naturaldate");
    }

    [HttpGet("parse")]
    public async Task<ActionResult<Response<string, DateTime?>>> Parse([FromQuery] string input, [FromQuery] string timezone)
    {
        if (string.IsNullOrEmpty(input)) return BadRequest();

        using var channel = GrpcChannel.ForAddress(serviceUrl);
        var client = new naturaldate.NaturalDate.NaturalDateClient(channel);
        try
        {
            var response = await client.ParseAsync(new naturaldate.ParseNaturalDateRequest
            {
                NaturalDate = input,
                BaseDate = Google.Protobuf.WellKnownTypes.Timestamp.FromDateTimeOffset(DateTimeOffset.Now),
            });
            var parsedDate = response.ParsedDate.ToDateTime();
            var tzInfo = TimeZoneInfo.FindSystemTimeZoneById(timezone);
            parsedDate = parsedDate.Add(tzInfo.BaseUtcOffset);
            return Ok(new Response<string, DateTime?>(input, parsedDate));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Response<string, DateTime?>(input, null, ex.Message));
        }
    }
}

public class NaturalDateParseRequest
{
    public string? NaturalDate { get; set; }
}