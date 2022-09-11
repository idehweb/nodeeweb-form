console.log('#model product')
export default (mongoose)=>{
    const ProductSchema = new mongoose.Schema({
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        active: { type: Boolean, default: true },
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory" }],
        sources: [],
        labels: [],
        in_stock: { type: Boolean, default: false },
        story: { type: Boolean, default: false },
        price: Number,
        quantity: Number,
        salePrice: Number,
        data: {},
        sku: String,
        miniTitle: {},
        excerpt: {},
        options: [],
        extra_attr: [],
        combinations: [],
        sections: [],
        countries: [],
        like: [{
            customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer"},
            userIp: String,
            createdAt: { type: Date, default: Date.now }
        }],
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        type: { type: String, default: "normal" },
        description: {},
        views: [],
        addToCard: [],
        title: {},
        metadescription: {},
        keywords: {},
        slug: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        thumbnail: String,
        status: { type: String, default: "processing" },
        transaction: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
        relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        photos: [],
        postNumber: String
    });
    return ProductSchema

};
