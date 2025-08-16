# 1. Build stage
FROM gradle:8.3-jdk17 AS build
WORKDIR /app
COPY . .

USER root
RUN gradle clean build -x test --no-daemon --refresh-dependencies

# 2. Run stage
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
