export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
}

export interface AuthPayload {
    userId: number;
    username: string;
    email: string;
}