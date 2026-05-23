import { api, Components, Items } from "@/FifengerClient";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const userId = sessionStorage.getItem("id");
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "Loading...",
        email: "Loading...",
        photoId: 1,
        bannerId: 2,
        inventory: []
    });
    const didFetch = useRef(false);

    useEffect(() => {
        if(didFetch.current) return;
        didFetch.current = true;

        (async () => {
            try {
                const { data: user } = await api.get("/users/" + userId);
                setUser(user);
            }
            catch(_) {

            }
        })();
    }, []);

    const photoUrl = "/rewards/" + Items.get(user.photoId).url;
    const bannerUrl = "/rewards/" + Items.get(user.bannerId).url;

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
                <img className="profile-banner" src={bannerUrl}/>
                <div className="profile-bottom">
                    <div id="profile-bottom-container">
                        <img className="profile-photo" src={photoUrl}/>
                        <div id="profile-inputs">
                            <input style={{
                                fontSize: "var(--font-size-long)"
                            }} type="text" value={user.username}/>
                            <input type="email" value={user.email}/>
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
                        {user.inventory.map((a) => {
                            const item = Items.get(a);
                            return <Components.ProfileAcquisition src={"/rewards/" + item.url}/>
                        })}
                    </div>
                </div>
            </div>    
        </div>
    </>);
}