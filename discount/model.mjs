console.log('#model discount')
export default (mongoose)=>{
    const DiscountSchema = new mongoose.Schema({
        name: {},
        slug: {
            type: String,
            required: false,
            trim: true
        },
        price: Number,
        percent: Number,
        count: Number,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    });
    return DiscountSchema;
};
