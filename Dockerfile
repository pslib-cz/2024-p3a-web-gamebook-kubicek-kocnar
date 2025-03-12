# Base image with .NET
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Install the latest LTS version of Node.js in the build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release

# Install Node.js LTS version
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get update && apt-get install -y nodejs

WORKDIR /src

# Copy .NET project files
COPY ["KubicekKocnar.Server/KubicekKocnar.Server.csproj", "KubicekKocnar.Server/"]
COPY ["kubicekkocnar.client/kubicekkocnar.client.esproj", "kubicekkocnar.client/"]

# Restore .NET dependencies
RUN dotnet restore "./KubicekKocnar.Server/KubicekKocnar.Server.csproj"

# Copy the rest of the files
COPY . .

# Work on .NET Server project
WORKDIR "/src/KubicekKocnar.Server"
RUN dotnet build "./KubicekKocnar.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish .NET project
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./KubicekKocnar.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final image with .NET and Node.js
FROM base AS final
WORKDIR /app

# Copy .NET publish output
COPY --from=publish /app/publish .

# Ensure Node.js is available at runtime (optional depending on your project needs)
RUN node -v
RUN npm -v

# Set entry point
ENTRYPOINT ["dotnet", "KubicekKocnar.Server.dll"]
