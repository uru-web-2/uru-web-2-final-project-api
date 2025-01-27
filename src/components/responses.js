// Create a new success response
export function successResponse(data) {
    return {
        status: "success",
        data
    }
}

// Create a new error response
export function errorResponse(message, data, code) {
    return {
        status: "error",
        message,
        data,
        code
    }
}

// Create a new fail response
export function failResponse(data, code) {
    return {
        status: "fail",
        data,
        code
    }
}