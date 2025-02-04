const {ROLE} = require("../contraints");
function isAdmin(req, res, next){
    if(req.user.role !== ROLE.Admin){
        return res.status(500).json({message: "Only Admin can access this route"});
    }
    next();
}
function isMerchant(req, res, next){
    if(req.user.role !== "merchant"){
        return res.status(500).json({message: "Forbidden"});
    }
    next();
}

function authCounter(req, res, next) {
    console.log(req.counter);
    if (!req.counter.merchants.includes(req.user._id)) {
        return res.status(403).json({ message: "You dont have the acces to this counter. Check your merchant panel" });
    }
    next();
}

module.exports = {
    isAdmin,
    isMerchant,
    authCounter,
}