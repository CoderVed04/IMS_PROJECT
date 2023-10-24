/* <td><%= object.name %></td>
    <td><%= object.material %></td>
    <td>$&nbsp;<%= object.price %></td>
    <td><%= object.qty %></td>
    <td><%= object.status</td>
    <td><%= object.created_on %></td> */
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Please Enter a valid name'
    },
    material: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    created_on: {
        type: String
    }
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

module.exports = {
    addOrder: function(data) {
        return new Promise((resolve, reject) => {
            Order.create(data)
            .then((order) => {
                resolve(order);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },

    getOrders: function(){
        return Order.find({}).exec();
    },

    updateOrder: function(id, orderData) {
        return new Promise((resolve, reject) => {
            const query = { _id:id };
            const update ={
                name: orderData.name,
                material: orderData.material,
                price: orderData.price,
                qty: orderData.qty,
                status: orderData.status,
                created_on: orderData.created_on
            };
            Order.findOneAndUpdate(query, update)
            .then((updatedOrder) => {
             if(updatedOrder) {
                resolve(updatedOrder);
             } else {
                reject(new Error('Order not found'));
             }
            })
            .catch((err) => {
                reject(err);
    
            });
        });
    },

    removeOrder: function(id) {
        return Order.deleteOne({ _id:id }).then(()=> {
            console.log("Order deleted successfully");
        }).catch((err) => {
            console.error(err);
            throw err;
        });
    },

    findById: async function (id) {
        try {
            console.log("Inside findById try block");
            const order = await Order.findOne({ _id:id }).exec();
            return order;
        } catch (err) {
            console.log("Inside findById catch block");
            console.error(err);
            throw err;
        }
    }
    
};

