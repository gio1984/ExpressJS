// imports
const express = require('express')
const bcrypt = require('bcryptjs')
const app = express()
const bodyParser = require('body-parser')
//const port = 3000
const port = (process.env.PORT || 80)
const users = require('./service/users')
const Ajv = require('ajv').default;
const { request } = require('chai')
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const items = require('./service/items')
const itemSchema = require('./schemas/itemSchema.json')
const userSchema = require('./schemas/userSchema.json')
app.use(express.json());

app.set('port', (process.env.PORT || 80));

app.get('/', (req, res) => {
  res.send('Hello World!')
})
// Login failed endpoint
app.get('/failed', (req, res) => {
  res.status(401).send('Failed login')
})
// Login successed endpoint
app.get('/logged', (req, res) => {
  res.send('Logged in')
})

// Basic Authentication
passport.use(new BasicStrategy(
  function(username, password, done) {

    const user = users.getUserByName(username);
    if(user == undefined) {
      // Username not found
      console.log("HTTP Basic username not found");
      return done(null, false, { message: "HTTP Basic username not found" });
    }

    /* Verify password match */
    if(bcrypt.compareSync(password, user.password) == false) {
      // Password does not match
      console.log("HTTP Basic password not matching username");
      return done(null, false, { message: "HTTP Basic password not found" });
    }
    return done(null, user);
  }
));

app.post('/auth', passport.authenticate('basic', {
  session: false,
  successRedirect: '/logged',
  failureRedirect: '/failed'
}), (req, res) => {
  res.send("Authenticated!");
});

app.post('/newuser', (req, res) => {
    if('username' in req.body == false) {
      res.status(406);
      res.json({status: "Missing username from body"});
      return;
    }
    if('password' in req.body == false){
      res.status(406);
      res.json({status: "Missing password from body"});
      return;
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 6);
    console.log(hashedPassword);
    users.addUser(req.body.username, req.body.email, hashedPassword);

    res.status(201).json({status: "created"});
});

app.get('/items', (req, res) => {
  if(req.query.location){
    listRes = items.getLocationItems(req.query.location);
    res.json(listRes);
  }
  else if(req.query.category){
    listRes = items.getCategoryItems(req.query.category);
    res.json(listRes);
  }
  else if(req.query.date){
    listRes = items.getDateItems(req.query.date);
    res.json(listRes);
  }
  else{
    res.status(400).json({status: "Wrong request"})
  }
})

app.post('/items', passport.authenticate('basic', {session: false}), (req, res) => {
  const ajv = new Ajv();
  const validate = ajv.compile(itemSchema);
  const valid = validate(req.body)
  if(valid){
    items.insertItems(req.body.title, req.body.description, req.body.category, req.body.location,
      req.body.images, req.body.price, req.body.datePosting, req.body.deliveryType)
    res.status(201).json({status: "Created"})
  }
  else {
    res.status(400).json({status: "Bad request"});
  }
  
});

app.patch('/items/:itemid', passport.authenticate('basic', {session: false}), (req, res) => {
  const ajv = new Ajv();
  const validate = ajv.compile(itemSchema);
  const valid = validate(req.body)
  if(valid){
    items.modifyItem(req.params["itemid"],req.body.title, req.body.description, req.body.category, req.body.location,
      req.body.images, req.body.price, req.body.datePosting, req.body.deliveryType)
    res.status(202).json({status: "Modified!"})
  }
  else {
    res.status(400).json({status: "Bad request"});
  }
  
});

let serverInstance = null;

module.exports = {
  start: () => {
    serverInstance = app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  },
  close: () => {
    serverInstance.close();
  }
}

app.listen(() => {
  console.log(`Example app listening at ${port}`)
})