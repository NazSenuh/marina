import { PassportStatic } from "passport";
import { JwtPayload } from "jsonwebtoken";
import { VerifiedCallback, ExtractJwt, JwtFromRequestFunction, Strategy } from "passport-jwt";

import userService from "../user/service/user.service";


export const setStrategy = (passport: PassportStatic) =>{
  const opts: { jwtFromRequest: JwtFromRequestFunction; secretOrKey: any } = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || ''
  };

  passport.use(
    new Strategy(opts, async (jwt_payload: JwtPayload, done:VerifiedCallback )=>{
      try {
        const email =  jwt_payload.email
        const user = await userService.getUser({email})

        done(null, user || false )
      }catch (error) {
        done(error,true)
      }
    })
  )

  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        user
      });
    });
  });

  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user as Object);
    });
  });

}