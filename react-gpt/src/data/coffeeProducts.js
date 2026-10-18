const createProducts = (prefix, category, items, getDetails) =>
    items.map((item, index) => {
        const [
            name,
            brand,
            type,
            price,
            discountPercent,
            ratingAvg,
            ratingTotal,
            stock,
            ...details
        ] = item;

        const id = `${prefix}-${String(index + 1).padStart(3, "0")}`;

        return {
            id,
            sku: `SKU-${id.toUpperCase()}`,
            name,
            brand,
            type,
            category,
            price,
            discountPercent,
            imageUrl: `/storefront/${id}.jpg`,
            ratingAvg,
            ratingTotal,
            stock,
            isFeatured: index % 4 === 0,
            isActive: true,
            ...getDetails(details)
        };
    });

// Each row:
// name, brand, type, price, discount, rating, reviews, stock, ...category-specific data

const coffeeProducts = createProducts("coffee", "coffee", [
    ["Nations Coffee", "Nations", "Coffee Beans", 1000, 0.10, 4.8, 324, 45, "Arabica", "Medium", "Whole Bean", "Nepal", 250],
    ["Himalayan Sunrise", "Himalayan Brew", "Coffee Beans", 1200, 0.05, 4.7, 186, 32, "Arabica", "Light", "Whole Bean", "Nepal", 250],
    ["Everest Espresso Blend", "Everest Roasters", "Coffee Beans", 950, 0.15, 4.6, 142, 28, "Blend", "Dark", "Whole Bean", "Nepal", 250],
    ["Colombian Supremo", "Origin Select", "Coffee Beans", 1450, 0.10, 4.9, 278, 21, "Arabica", "Medium", "Whole Bean", "Colombia", 250],
    ["Robusta Dark Roast", "Bold Bean", "Coffee Beans", 800, 0, 4.3, 97, 50, "Robusta", "Dark", "Whole Bean", "Vietnam", 250],
    ["Ethiopian Yirgacheffe", "Origin Select", "Coffee Beans", 1600, 0.08, 4.9, 213, 18, "Arabica", "Light", "Whole Bean", "Ethiopia", 250],
    ["Pokhara Valley Reserve", "Himalayan Brew", "Coffee Beans", 1350, 0.05, 4.8, 145, 24, "Arabica", "Medium", "Whole Bean", "Nepal", 500],
    ["Midnight Oil Blend", "Bold Bean", "Coffee Beans", 1100, 0.12, 4.5, 119, 36, "Blend", "Dark", "Whole Bean", "Brazil", 250],
    ["Kenyan AA Coffee", "Origin Select", "Coffee Beans", 1750, 0.10, 4.8, 164, 15, "Arabica", "Medium", "Whole Bean", "Kenya", 250],
    ["Brazilian Santos", "Daily Grind", "Coffee Beans", 1250, 0, 4.5, 108, 40, "Arabica", "Medium", "Whole Bean", "Brazil", 500],
    ["Decaf Mountain Roast", "Green Mountain", "Coffee Beans", 1500, 0.07, 4.4, 86, 19, "Arabica", "Medium", "Whole Bean", "Nepal", 250],
    ["Organic Forest Blend", "Green Mountain", "Coffee Beans", 1650, 0.10, 4.7, 134, 22, "Blend", "Medium", "Whole Bean", "Nepal", 500]
], ([coffeeType, roastLevel, grindSize, origin, weightGrams]) => ({
    coffeeType, roastLevel, grindSize, origin, weightGrams
}));

const groundCoffeeProducts = createProducts("ground", "coffee", [
    ["Classic House Ground", "Nations", "Ground Coffee", 750, 0.10, 4.5, 156, 44, "Arabica", "Medium", "Medium", "Nepal", 250],
    ["French Press Blend", "Daily Grind", "Ground Coffee", 850, 0.05, 4.6, 118, 31, "Blend", "Medium", "Coarse", "Brazil", 250],
    ["Fine Espresso Grounds", "Everest Roasters", "Ground Coffee", 1100, 0.12, 4.7, 203, 27, "Arabica", "Dark", "Fine", "Nepal", 250],
    ["Breakfast Ground Coffee", "Daily Grind", "Ground Coffee", 650, 0, 4.4, 89, 60, "Blend", "Medium", "Medium", "Brazil", 250],
    ["Organic Breakfast Blend", "Green Mountain", "Ground Coffee", 1300, 0.10, 4.8, 174, 24, "Arabica", "Light", "Medium", "Nepal", 250],
    ["Cold Brew Grounds", "ChillBrew", "Ground Coffee", 950, 0.08, 4.6, 102, 35, "Arabica", "Medium", "Coarse", "Colombia", 500],
    ["Italian Dark Ground", "Bold Bean", "Ground Coffee", 900, 0.05, 4.5, 94, 29, "Blend", "Dark", "Fine", "Italy", 250],
    ["Pour Over Single Origin", "Origin Select", "Ground Coffee", 1400, 0.10, 4.9, 132, 18, "Arabica", "Light", "Medium", "Ethiopia", 250]
], ([coffeeType, roastLevel, grindSize, origin, weightGrams]) => ({
    coffeeType, roastLevel, grindSize, origin, weightGrams
}));

