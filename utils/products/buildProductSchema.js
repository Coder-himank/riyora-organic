export default function buildProductSchema(product, site_url) {
  if (!product) return null;

  // Prepare absolute image URLs
  const absImages = (Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl])
    .filter(Boolean)
    .map(url => (url.startsWith("http") ? url : `${site_url}${url}`));

  // Build offers (supports main + variants for maximum SEO enhancement)
  const offers = [];

  // Main product offer
  offers.push({
    "@type": "Offer",
    url: `${site_url}/products/${product.slug}`,
    priceCurrency: product.currency || "INR",
    price: Number(product.price).toFixed(2),
    priceValidUntil: "2030-12-31",
    availability:
      product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    sku: product.sku || product.slug,
  });

  // Variant offers (if variants exist)
  if (Array.isArray(product.variants)) {
    product.variants.forEach((v) => {
      offers.push({
        "@type": "Offer",
        url: `${site_url}/products/${product.slug}?variant=${encodeURIComponent(v.name)}`,
        priceCurrency: v.currency || "INR",
        price: Number(v.price || product.price).toFixed(2),
        priceValidUntil: "2030-12-31",
        availability:
          v.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        sku: v.sku || `${product.sku}-${v.name}`,
      });
    });
  }

  // Build review schema
  const reviewSchema =
    product.reviews?.length > 0
      ? product.reviews.slice(0, 10).map((r) => ({
          "@type": "Review",
          author: {
            "@type": "Person",
            name: r.name || "Verified User",
          },
          datePublished: new Date(r.createdAt).toISOString(),
          reviewBody: r.comment,
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.rating,
            bestRating: "5",
            worstRating: "1",
          },
        }))
      : undefined;

  // Build main schema
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",

    // Main product data
    name: product.name,
    description: product.description,
    sku: product.sku || product.slug,
    mpn: product.sku || product.slug,
    brand: {
      "@type": "Brand",
      name: product.brand || "Riyora Organic",
      logo: `${site_url}/images/Riyora-Logo-Favicon.svg`,
    },
    image: absImages,
    category: product.category?.join(", "),

    // Additional product attributes (helps with "Shop" ranking)
    additionalProperty: [
      ...(product.details?.ingredients?.length
        ? product.details.ingredients.map((i) => ({
            "@type": "PropertyValue",
            name: "Ingredient",
            value: i,
          }))
        : []),

      ...(product.details?.benefits?.length
        ? product.details.benefits.map((b) => ({
            "@type": "PropertyValue",
            name: "Benefit",
            value: b,
          }))
        : []),

      product.quantity
        ? { "@type": "PropertyValue", name: "Quantity", value: product.quantity }
        : null,

      product.specifications?.weight
        ? {
            "@type": "PropertyValue",
            name: "Weight",
            value: product.specifications.weight,
          }
        : null,

      product.details?.itemVolume
        ? {
            "@type": "PropertyValue",
            name: "Volume",
            value: product.details.itemVolume,
          }
        : null,
    ].filter(Boolean),

    // Best: Use Aggregate Offers (supports variants)
    offers: {
      "@type": "AggregateOffer",
      lowPrice: Math.min(...offers.map((o) => Number(o.price))),
      highPrice: Math.max(...offers.map((o) => Number(o.price))),
      priceCurrency: "INR",
      offerCount: offers.length,
      offers: offers,
    },
  };

  // Add aggregateRating only if exists
  if (product.averageRating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(product.averageRating).toFixed(1),
      reviewCount: Number(product.numReviews || 0),
    };
  }

  // Add review array only if exists
  if (reviewSchema) {
    schema.review = reviewSchema;
  }

  return schema;
}
