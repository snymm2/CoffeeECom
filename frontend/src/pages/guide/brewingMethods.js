export const brewingMethods = {
    pourOver: {
        slug: "pour-over", 
        title: "Pour Over", 
        eyebrow: "A little patience. A lot of clarity.",
        description: "Pour over brewing gives you control over how water moves through the coffee. It is a great way to explore the aroma and flavour differences between beans.",
        heroImage: "/guide/pour-over-hero.jpg", 
        heroAlt: "Pour over coffee being brewed",
        difficulty: "Beginner-friendly", 
        brewTime: "2:30–3:30 minutes",
        recipe: [["Coffee", "15 g"], ["Water", "250 ml"], ["Ratio", "1:16.7"], ["Grind", "Medium-fine"], ["Temperature", "92–96°C"], ["Brew time", "2:30–3:30"]],
        videoUrl: "", 
        posterUrl: "/storefront/brewing/pour-over-video-poster.jpg", 
        videoTitle: "How to make a pour over",
        steps: [
            ["Rinse the filter", "Place the filter in the dripper and rinse it with hot water. Discard the rinse water and warm your server or cup.", "pour-over-step-1.jpg"],
            ["Add the coffee", "Grind the beans to a medium-fine consistency, add them to the filter, and gently level the coffee bed.", "pour-over-step-2.jpg"],
            ["Bloom the coffee", "Pour roughly twice the coffee's weight in water, making sure all grounds are wet. Wait around 30–45 seconds.", "pour-over-step-3.jpg"],
            ["Pour in stages", "Continue pouring slowly and evenly in gentle circles. Avoid pouring directly onto the paper filter.", "pour-over-step-4.jpg"],
            ["Let it drain and enjoy", "Allow the water to finish draining. Swirl the brewed coffee gently before serving.", "pour-over-step-5.jpg"]
        ],
        roastGuidance: "Light and medium roasts are a good place to start when exploring distinct specialty-coffee flavours. Darker roasts can also work if you prefer deeper, roast-forward flavours.",
        grindGuidance: "Start around medium-fine. If the brew drains very quickly and tastes weak or sour, try a slightly finer grind. If it drains slowly and tastes harsh, try coarser.",
        recommendedRoasts: ["Light", "Medium"], 
        productHeading: "Coffee to explore with pour over",
        tips: ["Use a scale so your coffee and water measurements are repeatable.", "Pour gently and consistently rather than flooding the coffee bed.", "Change one variable at a time when adjusting your recipe."],
        troubleshooting: [["Too sour or sharp", "Try a slightly finer grind, hotter water, or a longer brew."], ["Too bitter or dry", "Try a coarser grind, slightly cooler water, or a shorter brew."], ["Weak or watery", "Use a little more coffee or reduce the water slightly."], ["Drawdown is very slow", "Try a coarser grind and avoid disturbing the coffee bed too much."]],
        relatedVideos: [
            ["Ultimate V60 Technique", "James Hoffmann", "A useful starting point for understanding a repeatable pour over technique.", "https://www.youtube.com/watch?v=AI4ynXzkSQo", "ultimate-v60-thumb.jpg"],
            ["V60 brewing techniques", "Coffee education", "Explore different pouring approaches and how they change the cup.", "https://www.youtube.com/results?search_query=V60+pour+over+technique", "youtube-v60.jpg"]
        ],
    },
    frenchPress: {
        slug: "french-press",
        title: "French Press",
        eyebrow: "Simple, full-bodied, and forgiving.",
        description: "French Press is an immersion method: coffee grounds steep in water before a metal filter separates the brewed coffee. It is approachable and needs very little equipment.",
        heroImage: "/storefront/brewing/french-press-hero.jpg",
        heroAlt: "French Press coffee maker",
        difficulty: "Easy",
        brewTime: "4–5 minutes",
        recipe: [["Coffee", "30 g"], ["Water", "500 ml"], ["Ratio", "1:16.7"], ["Grind", "Coarse"], ["Temperature", "92–96°C"], ["Steep time", "4 minutes"]],
        videoUrl: "",
        posterUrl: "/storefront/brewing/french-press-video-poster.jpg",
        videoTitle: "How to make French Press coffee",
        steps: [
            ["Preheat the press", "Rinse the French Press with hot water, then discard the water. This helps keep the brewing temperature more stable.", "french-press-step-1.jpg"],
            ["Add coarsely ground coffee", "Add coffee to the empty press. A coarse, even grind helps reduce sediment and makes plunging easier.", "french-press-step-2.jpg"],
            ["Add water and steep", "Pour in the water, wet all the grounds, place the lid on top with the plunger raised, and steep for about four minutes.", "french-press-step-3.jpg"],
            ["Break the crust", "Gently stir or break the floating crust, then skim excess foam if desired. Let the grounds settle briefly.", "french-press-step-4.jpg"],
            ["Press and serve", "Lower the plunger slowly and steadily. Pour the coffee into cups rather than leaving it in the press.", "french-press-step-5.jpg"]
        ],
        roastGuidance: "Medium roasts are a versatile starting point. Light roasts can bring out delicate flavours, while darker roasts can create a deeper, roast-forward cup.",
        grindGuidance: "Use a coarse grind as a starting point. If the coffee tastes thin, experiment with a slightly finer grind; if it is muddy or overly bitter, try coarser.",
        recommendedRoasts: ["Medium", "Dark"], 
        productHeading: "Coffee to explore with French Press",
        tips: ["Pour the coffee out after plunging so it does not keep extracting.", "Use a consistent steep time when comparing different beans.", "A gentle plunge helps avoid stirring up too much sediment."],
        troubleshooting: [["Too much sediment", "Try a coarser and more consistent grind, and press more gently."], ["Too bitter", "Try a coarser grind, a shorter steep, or slightly cooler water."], ["Too weak", "Use more coffee or check the water-to-coffee ratio."], ["Plunger is difficult to press", "The grind may be too fine, or too much coffee may be in the press."]],
        relatedVideos: [
            ["French Press technique", "James Hoffmann", "A useful demonstration of an alternative French Press technique.", "https://www.youtube.com/results?search_query=James+Hoffmann+French+Press+technique", "youtube-french-press.jpg"],
            ["French Press basics", "Coffee education", "A beginner-friendly walkthrough of ratios, grind, and steeping.", "https://www.youtube.com/results?search_query=French+Press+coffee+beginner+guide", "youtube-french-basics.jpg"]
        ],
    },
    mokaPot: {
        slug: "moka-pot", 
        title: "Moka Pot", 
        eyebrow: "Rich, concentrated coffee from the stovetop.",
        description: "The Moka Pot uses heated water and pressure from steam to push water through ground coffee. It produces a concentrated brew that works well on its own or with milk.",
        heroImage: "/storefront/brewing/moka-pot-hero.jpg", 
        heroAlt: "Moka Pot on a stovetop",
        difficulty: "Beginner-friendly with a little practice", 
        brewTime: "4–6 minutes",
        recipe: [["Coffee", "Fill basket loosely"], ["Water", "Just below safety valve"], ["Grind", "Medium-fine"], ["Heat", "Low to medium-low"], ["Brew time", "Until flow turns pale"]],
        videoUrl: "", 
        posterUrl: "/storefront/brewing/moka-pot-video-poster.jpg", 
        videoTitle: "How to use a Moka Pot",
        steps: [
            ["Add water to the base", "Fill the lower chamber with hot water to just below the safety valve. Do not cover the valve.", "moka-pot-step-1.jpg"],
            ["Fill the coffee basket", "Add medium-fine ground coffee and level it gently. Do not tamp the grounds down.", "moka-pot-step-2.jpg"],
            ["Assemble and heat", "Carefully assemble the pot and place it over low to medium-low heat. Keep the handle away from the flame.", "moka-pot-step-3.jpg"],
            ["Watch the flow", "Coffee will begin flowing into the upper chamber. Reduce heat if it flows aggressively or splutters early.", "moka-pot-step-4.jpg"],
            ["Stop and serve", "Remove the pot from heat when the stream turns pale and begins to sputter. Cool the base briefly and serve.", "moka-pot-step-5.jpg"]
        ],
        roastGuidance: "Medium and medium-dark roasts are common starting points. Lighter roasts can work too, but adjust grind and heat carefully.",
        grindGuidance: "Aim for medium-fine, usually a little coarser than espresso. Very fine coffee can restrict flow and make the brew harsh.",
        recommendedRoasts: ["Medium", "Medium-dark"],
        productHeading: "Coffee to explore with a Moka Pot",
        tips: ["Never fill water above the safety valve.", "Do not tamp the coffee basket.", "Use low to medium-low heat and remove the pot when the flow turns pale.", "Keep the handle away from the flame or heating element."],
        troubleshooting: [["Harsh or burnt taste", "Use lower heat and remove the pot from the stove earlier."], ["Coffee barely flows", "Check that the grind is not too fine and the basket is not overfilled or tamped."], ["Watery coffee", "Check the basket is filled correctly and that the seal and filter are clean."], ["Early sputtering", "Reduce heat and check that the base has enough water."]],
        relatedVideos: [
            ["Moka Pot coffee guide", "James Hoffmann", "A detailed look at getting a balanced cup from a stovetop brewer.", "https://www.youtube.com/results?search_query=James+Hoffmann+Moka+Pot+guide", "youtube-moka-pot.jpg"],
            ["Moka Pot basics", "Coffee education", "A beginner-friendly walkthrough of setup, heat, and grind size.", "https://www.youtube.com/results?search_query=Moka+Pot+beginner+brewing+guide", "youtube-moka-basics.jpg"]
        ]
    }
};

