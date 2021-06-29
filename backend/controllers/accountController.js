const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secret = require('../authKey.config')

class accountController {
    async show(req,res) {
        try{
            const cookie = req.cookies['jwt']
            const claims = jwt.verify(cookie,secret.secret)
    
            if(!claims)
            {
                return res.status(500).send({message:'Error'})
            }
    
            const result = await User.findOne({_id:claims._id})
            const {password,...data} = await result.toJSON()
    
            res.send(data)
        }catch(err){
            res.send({message:'Bạn cần đăng nhập',redirect:'/account/register'})
        }
    }

    async register(req, res){
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        User.findOne({email:req.body.email},async (err,user) => {
            if(err)
            {
                return res.status(500).send({message:'Error'})
            }

            if(user)
            {
                return res.send({message:'Account existed'})
            }

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })

            const result = await newUser.save()
            const {password,...data} = await result.toJSON()

            res.send(data)
        })
    }

    async login(req, res){
        User.findOne({email:req.body.email},async (err,user) =>{
            if(err)
            {
                return res.status(500).send({message:'Error'})
            }

            if(!user){
                return res.send({message:'Tài khoản không tồn tại'})
            }

            if(!await bcrypt.compareSync(req.body.password,user.password))
            {
                return res.send({message:'Sai mật khẩu'})
            }

            const token = await jwt.sign({_id: user._id},secret.secret)

            res.cookie('jwt', token,{
                httpOnly: true,
                maxAge:24*60*60*1000,
            })

            const {password,...data} = await user.toJSON()

            res.send(data)
        })
    }
    logout(req,res){
        res.cookie('jwt','',{
            maxAge:0
        })

        res.send('Successful')
    }
}

module.exports = new accountController