const instantCoffeeProducts = createProducts("instant", "coffee", [
    ["Gold Instant Coffee", "Morning Cup", "Instant Coffee", 550, 0.05, 4.4, 312, 70, "Arabica", "Gold", 100],
    ["Classic Instant Coffee", "Daily Grind", "Instant Coffee", 350, 0, 4.2, 204, 85, "Blend", "Classic", 100],
    ["Freeze-Dried Premium", "Morning Cup", "Instant Coffee", 900, 0.10, 4.7, 141, 38, "Arabica", "Freeze-dried", 100],
    ["Hazelnut Instant Coffee", "Aroma House", "Instant Coffee", 650, 0.08, 4.5, 108, 42, "Flavored", "Hazelnut", 100],
    ["Mocha Instant Coffee", "SweetBrew", "Instant Coffee", 700, 0.10, 4.6, 97, 33, "Flavored", "Mocha", 150],
    ["Instant Espresso Powder", "BaristaWorks", "Instant Coffee", 800, 0.05, 4.3, 76, 26, "Blend", "Espresso", 100]
], ([coffeeType, variant, weightGrams]) => ({
    coffeeType, variant, weightGrams
}));

const machineProducts = createProducts("machine", "equipment", [
    ["Barista Pro Espresso Machine", "BrewMaster", "Coffee Machine", 28500, 0.10, 4.8, 167, 8, "Espresso", 1500, 15, 2, "Semi-automatic"],
    ["Compact Drip Coffee Maker", "HomeBrew", "Coffee Machine", 8500, 0.15, 4.5, 134, 14, "Drip", 900, 12, 1.2, "Automatic"],
    ["Automatic Cappuccino Machine", "BrewMaster", "Coffee Machine", 42000, 0.12, 4.9, 92, 5, "Espresso", 1450, 19, 2, "Fully automatic"],
    ["Portable Espresso Maker", "TravelBrew", "Coffee Machine", 6500, 0.05, 4.6, 213, 18, "Portable", 0, 0, 0.08, "Manual"],
    ["Single Serve Coffee Machine", "QuickCup", "Coffee Machine", 12000, 0.10, 4.4, 121, 10, "Pod", 1200, 19, 0.8, "Automatic"],
    ["Commercial Espresso Station", "BaristaWorks", "Coffee Machine", 68000, 0.08, 4.9, 54, 3, "Commercial espresso", 2800, 15, 4, "Semi-automatic"],
    ["Cold Brew Coffee Machine", "ChillBrew", "Coffee Machine", 7500, 0.05, 4.3, 73, 12, "Cold brew", 50, 0, 1.5, "Manual"],
    ["Mini Office Coffee Maker", "HomeBrew", "Coffee Machine", 5800, 0, 4.2, 88, 16, "Drip", 700, 10, 0.6, "Automatic"]
], ([machineType, powerWatts, pressureBar, capacityLiters, operationMode]) => ({
    machineType, powerWatts, pressureBar, capacityLiters, operationMode
}));

