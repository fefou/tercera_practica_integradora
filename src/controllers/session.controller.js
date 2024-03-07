import { DTO } from '../DTO/DTO.js'

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
}
