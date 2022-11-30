# Dockerfile to upload it on Fly.io
# the image we are starting from
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
# specify working directory inside the Docker file system - everything is going to happen in this directory
WORKDIR /app
# we need to expose the port wher fly.io will provide 8080
EXPOSE 8080

# copy csproj and restore as distinct layers
COPY *.csproj ./
# to download and restore any packages needed for this project in the /app folder based on what is inside teh .csproj file/s
RUN dotnet restore

# copy everything else from our file system (where Dockerfile is based) inside our docker container and build
COPY . ./
# we will create a Release (configuration -c) in the output directory (-o) /app/out 
RUN dotnet publish -c Release -o out

# build a runtime image (we do not need sdk from this point), so we need new image with the runtime only (which is much smaller)
FROM mcr.microsoft.com/dotnet/aspnet:6.0
# new work directory again
WORKDIR /app
# copy everyting staged in our build-environment /app/out into our app folder (current working directory marked with . at the end)
COPY --from=build-env /app/out .
# specify an entry point - API is the name of our project (API.csproj) => API.dll
ENTRYPOINT ["dotnet", "API.dll"]