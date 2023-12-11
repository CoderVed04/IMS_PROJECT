const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Please Enter a valid name'
    },
    state: {
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
    created_on: {
        type: String
    },
    image: {
        data: Buffer,
        contentType: String
    },
    imagePath: {
        type: String
    }
});

const Material = mongoose.model('Material', materialSchema);
module.exports = Material;

module.exports = {
    addMaterial: function(data) {
        return new Promise((resolve, reject) => {
            Material.create(data)
                .then((material) => {
                    resolve(material);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    getMaterials: function() {
        return Material.find({}).exec();
    },
    updateMaterial: function(id, materialData) {
        return new Promise((resolve, reject) => {
            const query = { _id: id };
            const update = {
                qty: materialData.qty,
                state: materialData.state,
                price: materialData.price,
                name: materialData.name,
                created_on: materialData.created_on,
                imagePath: materialData.imagePath,
                
            };
            Material.findOneAndUpdate(query, update)
                .then((updatedMaterial) => {
                    if (updatedMaterial) {
                        resolve(updatedMaterial);
                    } else {
                        reject(new Error('Material not found'));
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    
    // removeMaterial: function(id) {
    //     return new Promise((resolve /*reject*/) => {
    //         const query = { _id: id };
    //         Material.deleteOne(query, (err) => {
    //             if (err) {
    //                 // reject(err);
    //                 console.log("Error occured!");
    //             } else {
    //                 resolve();
    //             }
    //         });
    //     });
    // },

    removeMaterial: function(id) {
        return Material.deleteOne({ _id: id }).then(() => {
          console.log('Material deleted successfully');
        }).catch((err) => {
          console.error(err);
          throw err;
        });
      },

    // findById: function (id) {
    //     return Material.findOne({ _id: id }).exec();
    // } 

    findById: async function (id) {
        try {
          console.log("Inside findById try block");
          const material = await Material.findOne({ _id: id }).exec();
          return material;
        } catch (err) {
          console.log("Inside findById catch block");
          console.error(err);
          throw err;
        }
      }
};