const herbalData = {
    montmorillonite: {
        name: "Multani Mitti",
        description: "A mineral-rich clay used for skincare and haircare, known for its oil-absorbing and detoxifying properties.",
        scientificName: "Montmorillonite",
        otherNames: ["Fuller's Earth", "Indian Healing Clay"],
        benefits: {
            hair: "Cleanses scalp, reduces dandruff, removes excess oil.",
            skin: "Controls acne, brightens complexion, removes impurities.",
            health: "Used in body wraps to detoxify and improve blood circulation."
        },
        howToUse: {
            hair: "Mix with water or aloe vera, apply to scalp, leave for 20 min, and rinse.",
            skin: "Mix with rose water or milk, apply as a face mask, leave for 15 min, then rinse.",
            health: "Can be used in clay wraps for detoxification."
        },
        ingredientsToUseWith: ["Rose Water", "Aloe Vera", "Honey", "Neem Powder"],
        notes: ["Avoid using on very dry skin.", "Use once or twice a week for best results."]
    },
    phyllanthusEmblica: {
        name: "Amla",
        description: "A nutrient-rich fruit known for its high vitamin C content and rejuvenating properties.",
        scientificName: "Phyllanthus emblica",
        otherNames: ["Indian Gooseberry"],
        benefits: {
            hair: "Strengthens hair roots, reduces dandruff, prevents premature greying.",
            skin: "Brightens complexion, boosts collagen production, fights pigmentation.",
            health: "Enhances immunity, aids digestion, and promotes overall well-being."
        },
        howToUse: {
            hair: "Mix amla powder with water or coconut oil, apply to scalp and hair.",
            skin: "Use amla juice as a toner or mix powder in face masks.",
            health: "Consume raw, as juice, or in powder form with warm water."
        },
        ingredientsToUseWith: ["Shikakai", "Bhringraj", "Honey", "Turmeric"],
        notes: ["Avoid excessive consumption as it may cause acidity."]
    },
    indigoferaTinctoria: {
        name: "Indigo",
        description: "A natural dye used for hair coloring and strengthening.",
        scientificName: "Indigofera tinctoria",
        otherNames: ["True Indigo"],
        benefits: {
            hair: "Provides natural black/blue dye, promotes hair growth, reduces scalp infections.",
            skin: "Used in herbal medicine for its anti-inflammatory properties.",
            health: "Traditionally used for wound healing and skin conditions."
        },
        howToUse: {
            hair: "Mix with henna for natural black hair dye.",
            skin: "Used in medicinal formulations for treating skin disorders.",
            health: "Can be used externally for its healing properties."
        },
        ingredientsToUseWith: ["Henna", "Coconut Oil", "Amla"],
        notes: ["Patch test before applying to hair to check for allergies."]
    },
    azadirachtaIndica: {
        name: "Neem",
        description: "A powerful antibacterial and antifungal herb used for skin, hair, and health.",
        scientificName: "Azadirachta indica",
        otherNames: ["Indian Lilac"],
        benefits: {
            hair: "Treats dandruff, strengthens roots, prevents lice.",
            skin: "Clears acne, reduces pigmentation, fights bacterial infections.",
            health: "Boosts immunity, purifies blood, aids digestion."
        },
        howToUse: {
            hair: "Use neem oil or neem powder paste for scalp health.",
            skin: "Apply neem paste or neem water as a toner.",
            health: "Drink neem tea or use in herbal formulations."
        },
        ingredientsToUseWith: ["Tulsi", "Turmeric", "Aloe Vera"],
        notes: ["Neem oil is very strong, dilute before use."]
    },
    acaciaConcinna: {
        name: "Shikakai",
        description: "A natural hair cleanser known for strengthening and conditioning hair.",
        scientificName: "Acacia concinna",
        otherNames: ["Hair Fruit"],
        benefits: {
            hair: "Gently cleanses, strengthens roots, promotes hair growth.",
            skin: "Used in herbal scrubs for exfoliation.",
            health: "Traditionally used for treating skin infections."
        },
        howToUse: {
            hair: "Make a paste with water, apply as a shampoo.",
            skin: "Use in face masks for cleansing.",
            health: "Can be used in Ayurvedic remedies."
        },
        ingredientsToUseWith: ["Amla", "Reetha", "Bhringraj"],
        notes: ["Avoid contact with eyes as it can cause irritation."]
    },
    lawsoniaInermis: {
        name: "Henna",
        description: "A natural dye used for hair and skin conditioning.",
        scientificName: "Lawsonia inermis",
        otherNames: ["Mehendi"],
        benefits: {
            hair: "Conditions hair, strengthens roots, adds shine.",
            skin: "Used for body art and cooling effects.",
            health: "Has antifungal and antimicrobial properties."
        },
        howToUse: {
            hair: "Mix with water and apply as a hair mask.",
            skin: "Apply paste for temporary tattoos or cooling effects.",
            health: "Used in traditional medicine for wound healing."
        },
        ingredientsToUseWith: ["Indigo", "Amla", "Shikakai"],
        notes: ["Test on a small area before use to check for allergies."]
    },
    ecliptaProstrata: {
        name: "Bhringraj",
        description: "A medicinal herb known for hair nourishment and scalp health.",
        scientificName: "Eclipta prostrata",
        otherNames: ["False Daisy"],
        benefits: {
            hair: "Promotes hair growth, prevents greying, reduces dandruff.",
            skin: "Soothes inflammation and supports skin regeneration.",
            health: "Improves liver function, supports digestion."
        },
        howToUse: {
            hair: "Use as oil or paste for scalp massage.",
            skin: "Use in herbal pastes for skin healing.",
            health: "Consume as an herbal supplement."
        },
        ingredientsToUseWith: ["Amla", "Shikakai", "Neem"],
        notes: ["Perform a patch test before use."]
    },
    soapnut: {
        name: "Reetha",
        description: "A natural soap with excellent cleansing properties.",
        scientificName: "Sapindus",
        otherNames: ["Soapnut"],
        benefits: {
            hair: "Cleanses scalp, adds shine, removes excess oil.",
            skin: "Natural cleanser, helps with acne.",
            health: "Used as an eco-friendly soap alternative."
        },
        howToUse: {
            hair: "Boil and use liquid as a shampoo.",
            skin: "Use as a natural face wash.",
            health: "Use for cleansing household items."
        },
        ingredientsToUseWith: ["Shikakai", "Amla"],
        notes: ["Avoid contact with eyes as it can be irritating."]
    }
};



function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(400).json({ message: "Bad Request" });
    }
    return res.status(200).json(herbalData);
}

export default handler;
