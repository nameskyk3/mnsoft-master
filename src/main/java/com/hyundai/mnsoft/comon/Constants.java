package com.hyundai.mnsoft.comon;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Configuration
@EnableConfigurationProperties
@ConfigurationProperties(prefix = "server.address")
public class Constants {

    public static String PROJECT_NAME;
    public static String PROJECT_HEADER;

    @Value("${property.projectName}")
    public void setProjectName(String projectName) {
        this.PROJECT_NAME = projectName;
    }

    @Value("${property.projectHeader}")
    public void setProjectHeader(String value) {
        this.PROJECT_HEADER = value;
    }
}