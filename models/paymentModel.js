const mongoose = require("mongoose");

const { Schema } = mongoose;


const paymentSchema = new Schema({
    tx_ref: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'NGN'
    },
    redirect_url: {
        type: String,
        required: true
    },
    customer: {
        type: Schema.ObjectId,
        required: true
    },
    session_duration: {
        type: Number,
        default: 160
    },
    
})