const brewingProducts = createProducts("brew", "equipment", [
    ["Classic French Press", "BrewCraft", "Brewing Equipment", 1800, 0.10, 4.7, 245, 32, "French press", 1000, "Borosilicate glass", "Manual"],
    ["Pour Over Dripper", "PourPerfect", "Brewing Equipment", 1200, 0.05, 4.8, 187, 28, "Pour over", 400, "Ceramic", "Manual"],
    ["Glass Cold Brew Maker", "ChillBrew", "Brewing Equipment", 2400, 0.12, 4.6, 143, 21, "Cold brew", 1000, "Borosilicate glass", "Manual"],
    ["Moka Pot Espresso Brewer", "Italian Brew", "Brewing Equipment", 2200, 0.08, 4.7, 196, 17, "Moka pot", 300, "Aluminum", "Stovetop"],
    ["Ceramic Pour Over Set", "PourPerfect", "Brewing Equipment", 3200, 0.10, 4.9, 115, 13, "Pour over", 600, "Ceramic", "Manual"],
    ["Travel Coffee Brewer", "TravelBrew", "Brewing Equipment", 2800, 0.05, 4.6, 154, 20, "Portable", 350, "Stainless steel", "Manual"],
    ["Siphon Coffee Brewer", "BrewCraft", "Brewing Equipment", 5500, 0.10, 4.5, 67, 7, "Siphon", 600, "Glass", "Manual"],
    ["Vietnamese Phin Filter", "Origin Select", "Brewing Equipment", 550, 0, 4.7, 203, 45, "Phin", 180, "Stainless steel", "Manual"],
    ["Stovetop Percolator", "Italian Brew", "Brewing Equipment", 1900, 0.05, 4.3, 81, 16, "Percolator", 900, "Stainless steel", "Stovetop"],
    ["Large French Press", "BrewCraft", "Brewing Equipment", 2400, 0.08, 4.8, 139, 19, "French press", 1200, "Borosilicate glass", "Manual"]
], ([brewingMethod, capacityMl, material, heatingMethod]) => ({
    brewingMethod, capacityMl, material, heatingMethod
}));

const grinderProducts = createProducts("grinder", "equipment", [
    ["Precision Burr Grinder", "GrindPro", "Coffee Grinder", 7500, 0.10, 4.8, 174, 9, "Burr", 40, 30, "Electric"],
    ["Compact Electric Grinder", "GrindPro", "Coffee Grinder", 3200, 0.15, 4.4, 218, 20, "Blade", 60, 1, "Electric"],
    ["Manual Ceramic Burr Grinder", "BrewCraft", "Coffee Grinder", 2600, 0.05, 4.7, 142, 25, "Burr", 30, 0, "Manual"],
    ["Commercial Coffee Grinder", "BaristaWorks", "Coffee Grinder", 18500, 0.08, 4.9, 81, 4, "Burr", 80, 60, "Electric"],
    ["Travel Hand Grinder", "TravelBrew", "Coffee Grinder", 1800, 0.10, 4.5, 93, 31, "Burr", 25, 0, "Manual"],
    ["Digital Dose Grinder", "PrecisionBrew", "Coffee Grinder", 12500, 0.12, 4.8, 105, 6, "Burr", 50, 150, "Electric"]
], ([grinderType, capacityGrams, grindSettings, operationMode]) => ({
    grinderType, capacityGrams, grindSettings, operationMode
}));

const accessoryProducts = createProducts("accessory", "equipment", [
    ["Stainless Milk Frother", "BaristaWorks", "Accessories", 1600, 0.10, 4.5, 192, 35, "Milk frother", "Stainless steel", "Handheld"],
    ["Digital Coffee Scale", "PrecisionBrew", "Accessories", 2500, 0.05, 4.8, 166, 18, "Coffee scale", "ABS and glass", "Rechargeable"],
    ["Gooseneck Pouring Kettle", "PourPerfect", "Accessories", 4200, 0.12, 4.9, 123, 11, "Kettle", "Stainless steel", "Electric"],
    ["Espresso Tamper", "BaristaWorks", "Accessories", 1400, 0, 4.6, 98, 24, "Tamper", "Stainless steel", "Manual"],
    ["Barista Milk Pitcher", "BaristaWorks", "Accessories", 1800, 0.05, 4.7, 112, 26, "Milk pitcher", "Stainless steel", "Manual"],
    ["Reusable Coffee Filter", "EcoBrew", "Accessories", 650, 0.10, 4.4, 87, 52, "Filter", "Stainless steel", "Reusable"],
    ["Espresso Distribution Tool", "PrecisionBrew", "Accessories", 2200, 0.08, 4.8, 76, 14, "Distribution tool", "Aluminum", "Manual"],
    ["Coffee Knock Box", "BaristaWorks", "Accessories", 1900, 0.05, 4.5, 94, 17, "Knock box", "Stainless steel", "Manual"],
    ["Latte Art Pen", "CupCulture", "Accessories", 450, 0, 4.3, 63, 40, "Latte art tool", "Stainless steel", "Manual"],
    ["Coffee Thermometer", "PrecisionBrew", "Accessories", 750, 0.05, 4.4, 85, 29, "Thermometer", "Stainless steel", "Digital"],
    ["Barista Cleaning Brush Set", "BrewCare", "Accessories", 600, 0.10, 4.6, 116, 37, "Cleaning brush", "Nylon and wood", "Manual"],
    ["Coffee Dosing Funnel", "PrecisionBrew", "Accessories", 1100, 0.08, 4.7, 73, 21, "Dosing funnel", "Aluminum", "Manual"]
], ([accessoryType, material, operationMode]) => ({
    accessoryType, material, operationMode
}));

