export const Loader = ({ status, percentage }) => {

    if (!status) return
    return (

        <>
            <div className="loader-track">
                <span className="loader-thumb" style={{ width: percentage ? percentage : "unset" }}></span>
            </div>
        </>
    )
}


export default Loader;