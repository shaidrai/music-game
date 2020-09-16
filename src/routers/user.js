const { Router } = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth'
)
const router = Router()

router.post("/user/signup", async (req, res) => {
    console.log("New Sign Up")
    if (req.body) {

        try {
            const user = new User(req.body)
            await user.validate()
            await user.save()
            return res.status(201).send({
                user,
            });

        }
        catch (e) {
            let error = ""

            if (e.code) {
                switch (e.code) {
                    case 11000:
                        error = `${Object.keys(e.keyValue)[0]} is already exists`
                        break
                }
            }
            else {
                error = 'An error has occured'
            }
            return res.status(400).send({ error })
        }

    }
})

router.post("/user/login", async (req, res) => {
    console.log("New Log In")
    if (req.body) {
        try {
            const user = await User.findByCredentials(req.body.username, req.body.password)

            return res.status(200).send({
                user,
                token: await user.generateAuthToken()
            });

        }
        catch (e) {
            console.log(e)
            return res.status(400).send({ e })
        }

    }
})

router.get('/user/me', auth, async (req, res) => {
    if (req.body.id) {
        try {
            const user = await User.findOne({ _id: req.body.id })
            return res.status(200).send({ user })
        }
        catch (e) {
            return res.status(400).send({ error: e })
        }
    }
})

module.exports = router