const drinkwareProducts = createProducts("drinkware", "equipment", [
    ["Minimalist Ceramic Mug", "CupCulture", "Drinkware", 650, 0.05, 4.6, 153, 40, "Mug", 350, "Ceramic", false],
    ["Double Wall Glass Cup", "GlassBrew", "Drinkware", 950, 0.10, 4.8, 174, 25, "Glass cup", 250, "Borosilicate glass", true],
    ["Travel Coffee Tumbler", "TravelBrew", "Drinkware", 1500, 0.12, 4.7, 221, 22, "Tumbler", 450, "Stainless steel", true],
    ["Insulated Steel Mug", "ThermoCup", "Drinkware", 1800, 0.08, 4.6, 138, 19, "Travel mug", 400, "Stainless steel", true],
    ["Espresso Cup and Saucer", "CupCulture", "Drinkware", 1300, 0.10, 4.9, 102, 15, "Espresso set", 90, "Ceramic", false],
    ["Large Coffee Mug", "CupCulture", "Drinkware", 850, 0.05, 4.5, 91, 30, "Mug", 500, "Ceramic", false],
    ["Collapsible Travel Cup", "TravelBrew", "Drinkware", 1100, 0.08, 4.4, 76, 28, "Travel cup", 350, "Silicone", true],
    ["Latte Glass Set", "GlassBrew", "Drinkware", 1600, 0.10, 4.8, 117, 14, "Latte glass", 300, "Borosilicate glass", false]
], ([drinkwareType, capacityMl, material, insulated]) => ({
    drinkwareType, capacityMl, material, insulated
}));

const storageProducts = createProducts("storage", "equipment", [
    ["Airtight Coffee Canister", "FreshLock", "Storage", 1400, 0.10, 4.7, 144, 22, "Canister", 500, "Stainless steel", true],
    ["Vacuum Bean Container", "FreshLock", "Storage", 2200, 0.08, 4.8, 119, 14, "Vacuum container", 1000, "Plastic and steel", true],
    ["Coffee Bean Storage Jar", "GlassBrew", "Storage", 750, 0, 4.4, 88, 34, "Storage jar", 600, "Glass", false],
    ["Coffee Bag Sealing Clips", "BrewCare", "Storage", 350, 0.05, 4.3, 61, 50, "Bag clip", 0, "Stainless steel", false],
    ["Coffee Storage Vault", "FreshLock", "Storage", 2800, 0.12, 4.9, 97, 11, "Storage vault", 1200, "Stainless steel", true],
    ["Countertop Coffee Organizer", "HomeBrew", "Storage", 1900, 0.08, 4.5, 72, 16, "Organizer", 2000, "Bamboo", false]
], ([storageType, capacityGrams, material, airtight]) => ({
    storageType, capacityGrams, material, airtight
}));

const supplyProducts = createProducts("supply", "equipment", [
    ["Paper Coffee Filters Pack", "EcoBrew", "Coffee Filters", 350, 0.05, 4.5, 113, 70, "Paper", 100, "Pour over"],
    ["Espresso Cleaning Tablets", "BrewCare", "Coffee Filters", 850, 0.10, 4.7, 96, 36, "Cleaning tablets", 10, "Espresso machine"],
    ["Reusable Metal Filter", "EcoBrew", "Coffee Filters", 900, 0.05, 4.6, 77, 24, "Metal", 1, "Pour over"],
    ["Water Filter Cartridge", "BrewCare", "Coffee Filters", 1200, 0.08, 4.5, 83, 18, "Water cartridge", 1, "Compatible coffee machines"],
    ["Descaling Solution", "BrewCare", "Coffee Filters", 750, 0.10, 4.7, 105, 40, "Descaler", 250, "Coffee machines"],
    ["Cold Brew Filter Bags", "ChillBrew", "Coffee Filters", 500, 0.05, 4.4, 67, 32, "Reusable mesh", 10, "Cold brew"]
], ([supplyType, quantity, compatibleWith]) => ({
    supplyType, quantity, compatibleWith
}));

