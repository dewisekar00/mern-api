module.exports ={

register: (req,res,next) => {

    const{name,email,password} = req.body
 
    const result = {
        message: 'register success',
        data: {
            id: 1,
            name: name,
            email: email,

        }

    }
 res.status(200).json(result)
}

}