package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func createServiceFile(entityName string, route string) {

	templateContent, err := os.ReadFile(exeDir + "/templates/service.ts")
	if err != nil {
		fmt.Printf("Error reading template: %v\n", err)
		os.Exit(1)
	}

	eid := toLowerCamelCase(entityName) + "Id"
	ee := route
	E := toUpperCamelCase(entityName)
	e := toLowerCamelCase(entityName)
	k := toKebabCase(entityName)

	newContent := string(templateContent)
	newContent = strings.ReplaceAll(newContent, "%eid%", eid)
	newContent = strings.ReplaceAll(newContent, "%ee%", ee)
	newContent = strings.ReplaceAll(newContent, "%E%", E)
	newContent = strings.ReplaceAll(newContent, "%e%", e)
	newContent = strings.ReplaceAll(newContent, "%k%", k)

	outputDir := "." + "/src/app/core/services"
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		fmt.Printf("Error creating directories: %v\n", err)
		os.Exit(1)
	}

	fileName := fmt.Sprintf("%s.service.ts", entityName)
	outputPath := filepath.Join(outputDir, fileName)

	if err := os.WriteFile(outputPath, []byte(newContent), 0644); err != nil {
		fmt.Printf("Error writing file: %v\n", err)
		os.Exit(1)
	}
}

