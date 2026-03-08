export default function Flexed({className="", children}) {
    return (<div className={className} style={{
        flex: 1
    }}>
        {children}
    </div>);
}