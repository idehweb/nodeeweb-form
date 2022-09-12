console.log('#model product')
export default (mongoose)=>{
    
    const EntrySchema = new mongoose.Schema({
        mobile: Number,
        email: String,
        jobNumber: Number,
        trackingCode: Number,
        name: String,
        device: String,
        brand: String,
        model: String,
        claim: String,
        extra: String,
        dcode: String,
        form_id: String,
        description: String,
        createdAt: {type: Date, default: new Date()},
        updatedAt: {type: Date, default: new Date()},
        active: {type: Boolean, default: true},
        data:{},
        activities: [{
          user: String,
          status: String,
          userStatus: String,
          description: String,
          createdAt: {type: Date, default: new Date()},
        }],
      
      
      });

    return EntrySchema

};
