import { api, Components, Items } from "@/FifengerClient";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Profile() {
    const params = useParams();
    const modificable = !Boolean(params.id);
    const userId = params.id ? params.id : sessionStorage.getItem("id");
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: undefined,
        email: undefined,
        photoId: 1,
        bannerId: 2,
        inventory: []
    });

    const [editUsername, setEditUsername] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [showMessageBox, setShowMessageBox] = useState(false);

    const didFetch = useRef(false);

    useEffect(() => {
        if(didFetch.current) return;
        didFetch.current = true;

        (async () => {
            try {
                const { data: user } = await api.get("/users/" + userId);
                setUser(user);

                setEditUsername(user.username || "");
                setEditEmail(user.email || "");
            }
            catch(_) { }
        })();
    }, []);

    const showErrors = (error) => {
        setTitle("Success");
        setMessage(error.response.data.errors);
        setShowMessageBox(true);
    }

    const activateItem = async (id) => {
        if(!modificable) return;
        const type = Items.get(id).type;
        setUser((p) => ({
            ...p,
            bannerId: type === "banner" ? id : p.bannerId,
            photoId: type === "picture" ? id : p.photoId
        }));
        try {
            await api.patch("/users/activate/" + id, {}, {
                withCredentials: true
            });
            //window.location.reload();
        }
        catch(error) {
            showErrors(error);
        }
    }

    const modifyData = async () => {
        if(!modificable) return;

        try{
            await api.patch("/users/me", {
                email: editEmail,
                username: editUsername
            });

            sessionStorage.setItem("username", editUsername);
            setTitle("Success");
            setMessage("Successfully modified user.");
            setShowMessageBox(true);
        }
        catch(error){
            console.log(error);

            const data = error.response.data;

            setTitle("Error");

            if (data.message) {
                setMessage(data.message);
            }

            if(data.empties) {
                setMessage(data.empties.join("\\n"));
            }

            if(data.errors){
                setMessage("The fields are missing:\\n" + data.errors.join("\\n"));
            }

            setShowMessageBox(true);
        }
    }

    const photoUrl = "/rewards/" + Items.get(user.photoId).url;
    const bannerUrl = "/rewards/" + Items.get(user.bannerId).url;

    return (
    <>
        {showMessageBox && (
            <Components.MessageBox title={title} content={message} onConfirm={() => {
                setShowMessageBox(false)
                window.location.reload();
            }}/>
        )}

        <div id="header">
            <Components.ButtonIcon icon="arrow_left_alt" onClick={() => navigate(-1)}/>
            <Components.Flexed className="header-title">
                Perfil
            </Components.Flexed>
        </div>
        <div id="root-content" style={{
            overflow: "auto",
            flex: 1,
            alignItems: "center",
            flexDirection: "column",
            padding: "var(--spacing-medium)"
        }}>
            <div id="profile-container">
                <img className="profile-banner" src={bannerUrl}/>
                <div className="profile-bottom">
                    <div id="profile-bottom-container">
                        <img className="profile-photo" src={photoUrl}/>
                        <div id="profile-inputs">
                            <input style={{
                                fontSize: "var(--font-size-long)"
                            }} type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)}/>
                            <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)}/>
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
                    {modificable && <button type="button" onClick={modifyData}>
                        Confirmar cambios
                    </button>}
                    <div id="profile-acquisitions-container">
                        {user.inventory.map((id) => {
                            const item = Items.get(id);
                            return <Components.ProfileAcquisition
                                onClick={() => activateItem(id)} 
                                src={"/rewards/" + item.url}
                            />
                        })}
                    </div>
                </div>
            </div>    
        </div>
    </>);
}