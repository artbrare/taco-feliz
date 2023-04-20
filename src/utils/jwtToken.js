// Crear y enviar token y salvarlo en una cookie
const enviarToken = (usuario, statusCode, res, req) => {
    // crear JWT Token
    const token = usuario.getJwtToken();

    // cookie options
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true,
    };

/*     if(process.env.NODE_ENV === 'production '){
        options.secure = true
    } */

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
};

module.exports = enviarToken;