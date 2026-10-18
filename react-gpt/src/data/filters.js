const filters = {
    "coffee": [
        {
            filterName: "type",
            filterLabel: "Types",
            filterType: "Checkbox",
            filterSubcategories: ["Coffee Beans", "Ground Coffee", "Instant Coffee", "Syrups"]
        },
        {
            filterName: "brand",
            filterLabel: "Brands",
            filterType: "Checkbox",
            filterSubcategories: ["Nations", "Himalayan Brew", "Everest Roasters", "Origin Select", "Bold Bean", "Daily Grind", "Green Mountain"]
        },
        {
            filterName: "coffeeType",
            filterLabel: "Coffee Type",
            filterType: "Checkbox",
            filterSubcategories: ["Arabica", "Robusta", "Blend"]
        },
        {
            filterName: "price",
            filterLabel: "Price Range",
            filterType: "Range",
            filterMin: 0,
            filterMax: 100
        },
    ],
    "equipment": [
        {
            filterName: "type",
            filterLabel: "Types",
            filterType: "Checkbox",
            filterSubcategories: []
        },
        {
            filterName: "brand",
            filterLabel: "Brands",
            filterType: "Checkbox",
            filterSubcategories: []
        },
        {
            filterName: "price",
            filterLabel: "Price Range",
            filterType: "Range",
            filterMin: 0,
            filterMax: 100
        },
    ],
    "merch": [
        {
            filterName: "type",
            filterLabel: "Types",
            filterType: "Checkbox",
            filterSubcategories: []
        },
        {
            filterName: "Brands",
            filterType: "Checkbox",
            filterSubcategories: []
        },
        {
            filterName: "price",
            filterLabel: "Price Range",
            filterType: "Range",
            filterMin: null,
            filterMax: null,
        },
    ]
};

export default filters;