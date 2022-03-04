namespace dates.Models;


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