// Define a new type (a function that returns a string)
type myType = () => string;

// Declare a variable of type myType
const module: myType = () => "Hello world!";

// Export it as default
export default module;
