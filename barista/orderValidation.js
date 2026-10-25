const METHODS = ["mock-esewa", "mock-khalti", "cash-on-delivery"];

function validateOrder(body) {

    const errors = [];

    if (!body || typeof body !== 'object') {
        return {
            valid: false,
            errors: ["Body must be an object."]
        }
    }

    const customerData = body.customer;

    if (!customerData || 
        !["name", "email", "phone"].every(option => 
            typeof customerData[option] === "string" 
            && customerData[option].trim())) {
                errors.push("Customer Name, Email, and phone are required.");
            }
    
    if (!customerData?.address ||
        !["line1", "city"].every(option =>
            typeof customerData.address[option] === "string"
            && customerData.address[option].trim())) {
                errors.push("Address Line 1 and City are required.");
            }
    
    if (!Array.isArray(body.items) || !body.items.length) {
        errors.push("At least one cart item is required.");
    } else {
        body.items.forEach((i, n) => {
            if (!i || typeof (i.productId ?? i.id) !== "string") {
                errors.push(`Item ${n + 1} needs a productId.`);
            }

            if (!Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 99) {
                errors.push(`Item ${n + 1} quantity must be 1 to 99.`);
            }
        })
    }

    if (!METHODS.includes(body.paymentMethod)) {
        errors.push("Invalid Payment Method.");
    }

    return {
        valid: errors.length === 0,
        errors
    }
}

module.exports = { METHODS, validateOrder }