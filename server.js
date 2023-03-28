let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Methods",
		"GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
	);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin,X-Requested-With,Content-Type,Accept"
	);
	next();
});

const port = 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}`));

let carData = require("./carData.js");
let {cars,carMaster} = carData;
app.get("/cars",(req,res)=>{
	let {minPrice,maxPrice,fuel,type,sort} = req.query;
	console.log(req.query)
	let arr1 = {...carData};
	let arr2= arr1.cars;
	
	if(minPrice)  arr2= arr2.filter(c=>c.price>= +minPrice);
	if(maxPrice)  arr2= arr2.filter(c=>c.price<= +maxPrice);
	if(fuel) arr2 = arr2.filter(c=>carMaster.find(m=>m.model===c.model).fuel===fuel)
	if(type) arr2 = arr2.filter(c=>carMaster.find(m=>m.model===c.model).type===type)
	if(sort==="kms") arr2 = arr2.sort((a,b)=>a.kms-b.kms);
	if(sort==="price") arr2 = arr2.sort((a,b)=>a.price-b.price);
	if(sort==="year") arr2 = arr2.sort((a,b)=>a.year-b.year);
	arr1.cars= arr2
    res.send(arr1);
})

app.put("/cars/:id",(req,res)=>{
    let id = req.params.id;
    let index = cars.findIndex(c=>c.id===id);
	if(index>=0) {
		cars[index] = {id: id,...req.body}
		res.send(req.body);
	}
	else res.status(404).send("No car found");
   
})
app.post("/cars",(req,res)=>{
	cars.push(req.body);
	res.send(req.body)
})

app.delete("/car/delete/:id",(req,res)=>{
	let id = req.params.id;

    let index = cars.findIndex(c=>c.id===id);
	if(index>=0) {
		let deletedCar = cars[index];
		cars.splice(index,1);
		res.send(deletedCar);
	}
	else res.status(404).send("No car found");
})