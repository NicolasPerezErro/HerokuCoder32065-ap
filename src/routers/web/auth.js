import { Router } from 'express'
import { webAuth } from '../../auth/index.js'

import logger from '../../../logger/logger.js'

import __dirname from '../../../__dirname.js'
import path from 'path';

import passport from 'passport';
import bCrypt from 'bcrypt';

import { Strategy as LocalStrategy } from 'passport-local';

import User from '../../models.js'

const loginPath = path.join(__dirname, '/public/', 'login.html')

const authWebRouter = new Router()

passport.use('login', new LocalStrategy(
    (username, password, done) => {
        User.findOne({ username }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (!isValidPassword(user, password)) {
                return done(null, false);
            }

            return done(null, user);
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, done);
});


function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
}

// servicios

authWebRouter.get('/', (req, res) => {
    logger.info(`Ruta: ${req.url} y metodo: ${req.method} ok`)
    res.redirect('/login')
})

authWebRouter.get('/login', (req, res) => {
    logger.info(`Ruta: ${req.url} y metodo: ${req.method} ok`)
    res.sendFile(loginPath)

})

authWebRouter.post('/login', passport.authenticate('login', {
    failureRedirect: '/loginFailed'
}), (req, res) => {
    logger.info(`Ruta: ${req.url} y metodo: ${req.method} ok`)
    const body = req.body;
    req.session.user = body.username;
    res.redirect('/home')

})

authWebRouter.get('/logout', webAuth, (req, res) => {
    logger.info(`Ruta: ${req.url} y metodo: ${req.method} ok`)
    const nombre = req.session.user
    req.session.destroy(err => {
        if (err) {
            res.json({ status: 'Logout Error', body: err })
        } else {
            res.render('logout', { nombre })
        }
    })
})

authWebRouter.get('/loginFailed', (req, res) => {
    logger.info(`Ruta: ${req.url} y metodo: ${req.method} ok`)
    res.render('login-error');

})



export default authWebRouter