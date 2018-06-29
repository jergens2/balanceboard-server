
const jwt = require("jsonwebtoken");

// 2018-06-29:  this secret is temporary until better key management is implemented
const secret = "1D78454C81ED9CB8E1348851F25DFE11BE0DCA6C277C5AC1CAB58B7B196B81C30F87F047F25871DAC35BA5ACA760EFF07F58A438FC2CDC1956EBC265E1";

module.exports = (req, res, next ) => {
    //there are different ways to get the token, e.g. from headers, or from query... 
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, secret);
        next();
    }catch (error) {
        res.status(401).json({
            message: "Verification failed."
        });
    }
    

};