console.log('#model order')
import crypto from 'crypto';

export default (mongoose) => {

    const FormSchema = new mongoose.Schema({
        description: String,
        title: String,
        button: {
            type: String,
            default: "ارسال",
        },
        createdAt: {type: Date, default: new Date()},
        updatedAt: {type: Date, default: new Date()},
        active: {type: Boolean, default: true},
        user: String, //_id of user,
        photos: [{
            name: String,
            url: String
        }],
        fields: [
            {
                id: Number,
                type: {type: String}, //radio, text, product, total, html, select, text, email, textarea
                label: String,
                isRequired: {type: Boolean, default: true},
                inputs: [],
                choices: [
                    {
                        text: String,
                        value: String,
                        isSelected: {type: Boolean, default: false},
                        price: String,
                        url: String,
                        type: {type: String} //image
                    }
                ],
                description: String,
                placeholder: String,
                cssClass: String,
                pageNumber:{type: Number, default: 1},
            }
        ],
        responses:[],
        view:{type: Number, default: 1},
    
    
    });

    return FormSchema;
};
