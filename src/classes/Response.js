class Response {
    /**
     * 
     * @param {string} email 
     * @returns
     */
    static CheckEmail (email) {
        const regex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
        return regex.test(email);
    }

    /**
     * 
     * @param {string} password 
     * @returns 
     */
    static CheckPassword (password) {
        const regex = "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
        return regex.test(password);
    }

    /**
     * 
     * @param {string} email 
     * @param {string} password 
     * @returns 
     */
    static CheckCredentials(email, password) {
        if(!email) return alert("No existe tu correo");
        if(!password) return alert("No existe tu contraseña");
        return true;
    }
}

























const email = document.getElementById("login-email");
const password = document.getElementById("login-password");

function CheckFields(email, password) {
    console.log("Hola")
    if(!email) return alert("Hijo de la polla pon tu correo");
    if(!password) return alert("Puto");
}