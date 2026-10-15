const products = [
    // ==========================================
    // 1. Coffee Beans
    // ==========================================
    {
        id: 0,
        name: "Nations Coffee",
        brand: "Nations",
        category: "coffee",
        coffeeType: "Arabica",
        price: 1000,
        discountPercent: 0.1,
        imageUrl: "/storefront/Nations_Coffee.jpg",
        ratingAvg: 4.8,
        ratingTotal: 324
    },
    {
        id: 1,
        name: "Himalayan Sunrise Beans",
        brand: "Himalayan Brew",
        category: "coffee",
        coffeeType: "Arabica",
        price: 1200,
        discountPercent: 0.05,
        imageUrl: "/storefront/Himalayan.jpeg",
        ratingAvg: 4.7,
        ratingTotal: 186
    },
    {
        id: 3,
        name: "Everest Espresso Blend",
        brand: "Everest Roasters",
        category: "coffee",
        coffeeType: "Blend",
        price: 950,
        discountPercent: 0.15,
        imageUrl: "/storefront/Everest.jpg",
        ratingAvg: 4.6,
        ratingTotal: 142
    },
    {
        id: 4,
        name: "Colombian Supremo Beans",
        brand: "Origin Select",
        category: "coffee",
        coffeeType: "Arabica",
        price: 1450,
        discountPercent: 0.1,
        imageUrl: "/storefront/Colombian.jpeg",
        ratingAvg: 4.9,
        ratingTotal: 278
    },
    {
        id: 5,
        name: "Robusta Dark Roast",
        brand: "Bold Bean",
        category: "coffee",
        coffeeType: "Robusta",
        price: 800,
        discountPercent: 0,
        imageUrl: "/storefront/Robusta.jpg",
        ratingAvg: 4.3,
        ratingTotal: 97
    },
    {
        id: 6,
        name: "Ethiopian Yirgacheffe",
        brand: "Origin Select",
        category: "coffee",
        coffeeType: "Arabica",
        price: 1600,
        discountPercent: 0.08,
        imageUrl: "/storefront/Ethiopian.jpg",
        ratingAvg: 4.9,
        ratingTotal: 213
    },

    // ==========================================
    // 2. Ground Coffee
    // ==========================================
    {
        id: 7,
        name: "Classic House Ground Coffee",
        brand: "Nations",
        category: "ground-coffee",
        coffeeType: "Arabica",
        price: 750,
        discountPercent: 0.1,
        imageUrl: "",
        ratingAvg: 4.5,
        ratingTotal: 156
    },
    {
        name: "French Press Ground Coffee",
        brand: "Daily Grind",
        category: "ground-coffee",
        coffeeType: "Blend",
        price: 850,
        discountPercent: 0.05,
        imageUrl: "",
        ratingAvg: 4.6,
        ratingTotal: 118
    },
    {
        name: "Fine Espresso Grounds",
        brand: "Everest Roasters",
        category: "ground-coffee",
        coffeeType: "Arabica",
        price: 1100,
        discountPercent: 0.12,
        imageUrl: "",
        ratingAvg: 4.7,
        ratingTotal: 203
    },
    {
        name: "Medium Roast Daily Coffee",
        brand: "Daily Grind",
        category: "ground-coffee",
        coffeeType: "Blend",
        price: 650,
        discountPercent: 0,
        imageUrl: "",
        ratingAvg: 4.4,
        ratingTotal: 89
    },
    {
        name: "Organic Breakfast Blend",
        brand: "Green Mountain",
        category: "ground-coffee",
        coffeeType: "Arabica",
        price: 1300,
        discountPercent: 0.1,
        imageUrl: "",
        ratingAvg: 4.8,
        ratingTotal: 174
    },

    // ==========================================
    // 3. Instant Coffee
    // ==========================================
    {
        name: "Gold Instant Coffee",
        brand: "Morning Cup",
        category: "instant-coffee",
        coffeeType: "Arabica",
        price: 550,
        discountPercent: 0.05,
        imageUrl: "/public/storefront/Gold_Instant_Coffee.jpg",
        ratingAvg: 4.4,
        ratingTotal: 312
    },
    {
        name: "Classic Instant Coffee",
        brand: "Daily Grind",
        category: "instant-coffee",
        coffeeType: "Blend",
        price: 350,
        discountPercent: 0,
        imageUrl: "/public/storefront/Classic_Instant_Coffee.jpg",
        ratingAvg: 4.2,
        ratingTotal: 204
    },
    {
        name: "Premium Freeze-Dried Coffee",
        brand: "Morning Cup",
        category: "instant-coffee",
        coffeeType: "Arabica",
        price: 900,
        discountPercent: 0.1,
        imageUrl: "/public/storefront/Premium_Freeze_Dried_Coffee.jpg",
        ratingAvg: 4.7,
        ratingTotal: 141
    },
    {
        name: "Hazelnut Instant Coffee",
        brand: "Aroma House",
        category: "instant-coffee",
        coffeeType: "Flavored",
        price: 650,
        discountPercent: 0.08,
        imageUrl: "/public/storefront/Hazelnut_Instant_Coffee.jpg",
        ratingAvg: 4.5,
        ratingTotal: 108
    },

    // ==========================================
    // 4. Coffee Machines
    // ==========================================
    {
        name: "Barista Pro Espresso Machine",
        brand: "BrewMaster",
        category: "coffee-machine",
        price: 28500,
        discountPercent: 0.1,
        imageUrl: "/public/storefront/Barista_Pro_Espresso_Machine.jpg",
        ratingAvg: 4.8,
        ratingTotal: 167
    },
    {
        name: "Compact Drip Coffee Maker",
        brand: "HomeBrew",
        category: "coffee-machine",
        price: 8500,
        discountPercent: 0.15,
        imageUrl: "/public/storefront/Compact_Drip_Coffee_Maker.jpg",
        ratingAvg: 4.5,
        ratingTotal: 134
    },
    {
        name: "Automatic Cappuccino Machine",
        brand: "BrewMaster",
        category: "coffee-machine",
        price: 42000,
        discountPercent: 0.12,
        imageUrl: "/public/storefront/Automatic_Cappuccino_Machine.jpg",
        ratingAvg: 4.9,
        ratingTotal: 92
    },
    {
        name: "Portable Espresso Maker",
        brand: "TravelBrew",
        category: "coffee-machine",
        price: 6500,
        discountPercent: 0.05,
        imageUrl: "/public/storefront/Portable_Espresso_Maker.jpg",
        ratingAvg: 4.6,
        ratingTotal: 213
    },
    {
        name: "Single Serve Coffee Machine",
        brand: "QuickCup",
        category: "coffee-machine",
        price: 12000,
        discountPercent: 0.1,
        imageUrl: "/public/storefront/Single_Serve_Coffee_Machine.jpg",
        ratingAvg: 4.4,
        ratingTotal: 121
    },

    // ==========================================
    // 5. Brewing Equipment
    // ==========================================
    {
        name: "Classic French Press",
        brand: "BrewCraft",
        category: "brewing-equipment",
        price: 1800,
        discountPercent: 0.1,
        imageUrl: "/public/storefront/Classic_French_Press.jpg",
        ratingAvg: 4.7,
        ratingTotal: 245
    },
    {
        name: "Pour Over Coffee Dripper",
        brand: "PourPerfect",
        category: "brewing-equipment",
        price: 1200,
        discountPercent: 0.05,
        imageUrl: "/public/storefront/Pour_Over_Coffee_Dripper.jpg",
        ratingAvg: 4.8,
        ratingTotal: 187
    },
    {
        name: "Glass Cold Brew Maker",
        brand: "ChillBrew",
        category: "brewing-equipment",
        price: 2400,
        discountPercent: 0.12,
        imageUrl: "/public/storefront/Glass_Cold_Brew_Maker.jpg",
        ratingAvg: 4.6,
        ratingTotal: 143
    },
    {
        name: "Moka Pot Espresso Brewer",
        brand: "Italian Brew",
        category: "brewing-equipment",
        price: 2200,
        discountPercent: 0.08,
        imageUrl: "/public/storefront/Moka_Pot_Espresso_Brewer.jpg",
        ratingAvg: 4.7,
        ratingTotal: 196
    },
    {
        name: "Ceramic Pour Over Set",
        brand: "PourPerfect",
        category: "brewing-equipment",
        price: 3200,
        discountPercent: 0.1,
        imageUrl: "/public/storefront/Ceramic_Pour_Over_Set.jpg",
        ratingAvg: 4.9,
        ratingTotal: 115
    },
    {
        name: "Aero-Style Coffee Brewer",
        brand: "TravelBrew",
        category: "brewing-equipment",
        price: 2800,
        discountPercent: 0.05,
        imageUrl: "/public/storefront/Aero_Style_Coffee_Brewer.jpg",
        ratingAvg: 4.6,
        ratingTotal: 154
    },

    // ==========================================
    // 6. Coffee Grinders
    // ==========================================
    {
        name: "Precision Burr Grinder",
        brand: "GrindPro",
        category: "coffee-grinder",
        price: 7500,
        discountPercent: 0.1,
        imageUrl: "/public/storefront/Precision_Burr_Grinder.jpg",
        ratingAvg: 4.8,
        ratingTotal: 174
    },
    {
        name: "Compact Electric Grinder",
        brand: "GrindPro",
        category: "coffee-grinder",
        price: 3200,
        discountPercent: 0.15,
        imageUrl: "/public/storefront/Compact_Electric_Grinder.jpg",
        ratingAvg: 4.4,
        ratingTotal: 218
    },
    {
        name: "Manual Ceramic Burr Grinder",
        brand: "BrewCraft",
        category: "coffee-grinder",
        price: 2600,
        discountPercent: 0.05,
        imageUrl: "/public/storefront/Manual_Ceramic_Burr_Grinder.jpg",
        ratingAvg: 4.7,
        ratingTotal: 142
    },
    {
        name: "Commercial Coffee Grinder",
        brand: "BaristaWorks",
        category: "coffee-grinder",
        price: 18500,
        discountPercent: 0.08,
        imageUrl: "/public/storefront/Commercial_Coffee_Grinder.jpg",
        ratingAvg: 4.9,
        ratingTotal: 81
    },

    // ==========================================
    // 7. Coffee Accessories
    // ==========================================
    {
        name: "Stainless Steel Milk Frother",
        brand: "BaristaWorks",
        category: "coffee-accessories",
        price: 1600,
        discountPercent: 0.1,
        imageUrl: "/public/storefront/Stainless_Steel_Milk_Frother.jpg",
        ratingAvg: 4.5,
        ratingTotal: 192
    },
    {
        name: "Digital Coffee Scale",
        brand: "PrecisionBrew",
        category: "coffee-accessories",
        price: 2500,
        discountPercent: 0.05,
        imageUrl: "/public/storefront/Digital_Coffee_Scale.jpg",
        ratingAvg: 4.8,
        ratingTotal: 166
    },
    {
        name: "Gooseneck Pouring Kettle",
        brand: "PourPerfect",
        category: "coffee-accessories",
        price: 4200,
        discountPercent: 0.12,
        imageUrl: "/public/storefront/Gooseneck_Pouring_Kettle.jpg",
        ratingAvg: 4.9,
        ratingTotal: 123
    },
    {
        name: "Espresso Tamper",
        brand: "BaristaWorks",
        category: "coffee-accessories",
        price: 1400,
        discountPercent: 0,
        imageUrl: "/public/storefront/Espresso_Tamper.jpg",
        ratingAvg: 4.6,
        ratingTotal: 98
    },
    {
        name: "Barista Milk Pitcher",
        brand: "BaristaWorks",
        category: "coffee-accessories",
        price: 1800,
        discountPercent: 0.05,
        imageUrl: "/public/storefront/Barista_Milk_Pitcher.jpg",
        ratingAvg: 4.7,
        ratingTotal: 112
    },
    {
        name: "Reusable Coffee Filter",
        brand: "EcoBrew",
        category: "coffee-accessories",
        price: 650,
        discountPercent: 0.1,
        imageUrl: "/public/storefront/Reusable_Coffee_Filter.jpg",
        ratingAvg: 4.4,
        ratingTotal: 87
    },
    {
        name: "Espresso Distribution Tool",
        brand: "PrecisionBrew",
        category: "coffee-accessories",
        price: 2200,
        discountPercent: 0.08,
        imageUrl: "/public/storefront/Espresso_Distribution_Tool.jpg",
        ratingAvg: 4.8,
        ratingTotal: 76
    },
    {
        name: "Coffee Knock Box",
        brand: "BaristaWorks",
        category: "coffee-accessories",
        price: 1900,
        discountPercent: 0.05,
        imageUrl: "/public/storefront/Coffee_Knock_Box.jpg",
        ratingAvg: 4.5,
        ratingTotal: 94
    },

    // ==========================================
    // 8. Mugs and Drinkware
    // ==========================================
    {
        name: "Minimalist Ceramic Coffee Mug",
        brand: "CupCulture",
        category: "mugs-drinkware",
        price: 650,
        discountPercent: 0.05,
        imageUrl: "/public/storefront/Minimalist_Ceramic_Coffee_Mug.jpg",
        ratingAvg: 4.6,
        ratingTotal: 153
    },
    {
        name: "Double Wall Glass Coffee Cup",
        brand: "GlassBrew",
        category: "mugs-drinkware",
        price: 950,
        discountPercent: 0.1,
        imageUrl: "/public/storefront/Double_Wall_Glass_Coffee_Cup.jpg",
        ratingAvg: 4.8,
        ratingTotal: 174
    },
    {
        name: "Travel Coffee Tumbler",
        brand: "TravelBrew",
        category: "mugs-drinkware",
        price: 1500,
        discountPercent: 0.12,
        imageUrl: "/public/storefront/Travel_Coffee_Tumbler.jpg",
        ratingAvg: 4.7,
        ratingTotal: 221
    },
    {
        name: "Insulated Stainless Steel Mug",
        brand: "ThermoCup",
        category: "mugs-drinkware",
        price: 1800,
        discountPercent: 0.08,
        imageUrl: "/public/storefront/Insulated_Stainless_Steel_Mug.jpg",
        ratingAvg: 4.6,
        ratingTotal: 138
    },
    {
        name: "Espresso Cup and Saucer Set",
        brand: "CupCulture",
        category: "mugs-drinkware",
        price: 1300,
        discountPercent: 0.1,
        imageUrl: "/public/storefront/Espresso_Cup_Saucer_Set.jpg",
        ratingAvg: 4.9,
        ratingTotal: 102
    },

    // ==========================================
    // 9. Coffee Storage
    // ==========================================
    {
        name: "Airtight Coffee Storage Canister",
        brand: "FreshLock",
        category: "coffee-storage",
        price: 1400,
        discountPercent: 0.1,
        imageUrl: "/public/storefront/Airtight_Coffee_Storage_Canister.jpg",
        ratingAvg: 4.7,
        ratingTotal: 144
    },
    {
        name: "Vacuum Coffee Bean Container",
        brand: "FreshLock",
        category: "coffee-storage",
        price: 2200,
        discountPercent: 0.08,
        imageUrl: "/public/storefront/Vacuum_Coffee_Bean_Container.jpg",
        ratingAvg: 4.8,
        ratingTotal: 119
    },
    {
        name: "Coffee Bean Storage Jar",
        brand: "GlassBrew",
        category: "coffee-storage",
        price: 750,
        discountPercent: 0,
        imageUrl: "/public/storefront/Coffee_Bean_Storage_Jar.jpg",
        ratingAvg: 4.4,
        ratingTotal: 88
    },

    // ==========================================
    // 10. Filters and Replacement Parts
    // ==========================================
    {
        name: "Paper Coffee Filters Pack",
        brand: "EcoBrew",
        category: "coffee-filters",
        price: 350,
        discountPercent: 0.05,
        imageUrl: "/public/storefront/Paper_Coffee_Filters_Pack.jpg",
        ratingAvg: 4.5,
        ratingTotal: 113
    },
    {
        name: "Espresso Machine Cleaning Tablets",
        brand: "BrewCare",
        category: "coffee-filters",
        price: 850,
        discountPercent: 0.1,
        imageUrl: "/public/storefront/Espresso_Machine_Cleaning_Tablets.jpg",
        ratingAvg: 4.7,
        ratingTotal: 96
    },
    {
        name: "Reusable Metal Coffee Filter",
        brand: "EcoBrew",
        category: "coffee-filters",
        price: 900,
        discountPercent: 0.05,
        imageUrl: "/public/storefront/Reusable_Metal_Coffee_Filter.jpg",
        ratingAvg: 4.6,
        ratingTotal: 77
    },

    // ==========================================
    // 11. Coffee Syrups and Flavorings
    // ==========================================
    {
        name: "Vanilla Coffee Syrup",
        brand: "Aroma House",
        category: "coffee-syrups",
        price: 700,
        discountPercent: 0.1,
        imageUrl: "/public/storefront/Vanilla_Coffee_Syrup.jpg",
        ratingAvg: 4.6,
        ratingTotal: 132
    },
    {
        name: "Caramel Coffee Syrup",
        brand: "Aroma House",
        category: "coffee-syrups",
        price: 750,
        discountPercent: 0.05,
        imageUrl: "/public/storefront/Caramel_Coffee_Syrup.jpg",
        ratingAvg: 4.8,
        ratingTotal: 158
    },
    {
        name: "Hazelnut Coffee Syrup",
        brand: "SweetBrew",
        category: "coffee-syrups",
        price: 800,
        discountPercent: 0.08,
        imageUrl: "/public/storefront/Hazelnut_Coffee_Syrup.jpg",
        ratingAvg: 4.5,
        ratingTotal: 104
    },

    // ==========================================
    // 12. Coffee Gift Sets and Merchandise
    // ==========================================
    {
        name: "Home Barista Starter Kit",
        brand: "BrewCraft",
        category: "coffee-gift-sets",
        price: 5500,
        discountPercent: 0.12,
        imageUrl: "/public/storefront/Home_Barista_Starter_Kit.jpg",
        ratingAvg: 4.9,
        ratingTotal: 87
    },
    {
        name: "Coffee Lover Gift Box",
        brand: "Nations",
        category: "coffee-gift-sets",
        price: 3200,
        discountPercent: 0.1,
        imageUrl: "/public/storefront/Coffee_Lover_Gift_Box.jpg",
        ratingAvg: 4.8,
        ratingTotal: 143
    },
    {
        name: "Barista Apron",
        brand: "BaristaWorks",
        category: "coffee-merchandise",
        price: 1800,
        discountPercent: 0.05,
        imageUrl: "/public/storefront/Barista_Apron.jpg",
        ratingAvg: 4.5,
        ratingTotal: 68
    },
    {
        name: "Coffee Art Notebook",
        brand: "CupCulture",
        category: "coffee-merchandise",
        price: 550,
        discountPercent: 0,
        imageUrl: "/public/storefront/Coffee_Art_Notebook.jpg",
        ratingAvg: 4.4,
        ratingTotal: 59
    }
];

export default products;