import { DTO } from '../DTO/DTO.js'
import { usuariosModelo } from '../dao/models/users.model.js';
import { config } from '../config/config.js'
import jwt from "jsonwebtoken";
import { enviarEmail } from '../mails/mail.js';
import bcrypt from 'bcrypt'
export class SessionsController {
  constructor() { }

  static async login(req, res) {

    req.session.usuario = {
      nombre: req.user.first_name,
      email: req.user.email,
      rol: req.user.rol,
      carrito: req.user.cartId
    };

    res.redirect(
      `/realtimeproducts?mensajeBienvenida=Bienvenido ${req.user.first_name}, su rol es ${req.user.rol}`
    );
  }

  static async register(req, res) {
    let { email } = req.body;

    return res.redirect(`/login?mensaje=Usuario ${email}registrado correctamente`);
  }

  static async errorLogin(req, res) {
    return res.redirect("/login?error=Error en el proceso de login");
  }

  static async errorRegistro(req, res, error) {
    return res.redirect(`/register?error=${encodeURIComponent("Error en el proceso de registro: " + error.message)}`);
  }

  static async logout(req, res) {
    req.session.destroy((error) => {
      if (error) {
        return res.redirect("/?error=Error al cerrar sesión");
      }
      return res.redirect("/login");
    });
  }

  static async current(req, res) {
    let session = req.session.usuario;

    if (session) {
      let usuario = new DTO(session);
      return res.status(200).json({ usuario });
    } else {
      return res.redirect('/views/login?error= Error, necesita loguearse');
    }
  }


  static async recupero(req, res) {
    let { email } = req.body

    let usuario = await usuariosModelo.findOne({ email }).lean()
    if (!usuario) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).kson({ error: `No existe el email: ${email}` })
    }
    delete usuario.password
    let token = jwt.sign({ ...usuario }, config.SECRET, { expiresIn: "1h" })

    let mensaje = `Ha solicitado reiniciar contraseña
    Haga click en el siguiente enlace: <a href="http://localhost:${config.PORT}/api/sessions/recupero02?token=${token}">Resetear Contraseña</a>`
    let respuesta = await enviarEmail(email, "Recupero Pasword", mensaje)

    // res.setHeader('Content-Type','application/json');
    // return res.status(200).json({respuesta});

    if (respuesta.accepted.length > 0) {
      res.redirect(`http://localhost:${config.PORT}?mensaje=Recibirá en breve un mail, siga los pasos`)
    } else {
      res.redirect(`http://localhost:${config.PORT}?mensaje=Error al intentar recuperar contraseña`)
    }
  }

  static async recupero02(req, res) {
    let { token } = req.query

    try {
      let datosToken = jwt.verify(token, config.SECRET)
      res.redirect(`http://localhost:${config.PORT}/recupero02?token=` + token)
    } catch (error) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador` })

    }
  }

  static async recupero03(req, res) {
    let { password, password2, token } = req.body

    if (password !== password2) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: `Claves diferentes` })
    }

    try {
      let datosToken = jwt.verify(token, config.SECRET)
      let usuario = await usuariosModelo.findOne({ email: datosToken.email }).lean()
      if (!usuario) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `error de usuario` })
      }

      if (bcrypt.compareSync(password, usuario.password)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Ha ingresado una contraseña utilizada anteriormente` })
      }
      console.log("salio01")
      let usuarioActualizado = { ...usuario, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) }
      console.log("salio02")

      await usuariosModelo.updateOne({ email: datosToken.email }, usuarioActualizado)
      console.log("salio03")

      res.redirect(`http://localhost:${config.PORT}?mensaje=contraseña reseteada`)
    } catch (error) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador` })

    }
  }
}
