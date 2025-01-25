// Handle request validation
export function HandleValidation(req, res, validationFn){
    // Validate the request
    const [body, isValid] = validationFn(req);

    // Check if the request is valid
    if (!isValid)
        return res.status(400).json(body);
}