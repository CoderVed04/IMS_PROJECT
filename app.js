const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const {
  registerUser,
  loginUser
} = require("../IMS/models/user");


app.set('view engine', 'ejs');
app.use(bodyparser.json());//parsing the application/json
app.use(bodyparser.urlencoded({ extended: true }));//parses the x-www-form-urlencoded

Material = require('./models/material');
Suppliers = require('./models/supplier');
Order = require('./models/order');
User = require('./models/user');

mongoose.connect('mongodb://127.0.0.1:27017/inventory', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

function today(){
    var date = new Date();
    var todaydate = date.toDateString();
    var minutes = date.getUTCMinutes();
    var hours = date.getHours();
    var seconds = date.getSeconds();
    var format = hours+':'+minutes+':'+seconds+' '+todaydate;
    return format ;
};
// function sanitizer(string){
//     string = entities.encode(string);
//     return string;
// }
//getting to the index
app.get('/index',(req ,res)=>{
    res.render('index');
});
//getting addmaterial page
app.get('/addmaterial' , (req ,res)=>{
    res.render('addmaterial');
});
//getting editmaterial page
app.get('/editmaterial/:id',(req, res)=>{
    var id = req.params.id;
    res.render('editmaterial',{ id:id });
});

//getting materials
app.get('/materials', (req, res) => {
    Material.getMaterials()
        .then((materials) => {
            res.render('material', { obj: materials }); // Ensure you pass materials to the view
        })
        .catch((err) => {
            console.error('Error getting materials:', err);
            res.render('material', { obj: [] }); // Pass an empty array if there's an error or no materials
        });
});

// app.get('/showmaterials/:id', (req, res) => {
//     var id = req.params.id;
//     console.log("inside showmaterials");
//     Material.findById(id, (err, material) => {
//         if (err) {
//             // Handle the error, e.g., by rendering an error page or redirecting
//             console.log("Internal Server error");
//             res.status(500).send('Internal Server Error');
//         } else if (!material){
//             res.status(404).send("Material not found")
//         }
//         else {
//             console.log("inside showmaterials route")
//             res.render('showmaterials', { material });
//         }
//     });
// });


  
  
// add the materials
app.post('/addmaterial',async (req, res)=>{
    var name = req.body.name;
    var price = req.body.price;
    var state = req.body.state;
    var qty = req.body.qty;
    var on = today();
    try {
        const material = await Material.addMaterial({
          name: name,
          price: price,
          qty: qty,
          state: state,
          created_on: on,
        });
    
        res.redirect('/materials');
      } catch (err) {
        console.error('Error adding material:', err);
        res.render('addmaterial', {
          msg: 'Please fill required details!',
        });
      }
});
// update the material data
app.post('/editmaterial/:id',(req ,res)=>{
    var  id = req.params.id;
    var name = req.body.name;
    var price = req.body.price;
    var qty = req.body.qty;
    var state = req.body.state;
    //for creating date
    var on = today();
    Material.updateMaterial(id , {
        name:name,price:price,qty:qty,state:state,created_on:on
    },{}, (err , callback)=>{
        if(err){
            res.render('editmaterial', {msg:"Error Occured."});
        }
        // res.render('editmaterial' ,{ id:id ,msg:"Successfully updated!!"} );
        res.redirect('/materials');
    });
 });
//delete the data of materials
app.post('/deletematerial/:_id',(req , res)=>{
    var id = req.params._id;
    Material.removeMaterial(id , (err ,callback)=>{
        if(err){throw err}
        res.redirect('/materials');
        } );
});
// app.post('/showmaterials/:_id',(req ,res)=>{
//     var id = req.params.id;
//     console.log("Inside showmaterials");
//     Material.findById(id , (err , material)=>{
//         if(err){throw err;}
//         res.redirect('showmaterials', {obj:material});
//     });
// });

// app.post('/showmaterials/:_id', (req, res) => {
//     var id = req.params._id;
//     Material.findById(id, (err, material) => {
//       if (err) {
//         console.log("Error retrieving material")
//         console.error(err);
//         res.status(500).send('Error retrieving material');
//       } else if (!material) {
//         console.log("Material not found");
//         res.status(404).send('Material not found');
//       } else {
//         console.log("Inside showmaterials");
//         res.render('showmaterials', { obj: material });
//       }
//     });
//   });

app.post('/showmaterials/:_id', async (req, res) => {
    try {
      const id = req.params._id;
      const material = await Material.findById(id);
      if (!material) {
        console.log("Material not found");
        res.status(404).send('Material not found');
      } else {
        console.log("Inside showmaterials");
        res.render('showmaterials', { obj: material });
      }
    } catch (err) {
      console.log("Error retrieving material")
      console.error(err);
      res.status(500).send('Error retrieving material');
    }
  });

//--------------------------------------------------

app.get('/addsupplier',(req,res)=>{
    res.render('addsupplier');
});
app.get('/editsupplier/:id',(req,res)=>{
    var id = req.params.id;
    res.render('editsupplier', {id:id});
});
// finds the suppliers
// app.get('/suppliers', (req, res) => {
//     Suppliers.getSuppliers((err, suppliers) => {
//         if (err) {
//             console.error('Error getting suppliers:', err);
//             res.render('supplier', { obj: suppliers }); // Handle the error by rendering an empty page or an error message
//         } else {
//             var obj = suppliers;
//             res.render('supplier', { obj: [] });
//         }
//     });
// });

app.get('/suppliers', (req, res) => {
    Suppliers.getSuppliers()
        .then((suppliers) => {
            res.render('supplier', { obj: suppliers }); // Ensure you pass materials to the view
        })
        .catch((err) => {
            console.error('Error getting suppliers:', err);
            res.render('supplier', { obj: [] }); // Pass an empty array if there's an error or no materials
        });
});

app.post('/addsupplier', async (req, res) => {
    var cmpname = req.body.cmpname;
    var materialname = req.body.materialname;
    var state = req.body.state;
    var emailid = req.body.emailid;
    var contactno = req.body.contactno;
    var address = req.body.address;
    var costprice = req.body.costprice;
    var qty = req.body.qty;
    var on = today();

    var supplier = {
        cmpname: cmpname,
        materialname: materialname,
        state: state,
        emailid: emailid,
        contactno: contactno,
        address: address,
        costprice: costprice,
        qty: qty,
        created_on: on
    };

    try {
        const addedSupplier = await Suppliers.addSupplier(supplier);
        res.redirect('/suppliers');
    } catch (err) {
        console.error('Error adding supplier:', err);
        res.render('addsupplier', {
            msg: 'Please fill required details!',
        });
    }
});

// update the supplier data

// app.get('/showsupplier/:id',(req , res)=>{
//     var id = req.params.id;
//     Suppliers.getSuppliersById(id , (err , supplier)=>{
//         if(err){throw err}
//         var obj = supplier;
//         res.render('showsupplier', {obj:obj});
//     });
// });

app.get('/showsupplier/:_id', async (req, res) => {
    try {
      const id = req.params._id;
      const supplier = await Suppliers.getSuppliersById(id);
      if (!supplier) {
        console.log("Supplier not found");
        res.status(404).send('Supplier not found');
      } else {
        console.log("Inside showsupplier");
        res.render('showsupplier', { obj: supplier });
      }
    } catch (err) {
      console.log("Error retrieving supplier")
      console.error(err);
      res.status(500).send('Error retrieving supplier');
    }
  });

app.post('/editsupplier/:_id',(req ,res)=>{
    var id = req.params._id;
    var cmpname = req.body.cmpname;
    var materialname = req.body.materialname;
    var state = req.body.state;
    var emailid = req.body.emailid;
    var contactno = req.body.contactno;
    var address = req.body.address;
    var costprice = req.body.costprice;
    var qty = req.body.qty;
    var on = today();
    // var supplier = {cmpname:cmpname, materialname:materialname, state:state, emailid:emailid, contactno:contactno, address:address, costprice:costprice, qty:qty ,created_on:on };
    Suppliers.updateSupplier(id , {cmpname:cmpname, materialname:materialname, state:state, emailid:emailid, contactno:contactno, address:address, costprice:costprice, qty:qty ,created_on:on } ,{},(err , callback)=>{
        if(err){
            throw err
        }
        res.redirect('/suppliers');
    });
} );

//delete the data from supplier ...
app.post('/deletesupplier/:_id',(req,res)=>{
    var id = req.params._id;
    Suppliers.removeSupplier(id, (err , callback)=>{
        if(err){throw err}
        res.redirect('/suppliers');
    });
});

//--------------------------------------------------

//getting addorder page
app.get('/addorder' , (req ,res)=>{
    res.render('addorder');
});

// add the materials
app.post('/addorder',async (req, res)=>{
    var name = req.body.name;
    var material = req.body.material;
    var price = req.body.price;
    var status = req.body.status;
    var qty = req.body.qty;
    var on = today();
    try {
        const order = await Order.addOrder({
          name: name,
          material: material,
          price: price,
          qty: qty,
          status: status,
          created_on: on,
        });
    
        res.redirect('/orders');
      } catch (err) {
        console.error('Error adding order:', err);
        res.render('addorder', {
          msg: 'Please fill required details!',
        });
      }
});

//getting orders
app.get('/orders', (req, res) => {
    Order.getOrders()
        .then((orders) => {
            res.render('order', { obj: orders }); // Ensure you pass orders to the view
        })
        .catch((err) => {
            console.error('Error getting orders:', err);
            res.render('order', { obj: [] }); // Pass an empty array if there's an error or no materials
        });
});

//getting editmaterial page
app.get('/editorder/:id',(req, res)=>{
    var id = req.params.id;
    res.render('editorder',{ id:id });
});

// update the order data
app.post('/editorder/:id',(req ,res)=>{
    var  id = req.params.id;
    var name = req.body.name;
    var material = req.body.material;
    var price = req.body.price;
    var qty = req.body.qty;
    var status = req.body.status;
    //for creating date
    var on = today();
    Order.updateOrder(id , {
        name:name,material:material,price:price,qty:qty,status:status,created_on:on
    },{}, (err , callback)=>{
        if(err){
            res.render('editorder', {msg:"Error Occured."});
        }
        res.redirect('/orders');
    });
 });

 //show order
app.post('/showorder/:_id', async (req, res) => {
    try {
      const id = req.params._id;
      const order = await Order.findById(id);
      if (!order) {
        console.log("Order not found");
        res.status(404).send('Order not found');
      } else {
        console.log("Inside showorder");
        res.render('showorder', { obj: order });
      }
    } catch (err) {
      console.log("Error retrieving order")
      console.error(err);
      res.status(500).send('Error retrieving order');
    }
  });

//delete the data of order
app.post('/deleteorder/:_id',(req , res)=>{
    var id = req.params._id;
    Order.removeOrder(id , (err ,callback)=>{
        if(err){throw err}
        res.redirect('/orders');
        } );
});

//-------------------------------------------------------------------

app.get('/register' , (req ,res)=>{
  res.render('register');
});

app.post('/register', registerUser,(req, res) =>{
  console.log("Inside post method of /register route");
  if(err){throw err}
  res.redirect('/register')
});

app.get('/login',(req, res) => {
  res.render('login');
});

app.post('/login', loginUser,(req, res) =>{
  console.log("Inside post method of /login route");
  if(err){throw err}
  res.redirect('/login')
});
//-------------------------------------------------------------------

app.listen(8080, ()=>{
    console.log('running in port 8080..');
});