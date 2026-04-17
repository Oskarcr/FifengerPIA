import { Components } from "@/FifengerClient";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();

    return (<>
        <div id="header">
            <Components.ButtonIcon icon="arrow_left_alt" onClick={() => navigate("/menu")}/>
            <Components.Flexed className="header-title">
                Perfil
            </Components.Flexed>
        </div>
        <div id="root-content" style={{
            alignItems: "center",
            flexDirection: "column",
            padding: "var(--spacing-medium)",
        }}>
            <div id="profile-container">
                <img className="profile-banner" src="./Copa2026.png"/>
                <div className="profile-bottom">
                    <div id="profile-bottom-container">
                        <img className="profile-photo" src="./LTG.jpg"/>
                        <div id="profile-inputs">
                            <input style={{
                                fontSize: "var(--font-size-long)"
                            }} type="text" value={"Low"}/>
                            <input type="email" value={"low@gmail.com"}/>
                        </div>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        fontSize: "var(--font-size-medium)",
                        paddingTop: "var(--spacing-short)",
                        borderTop: "var(--border)",
                        justifyContent: "center"
                    }}>
                        Acquisitions &nbsp;&nbsp;&nbsp;&nbsp;
                        <Components.Icon name="crown"/>
                    </div>
                    <div id="profile-acquisitions-container">
                        <Components.ProfileAcquisition src="./Mundial2026-2.jpg"/>
                        <Components.ProfileAcquisition src="./LTG.jpg"/>
                        <Components.ProfileAcquisition src="./Copa2026.png"/>
                    </div>
                </div>
            </div>    
        </div>
    </>);
}