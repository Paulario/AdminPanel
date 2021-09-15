export interface IUser {
    name: string;
    email: string;
    password: string;
}

export class User implements IUser {
    constructor(
        public name: string,
        public email: string,
        public password: string,
    ) {}
}
