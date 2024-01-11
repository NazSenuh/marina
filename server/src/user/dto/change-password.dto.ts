export class CreateUserDto {
    readonly email: string;
    readonly password: string;
    readonly recoveryLink?: string;
}