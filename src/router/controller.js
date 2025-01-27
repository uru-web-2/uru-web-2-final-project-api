// Controller for the base route
class Controller {
    // Execute the request
    Execute(req, res) {
        // Handle the request
        res.status(200).json({message: "Request executed"})
    }
}

// Export an instance of the controller
const CONTROLLER = new Controller();
export default CONTROLLER;