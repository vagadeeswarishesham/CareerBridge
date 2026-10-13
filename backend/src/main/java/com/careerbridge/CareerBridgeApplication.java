package com.careerbridge;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CareerBridgeApplication {

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(CareerBridgeApplication.class, args);
    }

    /**
     * Loads a simple .env file for local development. Real environment variables
     * take precedence, so Render's Environment settings remain authoritative.
     */
    private static void loadDotEnv() {
        Path[] candidates = { Path.of(".env"), Path.of("backend", ".env") };
        for (Path file : candidates) {
            if (!Files.isRegularFile(file)) {
                continue;
            }
            try {
                List<String> lines = Files.readAllLines(file);
                for (String line : lines) {
                    String trimmed = line.trim();
                    if (trimmed.isEmpty() || trimmed.startsWith("#")) {
                        continue;
                    }
                    int separator = trimmed.indexOf('=');
                    if (separator <= 0) {
                        continue;
                    }
                    String key = trimmed.substring(0, separator).trim();
                    String value = trimmed.substring(separator + 1).trim();
                    if ((value.startsWith("\"") && value.endsWith("\""))
                            || (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.substring(1, value.length() - 1);
                    }
                    if (!key.isEmpty() && System.getenv(key) == null && System.getProperty(key) == null) {
                        System.setProperty(key, value);
                    }
                }
            } catch (IOException e) {
                throw new IllegalStateException("Could not read local .env file: " + file, e);
            }
            return;
        }
    }
}
