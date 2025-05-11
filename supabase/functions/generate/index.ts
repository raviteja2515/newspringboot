import { createClient } from "npm:@supabase/supabase-js@2.39.0";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { JSZip } from "npm:jszip@3.10.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const projectData = await req.json();
    const zip = new JSZip();

    // Create pom.xml
    const pomXml = generatePomXml(projectData);
    zip.file("pom.xml", pomXml);

    // Create main application class
    const mainClass = generateMainClass(projectData);
    const packagePath = projectData.groupId.replace(/\./g, "/");
    zip.file(
      `src/main/java/${packagePath}/Application.java`,
      mainClass
    );

    // Create application.properties
    const appProperties = generateApplicationProperties(projectData);
    zip.file("src/main/resources/application.properties", appProperties);

    // Generate ZIP file
    const zipContent = await zip.generateAsync({ type: "uint8array" });

    return new Response(zipContent, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${projectData.artifactId}.zip"`,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to generate project" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function generatePomXml(projectData) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>${projectData.groupId}</groupId>
    <artifactId>${projectData.artifactId}</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>${projectData.projectName}</name>
    <description>${projectData.description}</description>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>${projectData.springBootVersion}</version>
        <relativePath/>
    </parent>
    
    <properties>
        <java.version>${projectData.javaVersion.replace('Java ', '')}</java.version>
    </properties>
    
    <dependencies>
        ${generateDependencies(projectData.dependencies)}
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`;
}

function generateDependencies(dependencies) {
  const depMap = {
    'Spring Web': `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>`,
    'Spring Data JPA': `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>`,
    'Spring Security': `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>`,
    'Lombok': `
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>`,
    'Spring Boot DevTools': `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>`,
    'Spring Boot Actuator': `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>`,
    'Validation': `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>`,
    'Spring Boot Test': `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>`,
    'PostgreSQL Driver': `
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>`,
    'MySQL Driver': `
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>`,
    'MongoDB Driver': `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>`,
    'H2 Driver': `
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>`,
  };

  return Array.from(dependencies)
    .map(dep => depMap[dep] || '')
    .join('\n');
}

function generateMainClass(projectData) {
  return `package ${projectData.groupId};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}`;
}

function generateApplicationProperties(projectData) {
  let properties = `spring.application.name=${projectData.artifactId}\n`;
  
  if (projectData.selectedDatabase) {
    properties += `\n# Database Configuration\n`;
    properties += `spring.datasource.url=${projectData.databaseConfig.url}\n`;
    
    if (projectData.databaseConfig.username) {
      properties += `spring.datasource.username=${projectData.databaseConfig.username}\n`;
    }
    
    if (projectData.databaseConfig.password) {
      properties += `spring.datasource.password=${projectData.databaseConfig.password}\n`;
    }
    
    if (projectData.databaseConfig.driver) {
      properties += `spring.datasource.driver-class-name=${projectData.databaseConfig.driver}\n`;
    }
  }

  return properties;
}