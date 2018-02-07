# shop-app
This is a RESTful node express test application


## Test user 

 {
    "email": "anusree@alignminds.com",
    "password" : "123456"
 }

 ## Workflow

 morgan
nodemon
express = require('express')
app = express()
bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan("dev"));
router = express.router();
router.get('/:id', (req, res, next) => {

})

### Authentication

```javascript
bcrypt = require('bcrypt')
jwt = require('jsonwebtoken')

bcrypt.hash(password, 10 , (err, hashedPwd) => {
	//Store the pwd to user table during signup
})

On login compare the pwd

bcrypt.compare(dbpassword, inputpassword, (err, res)  => {
	if(res === true) {
		//Passwords are same, generate the JWT

		const token = jwt.signin(

			{
				email : useremail,
				id: user_id
			},
			JWT_SECRET_KEY,
			{
				expiresIn : "1h"
			}
		)


		//Return token to the user
	}
})
```
User will pass the token in the header with 
Authorization "Bearer " + token

the requests will be validated with the token 

```javascript
const Authorization = require("../auth");
router.post('/',Authorization,(req, res, next) => {
	

})
```