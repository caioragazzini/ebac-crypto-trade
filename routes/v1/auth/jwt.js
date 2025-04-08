const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { Usuario } = require('../../../models');



passport.use(new JwtStrategy({
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY 
    },async (jwtPayload, done) => {
        try{
            const usuario = await Usuario.findOne({
                _id: jwtPayload.id, 
                confirmado: true,
        });
            done(null, usuario);

        }catch(err){
            done(err);
        }
    }
))