using Microsoft.AspNetCore.HttpLogging;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Compact;

var loggerConfiguration = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .Enrich.FromLogContext();


var builder = WebApplication.CreateBuilder(args);

if (!builder.Environment.IsEnvironment(Microsoft.Extensions.Hosting.Environments.Development))
{
    loggerConfiguration.WriteTo.Console(new CompactJsonFormatter());
}
else
{
    loggerConfiguration.WriteTo.Console();
}
Log.Logger = loggerConfiguration.CreateLogger();

builder.Host.UseSerilog();

builder.Logging.ClearProviders();
builder.Logging.AddSerilog(Log.Logger);
// builder.Services.AddHttpLogging(logging =>
// {
//     logging.LoggingFields = HttpLoggingFields.RequestProperties | HttpLoggingFields.Response;
// });

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.DisplayRequestDuration();
    c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.Full);
    c.EnableTryItOutByDefault();
});

// app.UseHttpLogging();
app.UseSerilogRequestLogging();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
