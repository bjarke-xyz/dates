using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;

namespace dates.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class OADateController : ControllerBase
{
    private readonly ILogger<OADateController> _logger;

    public OADateController(ILogger<OADateController> logger)
    {
        _logger = logger;
    }

    [HttpGet("from-oa-date")]
    public ActionResult<Response<double?, string?>> Parse([FromQuery] OADateInput input)
    {
        var oaDateStr = input?.OADate;
        if (string.IsNullOrWhiteSpace(oaDateStr))
        {
            return BadRequest(new Response<double?, string?>(error: "Null or empty input"));
        }
        if (oaDateStr.Contains(","))
        {
            oaDateStr = oaDateStr.Replace(",", ".");
        }
        try
        {
            var oaDateDouble = double.Parse(oaDateStr);
            var dateTime = DateTime.FromOADate(oaDateDouble);
            return Ok(new Response<double?, string?>(oaDateDouble, dateTime.ToString("o")));
        }
        catch (Exception ex)
        {
            return BadRequest(new Response<double?, string?>(error: $"Could not parse input: {ex.Message}"));
        }
    }

    [HttpGet("to-oa-date")]
    public ActionResult<Response<DateTime?, double?>> ToOADate([FromQuery] DateInput input)
    {
        if (input?.Date == null)
        {
            return BadRequest(new Response<DateTime?, double?>(error: "Null or empty input"));
        }
        return Ok(new Response<DateTime?, double?>(input.Date.Value, input.Date.Value.ToOADate()));
    }
}

public class OADateInput
{
    public string? OADate { get; set; } = DateTime.Now.ToOADate().ToString();
}

public class DateInput
{
    public DateTime? Date { get; set; } = DateTime.Now;
}

public class Response<TInput, TOutput>
{
    public Response(TInput? input = default, TOutput? output = default, string? error = null)
    {
        Input = input;
        Output = output;
        Error = error;
    }
    public string? Error { get; set; }

    public TInput? Input { get; set; }

    public TOutput? Output { get; set; }
}