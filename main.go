package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
)

var wd string
var exeDir string

func main() {
	var err error
	// Define flags for service and form creation.
	createService := flag.Bool("s", false, "Create a service")
	generateForm := flag.Bool("f", false, "Generate a form")
	flag.Parse()

	// Ensure at least one action is specified.
	if !*createService && !*generateForm {
		fmt.Println("No action specified. Use -s, -f, or both to perform an action.")
		os.Exit(1)
	}

	args := flag.Args()

	// Determine required arguments based on flags provided.
	if *createService {
		// For service creation (with or without form), we need both entity name and route.
		if len(args) != 2 {
			fmt.Println("Entity name and route are required for service creation.")
			os.Exit(1)
		}
	} else if *generateForm {
		// Only form generation requires one argument.
		if len(args) != 1 {
			fmt.Println("Entity name is required for form generation.")
			os.Exit(1)
		}
	}

	wdPre, err := os.Getwd()
	if err != nil {
		fmt.Println("Error getting working directory:", err)
		return
	}

	wd = filepath.Dir(wdPre)

	// Get the absolute path of the executable
	exePath, err := os.Executable()
	if err != nil {
		fmt.Println("Error getting executable path:", err)
		return
	}

	exeDir = filepath.Dir(exePath)

	// Execute actions based on the flags.
	if *createService {
		entityName := args[0]
		route := args[1]
		createServiceFile(entityName, route)
		CreateTableTs(entityName)
		CreateTableHtml(entityName)
		CreateEmptyCss(entityName)
		fmt.Println("Service created successfully.")
	}

	if *generateForm {
		// If both flags are provided, the first argument is the entity name.
		// For form only mode, args[0] is also the entity name.
		entityName := args[0]
		if err := generateFormFile(entityName); err != nil {
			fmt.Printf("Error at generating form file: %v\n", err)
			os.Exit(1)
		}
		fmt.Println("Form created successfully.")
	}
}
