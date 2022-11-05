export function webAuth(req, res, next) {
    if (req.session?.user === undefined || req.session?.user === '') {
        console.log('Error de autorización')
        res.redirect(401,'/login')
        return 401;
    }
    return next();
}