import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

import userService from "../../user/service/user.service";
import { LoginUserDto } from "../dto/login-user.dto";
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CustomError } from '../../common/error';
import { recoveryHTML } from './recover.html';
import dayjs from 'dayjs';


export class AuthService {

    public async login(req: LoginUserDto) {
        const email = req.email
        const password = req.password

        const user = await userService.getUser({ email })

        if (!user) {
            throw new CustomError('there is no such user', 400)
        }

        const validPassword = bcrypt.compareSync(password, user.password)

        if (!validPassword) {
            throw new CustomError('error', 400)
        }

        const token = this.createToken(req)
        return token
    }

    public async changePassword({ email }: ChangePasswordDto) {

        const candidate = await userService.getUser({ email })
        if (!candidate) {
            throw new CustomError('there is no such user', 400)
        }
        const activationLink = uuidv4()
        var now = dayjs()
        const expirationTime = now.add(15, 'minutes').toISOString()

        const user = await userService.getUser({ email })
        await userService.upadateUser(user?.id,
            {
                recoveryLink: {
                    link: activationLink,
                    expiredAt: expirationTime
                }
            })
        const sourceEmail = 'info@seaportresortandmarina.com'

        this.sendEmail(email, sourceEmail, activationLink)
        return activationLink
    }


    public async activate(link: string, email: string, password: string, confirmPassword: string) {


        const user = await userService.getUser({ email });

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d\W]).{8,}$/;
        const isValid = passwordRegex.test(password);
        
        if (!isValid) {
            throw new CustomError('Password must contain at least one uppercase letter, one lowercase letter, and one number or symbol', 400)
        }
        if (!user) {
            throw new CustomError('User does not exist', 400);
        }
        
        if (user.recoveryLink?.link !== link) {
            throw new CustomError('Invalid recovery link', 400);
        }
        
        if (new Date(user.recoveryLink.expiredAt).getTime() < Date.now()) {
            throw new CustomError('Link expired', 400);
        }

        if (password !== confirmPassword) {
            throw new CustomError('Passwords must match', 400)
        }

        const hashedPassword = await bcrypt.hash(password, 7)

        const updatedUser = await userService.upadateUser(user.id,
            {
                password: hashedPassword,
                recoveryLink: {link: '', expiredAt:''}
                
            })


        return updatedUser
    }

    public async sendEmail(recepientEmail: string, senderEmail: string, link: string) {
        const SES_CONFIG = {

            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY ? process.env.AWS_ACCESS_KEY : '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY : ''
            },
            region: process.env.AWS_COUNTRY_REGION
        };
        const sesClient = new SESClient(SES_CONFIG)
        

        let params = {
            Destination: {
                ToAddresses: [recepientEmail]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: recoveryHTML(link, recepientEmail)
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Recover your password!`
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: `Forgot your password?`
                }
            },
            Source: senderEmail,
            ReplyToAddresses: [senderEmail],
        };

        try {
            const sendEmailCommand = new SendEmailCommand(params)
            await sesClient.send(sendEmailCommand)
        } catch (error) {
            console.log(error)
        }
    }



    private createToken(req: LoginUserDto) {
        const token = jwt.sign(req, process.env.JWT_SECRET || '', { expiresIn: '24h' })
        return token
    }
}
export default new AuthService()


