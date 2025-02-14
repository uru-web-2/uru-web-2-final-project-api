// Excluded script names RegExp
const EXCLUDED_SCRIPT_NAMES = /.*(?:Model|Service|Validator)\.js$|^constants\.js$/

// Check if the script name matches with an excluded script name
export const matchScriptNameFn = (scriptName) => {
    return !EXCLUDED_SCRIPT_NAMES.test(scriptName)
}

// Should return the name of the object plus '.js'
export const scriptNameFn = (objectName) => {
    return objectName + '.js'
}

// Should return the name of the script, without the extension and with the first letter capitalized
export const classNameFn = (scriptPath, scriptName) => {
    scriptName = scriptName.replace(".js", "")
    return scriptName.charAt(0).toUpperCase() + scriptName.slice(1)
}

// Should be default export of the script
export const instanceNameFn = (scriptPath, scriptName) => {
    return "default"
}

// Print the root module recursively
export function printModule(module, ...parentModules) {
    // Check if the parent modules are empty
    let modulesName
    if (parentModules.length === 0) {
        modulesName = ["router"]
    } else {
        modulesName = [...parentModules, module.name]
    }

    // Get the module name
    const moduleName = modulesName.join(".")

    // Iterate over the objects
    for (const objectName of Object.keys(module.objects)) {
        // Get the object
        const object = module.getObject(objectName)

        // Iterate over the object methods
        for (const methodName of Object.keys(object.methods)) {
            // Get the method
            const method = object.getMethod(methodName)

            // Print the method
            console.log(`Module: ${moduleName}, Object: ${objectName}, Method: ${methodName}, Allowed Profiles: ${method.allowedProfiles}`)
        }
    }

    // Iterate over the modules
    for (const nestedModuleName of Object.keys(module.nestedModules)) {
        // Get the nested module
        const nestedModule = module.getNestedModule(nestedModuleName)

        // Print the nested module
        printModule(nestedModule, ...modulesName)
    }
}