package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func CreateTableTs(entityName string) {
	templateContent, err := os.ReadFile(exeDir + "/templates/table.ts")
	if err != nil {
		fmt.Printf("Error reading template: %v\n", err)
		os.Exit(1)
	}

	E := toUpperCamelCase(entityName)
	e := toLowerCamelCase(entityName)
	k := toKebabCase(entityName)
	s := sentenceFromKebab(entityName)

	newContent := string(templateContent)
	newContent = strings.ReplaceAll(newContent, "%E%", E)
	newContent = strings.ReplaceAll(newContent, "%e%", e)
	newContent = strings.ReplaceAll(newContent, "%k%", k)
	newContent = strings.ReplaceAll(newContent, "%s%", s)

	outputDir := "." + "/src/app/features/mantenedores/" + entityName
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		fmt.Printf("Error creating directories: %v\n", err)
		os.Exit(1)
	}

	fileName := fmt.Sprintf("%s.component.ts", entityName)
	outputPath := filepath.Join(outputDir, fileName)

	if err := os.WriteFile(outputPath, []byte(newContent), 0644); err != nil {
		fmt.Printf("Error writing file: %v\n", err)
		os.Exit(1)
	}
}

func CreateEmptyCss(entityName string) {
	outputDir := "." + "/src/app/features/mantenedores/" + entityName
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		fmt.Printf("Error creating directories: %v\n", err)
		os.Exit(1)
	}
	fileName := fmt.Sprintf("%s.component.css", entityName)
	outputPath := filepath.Join(outputDir, fileName)

	if err := os.WriteFile(outputPath, []byte(""), 0644); err != nil {
		fmt.Printf("Error writing file: %v\n", err)
		os.Exit(1)
	}
}

func CreateTableHtml(entityName string) {
	templateContent, err := os.ReadFile(exeDir + "/templates/table.html")
	if err != nil {
		fmt.Printf("Error reading template: %v\n", err)
		os.Exit(1)
	}

	E := toUpperCamelCase(entityName)
	e := toLowerCamelCase(entityName)
	k := toKebabCase(entityName)
	s := sentenceFromKebab(entityName)

	newContent := string(templateContent)
	newContent = strings.ReplaceAll(newContent, "%E%", E)
	newContent = strings.ReplaceAll(newContent, "%e%", e)
	newContent = strings.ReplaceAll(newContent, "%k%", k)
	newContent = strings.ReplaceAll(newContent, "%s%", s)

	outputDir := "." + "/src/app/features/mantenedores/" + entityName
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		fmt.Printf("Error creating directories: %v\n", err)
		os.Exit(1)
	}

	fileName := fmt.Sprintf("%s.component.html", entityName)
	outputPath := filepath.Join(outputDir, fileName)

	if err := os.WriteFile(outputPath, []byte(newContent), 0644); err != nil {
		fmt.Printf("Error writing file: %v\n", err)
		os.Exit(1)
	}
}
