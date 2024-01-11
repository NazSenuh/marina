import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { IUser } from "../../user/types";


export const auth =  (req:Request, res:Response, next: NextFunction) => {
    passport.authenticate('jwt', {session:false}, (err: Error, user: IUser) => {
    if(!user || err){
        return res.status(401).json({
          message: 'UNAUTHORIZED'
        });
    }
    next()
  })(req,res,next)
}