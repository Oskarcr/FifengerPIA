class UserStatusEnum {
    /**
     * El usuario que esta inactivo en ese momento.
     * @readonly
     */
    OFFLINE = 0;

    /**
     * Es un usuario que esta activo en ese momento. 
     * @readonly
     */
    ONLINE = 1;

    _map = {
        "offline": this.OFFLINE,
        "online": this.ONLINE,
    };
};

const userStatus = new UserStatusEnum();

Object.freeze(userStatus);

export default userStatus;