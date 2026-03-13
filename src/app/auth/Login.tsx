import logo from '../../assets/logo_casa_sorteos.png'

const Login = () => {
    return (
        <>
            <div className="">
                <div className="d-flex justify-content-center mt-2">
                    <img style={{ width: "10em" }}
                        src={logo} alt="" />
                </div>
                <div className="container border mt-5">
                    <form className="row justify-content-center">
                        <div className="col-md-6">
                            <h2 className="text-center mt-5" style={{ fontWeight: "bold", fontSize: "2em" }}>Login</h2>
                            <div className="mb-3"><label htmlFor="email" className="form-label">Correo</label>
                                <input type="email"
                                    className="form-control" id="username" placeholder="email.dentix@example.com" />
                            </div>
                            <div className="mb-3"><label htmlFor="password" className="form-label">contraseña</label>
                                <input type="password"
                                    className="form-control" id="password" placeholder="Contraseña" />
                            </div>
                            <div className="d-flex justify-content-center mb-5">
                                <button className="btn btn-general" type="submit">Login</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login