export const roastLevels = [
    { name: "Light Roast", subtitle: "Bright, delicate, and expressive", description: "Light roasts are generally roasted for less time than darker roasts. They can preserve more of the bean's origin character and may show floral, fruity, or citrus-like notes.", flavour: "Often floral, fruity, citrus-like, or tea-like", body: "Often lighter", acidity: "Often more noticeable", image: "/storefront/brewing/roast-light.jpg", methods: ["Pour Over", "French Press"] },
    { name: "Medium Roast", subtitle: "Balanced and versatile", description: "Medium roasts aim for a balance between origin character and flavours developed during roasting. They are a flexible starting point for many brewing methods.", flavour: "Can be sweet, nutty, chocolatey, or fruity", body: "Medium", acidity: "Often balanced", image: "/storefront/brewing/roast-medium.jpg", methods: ["Pour Over", "French Press", "Moka Pot"] },
    { name: "Dark Roast", subtitle: "Bold, deep, and roast-forward", description: "Dark roasts are developed further during roasting. They commonly show deeper roasted, bittersweet, smoky, or chocolate-like flavours.", flavour: "Often bittersweet, roasted, smoky, or chocolatey", body: "Often fuller", acidity: "Often less pronounced", image: "/storefront/brewing/roast-dark.jpg", methods: ["French Press", "Moka Pot"] }
];
  