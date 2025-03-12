#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["KubicekKocnar.Server/KubicekKocnar.Server.csproj", "KubicekKocnar.Server/"]
COPY ["kubicekkocnar.client/kubicekkocnar.client.esproj", "kubicekkocnar.client/"]
RUN dotnet restore "./KubicekKocnar.Server/KubicekKocnar.Server.csproj"
COPY . .
WORKDIR "/src/KubicekKocnar.Server"
RUN dotnet build "./KubicekKocnar.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./KubicekKocnar.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "KubicekKocnar.Server.dll"]