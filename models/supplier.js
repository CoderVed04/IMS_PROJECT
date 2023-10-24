const mongoose =require('mongoose');

var supplierSchema = new mongoose.Schema({
     cmpname:{
        type:String,
        required:true
    },
    materialname:{
        type:String,
        required:true
    },
    emailid:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    contactno:{
        type:Number,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    qty:{
        type:Number,
        required:true
    },
    costprice:{
        type:Number,
        required:true
    },
    created_on:{
        type:String
    }
});

var Suppliers = mongoose.model('Suppliers' , supplierSchema);
module.exports = Suppliers;

module.exports={
getSuppliers: function() {
    return new Promise((resolve, reject) => {
        Suppliers.find({})
            .then((suppliers) => {
                resolve(suppliers);
            })
            .catch((err) => {
                reject(err);
            });
    });
},

// getSuppliersById: function(id, callback){
//     Suppliers.findById(id,callback);
// },
getSuppliersById: async function(id) {
    try {
      console.log("Inside getSupplierById try block");
      const supplier = await Suppliers.findOne({_id:id}).exec();
      return supplier;
    } catch (err) {
      console.log("Inside getSupplierById catch block");
      console.error(err);
      throw err;
    }
  },

addSupplier: function(supplier) {
    return new Promise((resolve, reject) => {
        Suppliers.create(supplier)
            .then((supplier) => {
                resolve(supplier);
            })
            .catch((err) => {
                reject(err);
            });
    });
},

 
updateSupplier: function(id, supplier) {
    return new Promise ((resolve, reject)=>{const query = { _id: id };
    const update = {
        cmpname: supplier.cmpname,
        qty: supplier.qty,
        state: supplier.state,
        materialname: supplier.materialname,
        emailid: supplier.emailid,
        costprice: supplier.costprice,
        contactno: supplier.contactno,
        address: supplier.address,
    };

    Suppliers.findOneAndUpdate(query, update).then((updatedSupplier)=>
    {
        if(updatedSupplier){
            resolve(updatedSupplier);
        }
        else{
            reject(new Error ('Supplier not found'));
        }
    })
    .catch((err)=> {
        reject(err);
    });
});
},


// removeSupplier: function(id ,callback) {
//     var query = {_id :id};
//     Suppliers.deleteOne(query ,callback);
// }

// removeSupplier: async function(id) {
//     try {
//       const query = { _id: id };
//       await Suppliers.deleteOne(query);
//       console.log("Supplier deleted successfully");
//     } catch (err) {
//       throw err;
//     }
//   },

removeSupplier: function(id){
    return Suppliers.deleteOne({_id:id})
    .then(() => {
        console.log("Supplier deleted successfully");
    }).catch((err) => {
        console.error(err);
        throw err;
    });
}
        
}