func generateFormFile(interfaceName string) error {

	interfaceName = toPascalCase(interfaceName)
	// Build the path to the model file (always inside app/models)

	modelContent, err := openModelAsString(interfaceName)
	if err != nil {
		return fmt.Errorf("failed to open model file: %w", err)
	}

	fmt.Println("after " + interfaceName)
	// Locate the interface block. We look for "export interface <interfaceName>"
	searchStr := "export interface " + interfaceName
	idx := strings.Index(modelContent, searchStr)
	if idx == -1 {
		return fmt.Errorf("interface %q not found in file", interfaceName)
	}

	// Find the opening brace "{" after the interface name
	braceStart := strings.Index(modelContent[idx:], "{")
	if braceStart == -1 {
		return fmt.Errorf("opening brace not found for interface %q", interfaceName)
	}
	braceStart += idx + 1 // Move past the "{"

	// Find the closing brace "}" for the interface block
	braceEnd := strings.Index(modelContent[braceStart:], "}")
	if braceEnd == -1 {
		return fmt.Errorf("closing brace not found for interface %q", interfaceName)
	}
	// Extract the block of properties between the braces.
	block := modelContent[braceStart : braceStart+braceEnd]

	// Process each line of the interface block.
	lines := strings.Split(block, "\n")
	var selectValues []string
	var selectServices []string
	var inputsLines []string
	var servicesImport []string
	var implementationServices []string
	var formInputs []string
	var objectFields []string
	var formValues []string

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if trimmed == "" {
			continue
		}

		// Expect a line of the form: propertyName: type;
		parts := strings.SplitN(trimmed, ":", 2)
		if len(parts) != 2 {
			continue // skip if it doesn't match expected pattern
		}
		propName := strings.TrimSpace(parts[0])
		propType := strings.TrimSpace(parts[1])
		// Remove the trailing semicolon if present.
		propType = strings.TrimSuffix(propType, ";")

		// Determine the default value:
		// If the type is string, number, boolean or if it contains "[]"
		// then use null; otherwise use {}.
		var defaultVal string
		if propType == "string" || propType == "number" || propType == "boolean" || strings.Contains(propType, "[]") {
			defaultVal = "null"
		} else {
			defaultVal = "{}"
		}

		if defaultVal == "{}" {
			//fmt.Printf("modelContent %s\n", modelContent)
			//fmt.Printf("propName %s\n", propName)
			typeOfVariable, wasFound := ExtractTypeForField(modelContent, propName)
			if !wasFound {
				return fmt.Errorf("failed parsying tpye %s for %s: found %s %w", propName, modelContent, typeOfVariable, errors.New("type couldn't be parsed"))
			}
			//fmt.Printf("typeOfVariable %s\n", typeOfVariable)
			variableContent, err := openModelAsString(typeOfVariable)
			//fmt.Printf("variableContent %s\n", variableContent)
			if err != nil {
				return fmt.Errorf("failed to open model file: %w", err)
			}

			nameOfVariableDesc := extractDescriptionFieldName(variableContent)
			fmt.Printf("nameOfVariableDesc %s", nameOfVariableDesc)

			selectValues = append(selectValues, propName+": "+toPascalCase(propName)+"[] = [];")
			selectServices = append(selectServices, fmt.Sprintf(
				"private %sService: %sService,",
				propName,
				toPascalCase(propName),
			))
			servicesImport = append(servicesImport, fmt.Sprintf(
				`import { %sService } from '../../../core/services/%s.service';
				import { %s } from '../../../core/models/%s.model'; 
				`,
				toPascalCase(propName),
				toKebabCase(propName),
				toPascalCase(propName),
				toKebabCase(propName),
			))

			implementationServices = append(implementationServices, fmt.Sprintf(
				`
					this.%sService.buscarTodos().subscribe({
						next:(%s :%s[])=>{
							this.%s = %s
							const found%s = this.%s.find(e => e.id === this.data.object.%s.id);
				  			this.form.patchValue({ %s: found%s })
						}
					})
				`,
				propName,
				propName,
				toPascalCase(propName),
				propName,
				propName,
				propName,
				propName,
				propName,
				propName,
				propName,
			))
			formInputs = append(formInputs, fmt.Sprintf(
				`
				<mat-form-field appearance="outline" class="full-width">
					<mat-label>{{ 'mantenedores.formularios.%s.label.%s' | translate }}</mat-label>
					<mat-select formControlName="%s">
					<mat-option *ngFor="let option of %s" [value]="option">
						{{ option.%s }}
					</mat-option>
					</mat-select>
				</mat-form-field>
				`,
				toLowerCamelCase(interfaceName),
				propName,
				propName,
				propName,
				nameOfVariableDesc,
			))
		} else {
			if propName != "id" {
				formInputs = append(formInputs, fmt.Sprintf(
					`
					   <mat-form-field appearance="outline" class="w-full dark:text-white  ">
							<mat-label>{{ 'mantenedores.formularios.%s.label.%s' | translate }}</mat-label>
							<input matInput formControlName="%s"
								[attr.placeholder]="'mantenedores.formularios.%s.descripcion' | translate"
								class="w-full dark:text-white ">
							<mat-error *ngIf="form.get('%s')?.hasError('required')" class="text-red-500 text-base">
								{{ 'mantenedores.formularios.campoRequerido' | translate }}
							</mat-error>
						</mat-form-field>
					`,
					toLowerCamelCase(interfaceName),
					propName,
					propName,
					propName,
					propName,
				))
			}
		}

		// Create a line for the form group.
		// (Assuming the property name is already in camelCase.)
		var inputLine string
		if propName == "id" {
			inputLine = fmt.Sprintf("  %s: [%s,],", propName, defaultVal)
		} else {
			inputLine = fmt.Sprintf("  %s: [%s, Validators.required],", propName, defaultVal)
		}
		inputsLines = append(inputsLines, inputLine)

		objectField := fmt.Sprintf("%s: this.data.object.%s,", propName, propName)
		objectFields = append(objectFields, objectField)

		formValue := fmt.Sprintf("%s: this.form.value.%s,", propName, propName)
		formValues = append(formValues, formValue)

	}
	// Combine all generated lines (separated by newlines)
	inputsBlock := strings.Join(inputsLines, "\n")
	selectValuesBlock := strings.Join(selectValues, "\n")
	selectServicesBlock := strings.Join(selectServices, "\n")
	servicesImportBlock := strings.Join(servicesImport, "\n")
	servicesImplementationBlock := strings.Join(implementationServices, "\n")
	objectFieldsBlock := strings.Join(objectFields, "\n")
	formFieldsBlock := strings.Join(formValues, "\n")
	formBlocks := strings.Join(formInputs, "\n")

	// Read the template file from templates/forms.ts.
	templatePath := filepath.Join("templates", "form.ts")
	templateData, err := os.ReadFile(filepath.Join(exeDir, templatePath))
	if err != nil {
		return fmt.Errorf("failed to read template file: %w", err)
	}
	templateContent := string(templateData)

	templateHTMLPath := filepath.Join("templates", "form.html")
	templateHTMLData, err := os.ReadFile(filepath.Join(exeDir, templateHTMLPath))
	if err != nil {
		return fmt.Errorf("failed to read template file: %w", err)
	}
	templateHTMLContent := string(templateHTMLData)

	templateContent = standardReplacement(templateContent, interfaceName)

	// Replace the marker /*inputsflag*/ with the generated inputs block.
	templateContent = insertAfterMarker(templateContent, "/*inputsflag*/", inputsBlock)
	templateContent = insertAfterMarker(templateContent, "/*variable-declarations*/", selectValuesBlock)
	templateContent = insertAfterMarker(templateContent, "/*other-services-injection*/", selectServicesBlock)
	templateContent = insertAfterMarker(templateContent, "/*services-imports*/", servicesImportBlock)
	templateContent = insertAfterMarker(templateContent, "/*services-init-call*/", servicesImplementationBlock)
	templateContent = insertAfterMarker(templateContent, "/*object-fields-edit*/", objectFieldsBlock)
	templateContent = insertAfterMarker(templateContent, "/*form-fields-submit*/", formFieldsBlock)

	templateHTMLContent = insertAfterMarker(templateHTMLContent, "<!--Input -->", formBlocks)
	templateHTMLContent = standardReplacement(templateHTMLContent, interfaceName)

	// Build the output file name using kebab-case.

	outputFileName := fmt.Sprintf("%s.component.ts", toKebabCase(interfaceName))
	outputFileHTMLName := fmt.Sprintf("%s.component.html", toKebabCase(interfaceName))
	outputPath := filepath.Join("src", "app", "shared", "components", "forms", outputFileName)
	outputPathHTML := filepath.Join("src", "app", "shared", "components", "forms", outputFileHTMLName)

	outputDir := "./src/app/shared/components/forms"
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		fmt.Printf("Error creating directories: %v\n", err)
		os.Exit(1)
	}

	// Write the final content to the output file.
	if err := os.WriteFile(outputPath, []byte(templateContent), 0644); err != nil {
		return fmt.Errorf("failed to write output file: %w", err)
	}
	if err := os.WriteFile(outputPathHTML, []byte(templateHTMLContent), 0644); err != nil {
		return fmt.Errorf("failed to write output file: %w", err)
	}

	return nil
}
