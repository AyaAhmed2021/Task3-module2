const { Router } = require("express")
const router = Router()
const { User } = require("../models/userAuth.model")
const { UserDto } = require("../DTO/userDto")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const jwt_key = require("../config/token.config")

//signup as a new user
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body    // get inputs from request body

    //check mail existing to avoid conflict in DB 
    const isExist = await User.findOne({ email })
    if (isExist) {
        return res.status(400).json({
            message :"This E-mail already exist in DataBase"
        })
    }
        
    const hashedPassword = bcrypt.hashSync(password, 15)   //encrypt PW

    const user = new User({         //create new user account
        name,
        email,
        password: hashedPassword
    })

    await user.save()
    res.json({ user : UserDto(user) })
})


//or login as an exsit user
router.post('/login', async (req, res) => {
    const {email, password} = req.body      // get email & PW from user

    //check mail existing to login
    const existUser = await User.findOne({ email })
    if (!existUser) {
        return res.status(400).json({
            message :"Invalid E-mail"
        })
    }

    const validation = bcrypt.compareSync(password, existUser.password)  // validate PW

    if(!validation){
        return res.status(400).json({
            message:"Invalid Password"
        })
    }

    // const user = UserDto(existUser);

    const token = jwt.sign(existUser, jwt_key);

    res.json({ existUser , token});    

})


module.exports = router