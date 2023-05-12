const sessionsRepositories = require("../repositories/session");
const usersRepositories = require("../repositories/user");

async function authenticate(req, res, next) {
    if(!req.header('Authorization')) return res.sendStatus(401);

    const token = req.header('Authorization').split(' ')[1];

    try {
        const session = await sessionsRepositories.findByToken(token);
        if(!session) return res.status(401).send({ error: 'Invalid token' });
        
        const user = await usersRepositories.findUserById(session.fk_Usuario_id);
        
        if(!user) return res.sendStatus(500);

        req.user = user;
        next();
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

module.exports = authenticate;