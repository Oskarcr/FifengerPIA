class UserStatusEnum {
    /**
     * El usuario que esta inactivo en ese momento.
     * @readonly
     */
    OFFLINE = 1;

    /**
     * Es un usuario que esta activo en ese momento. 
     * @readonly
     */
    ONLINE = 2;

    _map = {
        "offline": this.OFFLINE,
        "online": this.ONLINE,
    };
};

const UserStatus = new UserStatusEnum();

Object.freeze(UserStatus);

export default UserStatus;