FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["dates.csproj", "dates/"]
RUN dotnet restore "dates/dates.csproj"
COPY . ./dates
WORKDIR "/src/dates"
RUN dotnet build "dates.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "dates.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "dates.dll"]