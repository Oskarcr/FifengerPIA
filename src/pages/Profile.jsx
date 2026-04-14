import { Components } from "@/Fifenger";
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
            padding: "var(--padding-medium)",
        }}>
            <div id="profile-container">
                <img className="profile-banner" src="https://stadibox.sfo2.digitaloceanspaces.com/Diablos_Rojos_Estadio_Harp_Helu_2_8a630673b7.png"/>
                <div className="profile-bottom">
                    <div id="profile-bottom-container">
                        <img className="profile-photo" src="https://images.genius.com/04cabcd7cba7ee26de65fbcf5c67acd4.300x300x1.jpg"/>
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
                        paddingTop: "var(--padding-short)",
                        borderTop: "var(--border)",
                        justifyContent: "center"
                    }}>
                        Acquisitions &nbsp;&nbsp;&nbsp;&nbsp;
                        <Components.Icon name="crown"/>
                    </div>
                    <div id="profile-acquisitions-container">
                        <Components.ProfileAcquisition src="https://assets1.afa.com.ar/media/LUCAS-GAIO/Junio-2025/webfifa26.jpg"/>
                        <Components.ProfileAcquisition src="https://images.genius.com/04cabcd7cba7ee26de65fbcf5c67acd4.300x300x1.jpg"/>
                        <Components.ProfileAcquisition src="https://stadibox.sfo2.digitaloceanspaces.com/Diablos_Rojos_Estadio_Harp_Helu_2_8a630673b7.png"/>
                    </div>
                </div>
            </div>    
        </div>
    </>);
}