export default function ProfileAcquisition({
    src="",
    onClick=undefined
}) {
    return (<div onClick={onClick} className="profile-acquisition">
        <img src={src}/>
    </div>);
}