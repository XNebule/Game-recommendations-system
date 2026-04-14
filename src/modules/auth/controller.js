const aS = require('./services')

const register = async (req, res) => {

    try {
        const { email, password } = req.body
        const user = await aS.register(email, password)

        res.status(201).json({
            Message: 'User Created',
            userId: user.id,
            user
        })
    } catch (err) {
        console.log("ERROR: ", err.message)
        res.status(400).json({
            Error: err.mesage
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const result = await aS.login(email, password)
        res.json(result)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

module.exports = {
    register, login
}