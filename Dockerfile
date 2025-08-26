# 1. Build stage
FROM gradle:8.3-jdk17 AS build
WORKDIR /app
COPY . .

# Gradle Wrapper 권한 확보
RUN chmod +x gradlew

# 캐시를 /tmp로 바꿔서 권한 문제 회피
RUN ./gradlew clean build -x test --no-daemon --refresh-dependencies -g /tmp/.gradle

# 2. Run stage
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]