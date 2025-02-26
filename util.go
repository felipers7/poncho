package main

import (
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