const syrupProducts = createProducts("syrup", "coffee", [
    ["Vanilla Coffee Syrup", "Aroma House", "Syrups", 700, 0.10, 4.6, 132, 30, "Vanilla", 750, "Sweet"],
    ["Caramel Coffee Syrup", "Aroma House", "Syrups", 750, 0.05, 4.8, 158, 26, "Caramel", 750, "Sweet"],
    ["Hazelnut Coffee Syrup", "SweetBrew", "Syrups", 800, 0.08, 4.5, 104, 23, "Hazelnut", 750, "Sweet"],
    ["Sugar-Free Vanilla Syrup", "Aroma House", "Syrups", 850, 0.05, 4.4, 72, 19, "Vanilla", 750, "Sugar-free"],
    ["Chocolate Mocha Sauce", "SweetBrew", "Syrups", 950, 0.10, 4.8, 116, 16, "Chocolate", 500, "Sweet"],
    ["Cinnamon Coffee Syrup", "Aroma House", "Syrups", 780, 0, 4.3, 54, 21, "Cinnamon", 750, "Spiced"]
], ([flavor, volumeMl, flavorProfile]) => ({
    flavor, volumeMl, flavorProfile
}));

const giftProducts = createProducts("gift", "equipment", [
    ["Home Barista Starter Kit", "BrewCraft", "Gift Sets", 5500, 0.12, 4.9, 87, 8, "Starter kit", ["Dripper", "Scale", "Filters"], "Beginner"],
    ["Coffee Lover Gift Box", "Nations", "Gift Sets", 3200, 0.10, 4.8, 143, 12, "Gift box", ["Coffee beans", "Mug", "Scoop"], "All levels"],
    ["Premium Coffee Tasting Set", "Origin Select", "Gift Sets", 4500, 0.08, 4.9, 64, 7, "Tasting set", ["Ethiopian", "Colombian", "Nepalese"], "Enthusiast"],
    ["Pour Over Gift Bundle", "PourPerfect", "Gift Sets", 3800, 0.10, 4.7, 71, 10, "Brewing bundle", ["Dripper", "Server", "Filters"], "Beginner"]
], ([giftSetType, contents, skillLevel]) => ({
    giftSetType, contents, skillLevel
}));

const apparelProducts = createProducts("apparel", "merch", [
    ["Barista Apron", "BaristaWorks", "Apparel", 1800, 0.05, 4.5, 68, 16, "Apron", ["S", "M", "L", "XL"], "Black", "Cotton blend"],
    ["Coffee Art Notebook", "CupCulture", "Goodies", 550, 0, 4.4, 59, 35, "Notebook", ["A5"], "Brown", "Recycled paper"],
    ["Coffee Club T-Shirt", "CupCulture", "Apparel", 1200, 0.10, 4.6, 82, 22, "T-shirt", ["S", "M", "L", "XL"], "Cream", "Cotton"],
    ["Barista Baseball Cap", "BaristaWorks", "Apparel", 850, 0.05, 4.3, 47, 19, "Cap", ["One size"], "Black", "Cotton"],
    ["Coffee Beans Tote Bag", "EcoBrew", "Apparel", 650, 0.08, 4.5, 61, 28, "Tote bag", ["One size"], "Natural", "Canvas"],
    ["Coffee-Themed Hoodie", "CupCulture", "Apparel", 2400, 0.10, 4.7, 53, 11, "Hoodie", ["S", "M", "L", "XL"], "Brown", "Cotton blend"],
    ["Barista Pin Set", "BaristaWorks", "Goodies", 400, 0, 4.2, 36, 45, "Pin set", ["One size"], "Multicolor", "Metal"],
    ["Reusable Coffee Shopping Bag", "EcoBrew", "Goodies", 500, 0.05, 4.4, 58, 33, "Shopping bag", ["One size"], "Green", "Recycled fabric"]
], ([merchandiseType, sizes, color, material]) => ({
    merchandiseType, sizes, color, material
}));

// Combine all categories into one array for your store.
const products = [
    ...coffeeProducts,
    ...groundCoffeeProducts,
    ...instantCoffeeProducts,
    ...machineProducts,
    ...brewingProducts,
    ...grinderProducts,
    ...accessoryProducts,
    ...drinkwareProducts,
    ...storageProducts,
    ...supplyProducts,
    ...syrupProducts,
    ...giftProducts,
    ...apparelProducts
];

export default products;