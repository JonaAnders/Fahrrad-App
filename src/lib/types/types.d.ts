export type db_mileage = {
    date: number;
    mileage_id: number;
    group_id: number;
    kilometers: number;
};
export type db_group = {
    group_id: number;
    name: string;
    identifier: string;
};
export type mileage = {
    mileageId: number;
    date: Date;
    groupId: number;
    kilometers: number;
};
export type group = {
    groupId: number;
    name: string;
    identifier: string;
};
export type dbUser = {
    user_id: number;
    user_name: string;
    password: string;
    failed_attempts: number;
    blocked_until: number;
};
export type user = {
    userId: number;
    username: string;
    password: string;
    failedAttempts: number;
    blockedUntil: Date;
};

export type jwtPayLoad = {
    userId: number;
    username: string;
    iat: number;
    exp: number;
};
