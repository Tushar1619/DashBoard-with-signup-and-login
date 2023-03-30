import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import CryptoJS from 'crypto-js'

dotenv.config()
const app = express();
app.use(express.json())
app.use(cors())

let port = 3000 || process.env.PORT;


const productSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    currencyCode: String,
    itemsSold: Number,
    rating: Number,
    freeShipping: Boolean
});

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});

const productModel = mongoose.model('products', productSchema);
const userModel = mongoose.model('usersData', userSchema);
// app.get('/product',(req,res)=>{
//     res.send("Hello")
// })
app.post('/product', async (req, res) => {
    let body = req.body;

    if (!body.productName || !body.price || !body.currencyCode || !body.itemsSold || !body.rating || !body.freeShipping) {
        res.status(400).send({
            message: `All fields are not filled
               Example : 
               productName,
               price,
               currencyCode,
               itemsSold,
               rating,
               freeShipping`
        })
        return;
    }
    let product = {
        productName: body.productName,
        price: body.price,
        currencyCode: body.currencyCode,
        itemsSold: body.itemsSold,
        rating: body.rating,
        freeShipping: body.freeShipping
    }
    productModel.create(product)
        .then((response) => {
            console.log(response);
            res.send("Product created")
        })

    // response();
})

app.post('/product', async (req, res) => {
    let body = req.body;

    if (!body.productName || !body.price || !body.currencyCode || !body.itemsSold || !body.rating || !body.freeShipping) {
        res.status(400).send({
            message: `All fields are not filled
               Example : 
               productName,
               price,
               currencyCode,
               itemsSold,
               rating,
               freeShipping`
        })
        return;
    }
    let product = {
        productName: body.productName,
        price: body.price,
        currencyCode: body.currencyCode,
        itemsSold: body.itemsSold,
        rating: body.rating,
        freeShipping: body.freeShipping
    }
    productModel.create(product)
        .then((response) => {
            console.log(response);
            res.send("Product created")
        })

    // response();
})

app.post('/product/:id', async (req, res) => {
    let body = req.body;
    let _id = req.params.id;
    console.log(_id);
    let updated_product = {
        productName: body.eproductName,
        price: body.eprice,
        currencyCode: body.ecurrencyCode,
        itemsSold: body.eitemsSold,
        rating: body.erating,
        freeShipping: body.efreeShipping
    }
    try{
        let result = await productModel.findByIdAndUpdate(_id, updated_product)
        if(result){
            res.send(result);
            console.log("Success line 117");
        }
        else{
            res.send("cannot update")
            console.log("cannot update line 121");
        }
    }
    catch(err){
        res.send("db error");
        console.log("db error line 119");
    }
    
    // response();
})


app.get('/products', async (req, res) => {

    let result = await productModel
        .find({})
        .exec()
        .catch(e => {
            console.log("error in db: ", e);
            res.status(500).send("error in getting all products" );
            return
        })

    res.send(result);
})
// 642325ef7ef8f599ea60ff25
app.delete('/product/:id', async (req,res)=>{

    let _id = req.params.id;
    console.log(_id);
    try{
        let result = await productModel.findByIdAndDelete(_id);
        // console.log(result);
        res.send("User  deleted")
    }
    catch(err){
        res.send("catch err")
        console.log("catch err"+err);
    }
    

})





app.post("/signup", async (req, res) => {

    let body = req.body;

    if (!body.firstName || !body.lastName || !body.email || !body.password) {
        res.status(400).send(`required fields missing,example request:{
         firstName:Tushar,
         lastName:Rai,
         email:abc@gmail.com,
         password:12345
     }`)
        return;
    }


    let encpass = CryptoJS.AES.encrypt(body.password, process.env.SECRET_KEY).toString();
    let newUser = {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email.toLowerCase(),
        password: encpass

    }
    // U2FsdGVkX184atRtMVKoBt3B/YYZfGi7FIqawWdS+n4= 
    

    // const findOne = async () => {

    const data = await userModel.findOne({ email: body.email });
    console.log(data);
    try {
        if (data !== null) {
            console.log("Data is already present");
            res.send({ message: "User exists please login" })
        }
        else {
            userModel.create(newUser)
                .then((res) => {
                    console.log(res + "ding dong");
                })

            res.send({ message: "User created" })

        }
    }
    catch (err) {
        res.send("Error")
        console.log("err: " + err);
    }
})


app.post("/login", async (req, res) => {
    let body = req.body;
    if (!body.email || !body.password) { // null check - undefined, "", 0 , false, null , NaN
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }
    const data = await userModel.findOne({ email: body.email });
    
    try {
        if (data) {
            var decpass = CryptoJS.AES.decrypt(data.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
            if (decpass!= body.password) {
                res.send({ message: 0})
                return;
            }
            console.log("Data is already present");
            res.send({ message: 1 })
        }
        else {
            console.log("No user exists");
            res.send({ message: 2})
        }
    }
    catch (err) {
        console.log(err);
    }
})





















// mongo connection 

// mongodb+srv://verselon2000:<password>@cluster0.6j4igyn.mongodb.net/?retryWrites=true&w=majority
let dbURI = process.env.DATABASE_URI;
mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
    console.log("mongoose is connected");
});

mongoose.connection.on('disconnected', () => {
    console.log("mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', (err) => {
    console.log(err);
    process.exit(1);
});

//   SIGINT  it means agar koi ctrl se close kr raha hai server ko to mongoose ko bhi close krdo
process.on('SIGINT', () => {
    console.log("App is terminating");
    mongoose.connection.close(() => {
        console.log("Mongoose default connection closed");
        process.exit(0);
    })
})






app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})