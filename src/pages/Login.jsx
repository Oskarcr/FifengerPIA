export default function Login() {
    return (
        <div id="container-wrapper">
            <div id="card-container">
                <div id="card">
                    <div id="login-title">Login in</div>
                    <input id="login-email" type="email" placeholder="Email"></input>
                    <input id="login-password" type="password" placeholder="Password"></input>
                        <a id="login-account">Don't you have account?</a>
                    <button id="login-button">Login</button>
                </div>
            </div>
        </div>
    )
}