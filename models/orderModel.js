const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
    property: {
        type: Schema.ObjectId,
        ref: 'Property',
        required: [true, 'order must belong to a property']
    },
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: [true, "Order must belong to a user"]
    },
    status: {
        type: String,
        enum: ['pending', 'confirmd', 'rejected', 'completed', "cancelled"],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now()
    }
})

const Order = mongoose.model('order', orderSchema);

module.exports = Order;

