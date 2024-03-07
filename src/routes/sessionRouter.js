// import { usuariosModelo } from '../dao/models/users.model.js';
// import { creaHash } from '../utils.js';
// import { validaPassword } from '../utils.js';
// import crypto from 'crypto'
// import { Session } from 'express-session';
import { Router } from 'express';
import passport from 'passport';
import { SessionsController } from '../controllers/session.controller.js';

export const router = Router()

router.get('/github', passport.authenticate('github', {}), (req, res) => { })

router.get('/callbackGithub', passport.authenticate('github', { failureRedirect: "/api/sessions/errorGithub" }), (req, res) => {

    req.session.ususario = req.user
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        message: "Acceso OK", usuario: req.user

    });

});

router.get('/errorGithub', (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        error: "Error al autenticar con Github"
    });
})

router.get('/errorLogin', SessionsController.errorLogin)

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/errorLogin' }), SessionsController.login)

router.get('/errorRegistro', SessionsController.errorRegistro)

router.post('/register', passport.authenticate('registro', { failureRedirect: '/api/sessions/errorRegistro' }), SessionsController.register)

router.get('/logout', SessionsController.logout)

router.get('/current', SessionsController.current) 