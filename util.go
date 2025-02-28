package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"unicode"
)

func toKebabCase(s string) string {
	// Use a regular expression to insert a hyphen between lower-case/number and upper-case letters.
	re := regexp.MustCompile("([a-z0-9])([A-Z])")
	se := re.ReplaceAllString(s, "${1}-${2}")
	return strings.ToLower(se)
}

func toPascalCase(s string) string {
	if s == "" {
		return s
	}

	words := strings.Split(s, "-")
	for i, word := range words {
		if len(word) > 0 {
			words[i] = strings.ToUpper(word[:1]) + word[1:]
		}
	}

	return strings.Join(words, "")
}

func toLowerCamelCase(s string) string {
	return lowerFirst(toCamelCase(s, false))
}

func toUpperCamelCase(s string) string {
	return toCamelCase(s, true)
}

func toCamelCase(s string, upper bool) string {
	parts := strings.Split(s, "-")
	for i, part := range parts {
		if i == 0 && !upper {
			continue
		}
		if len(part) == 0 {
			continue
		}
		parts[i] = strings.ToUpper(part[:1]) + part[1:]
	}
	return strings.Join(parts, "")
}

func lowerFirst(s string) string {
	if s == "" {
		return s
	}
	runes := []rune(s)
	runes[0] = unicode.ToLower(runes[0])
	return string(runes)
}

func sentenceFromKebab(s string) string {
	words := strings.Split(s, "-")
	for i, word := range words {
		words[i] = strings.ToLower(word)
	}
	sentence := strings.Join(words, " ")
	if len(sentence) > 0 {
		sentence = strings.ToUpper(sentence[:1]) + sentence[1:]
	}
	return sentence
}

func insertAfterMarker(templateContent, marker, block string) string {
	index := strings.Index(templateContent, marker)
	if index == -1 {
		return templateContent // Marker not found, return as is
	}
	index += len(marker) // Move index to the end of the marker
	return templateContent[:index] + "\n" + block + templateContent[index:]
}

func standardReplacement(templateContent, interfaceName string) string {
	templateContent = strings.ReplaceAll(templateContent, "%E%", toPascalCase(interfaceName))
	templateContent = strings.ReplaceAll(templateContent, "%em%", toLowerCamelCase(interfaceName))
	templateContent = strings.ReplaceAll(templateContent, "%e%", toLowerCamelCase(interfaceName))
	templateContent = strings.ReplaceAll(templateContent, "%s%", sentenceFromKebab(interfaceName))
	templateContent = strings.ReplaceAll(templateContent, "%k%", toKebabCase(interfaceName))
	return templateContent
}

func extractDescriptionFieldName(input string) string {
	reDesc := regexp.MustCompile(`;\s*(desc\w*)\s*:`)
	matches := reDesc.FindStringSubmatch(input)
	if len(matches) > 1 {
		return strings.TrimSpace(matches[1])
	}

	reNombre := regexp.MustCompile(`;\s*(nombre\w*)\s*:`)
	matches = reNombre.FindStringSubmatch(input)
	if len(matches) > 1 {
		return strings.TrimSpace(matches[1])
	}

	return ""
}

func extractFieldType(input, fieldName string) string {
	pattern := fmt.Sprintf(`%s\s*:\s*([^;]+)\s*;`, fieldName)
	re := regexp.MustCompile(pattern)
	matches := re.FindStringSubmatch(input)
	if len(matches) > 1 {
		return strings.TrimSpace(matches[1])
	}
	return ""
}
func openModelAsString(interfaceName string) (string, error) {
	modelPath := filepath.Join("src", "app", "core", "models", fmt.Sprintf("%s.model.ts", toKebabCase(interfaceName)))
	modelPath = filepath.Join(".", modelPath)
	modelData, err := os.ReadFile(modelPath)
	if err != nil {
		return "", fmt.Errorf("failed to read model file: %w", err)
	}
	modelContent := string(modelData)
	return modelContent, nil
}
