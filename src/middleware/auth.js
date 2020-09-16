const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded._id)
        req.body.id = decoded._id
        next()
    } catch (e) {
        res.status(401).send({ error: "Unauthurized" })
    }
}