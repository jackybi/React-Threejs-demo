import React from "react";

function UI(props){
    const hiddenFileInput = React.useRef(null);
    const handleFileImport = e => {

    }
    const importFile = e => {
        e.preventDefault()
    }

    return (
        <div className="threejs-gui" ref={hiddenFileInput} onChange={handleFileImport} style={{ position:"fixed" }}>
            <input id={"file"} type={'file'} hidden />
            <input id={"import"} onClick={importFile} type={'button'} value="import"/>
            <input id={"export"} type={'button'} value="export"/>
        </div>
    )
}

export default UI;