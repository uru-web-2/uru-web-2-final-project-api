// Excluded script names RegExp
const EXCLUDED_SCRIPT_NAMES = /.*(?:Model|Service|Validator)\.js$|^constants\.js$/

// Check if the script name matches with an excluded script name
export const matchScriptNameFn = (scriptName) => {
    return !EXCLUDED_SCRIPT_NAMES.test(scriptName)
}

// Should return the name of the object plus '.js'
export const scriptNameFn=(objectName)=>{
    return objectName+'.js'
}

// Should return the name of the script, without the extension and with the first letter capitalized
export const classNameFn= (scriptPath, scriptName) => {
    scriptName = scriptName.replace(".js", "")
        return scriptName.charAt(0).toUpperCase() + scriptName.slice(1)
}


// Should be default export of the script
export const instanceNameFn=(scriptPath, scriptName) => {
            return "default"
        }