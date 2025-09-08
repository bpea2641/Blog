FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY myBlog-0.0.1-SNAPSHOT.jar app.jar
COPY src/main/resources/static ./static
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
