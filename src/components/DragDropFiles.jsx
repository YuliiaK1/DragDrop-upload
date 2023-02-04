import { useRef } from "react";
import image from "../assets/upload-icon.svg"
import clip from "../assets/clip-icon.png"
import deleteIcon from "../assets/delete-icon.svg"
import { v4 as uuidv4 } from 'uuid';
import {TypesConfig} from "./FileTypesConfig"
import './DragDropFiles.css';
import {uploadFiles} from "./UploadFiles"

function DragDropFiles({fileList, setFileList}) {
    const focusUploadRef = useRef(null);

    function onDragStart (e) {
        e.preventDefault() //override the default behavior
        focusUploadRef.current.classList.add('upload-focus');
    }
    function onDragLeave (e) {
        e.preventDefault() //override the default behavior
        focusUploadRef.current.classList.remove('upload-focus');
    }
    function onDrop (e) {
        focusUploadRef.current.classList.remove('upload-focus');
    }


    function getUploadfile (e) { //get selected file/files
        e.preventDefault()
        const selectedFiles = Array.from(e.target.files);
        fileAdd(selectedFiles);
        e.target.value = null;
    }

    function fileAdd(files) { //add file to state
        const uploadList = [...fileList];
        const permittedType = ["png", "jpeg", "pdf", "psd", "gif", "mp4"]
        for (let i = 0; i<files.length && uploadList.length<5; i++){ //add file limit check
                if(permittedType.includes(files[i].type.split('/')[1])) { //file type check
                    uploadList.push({
                        name: files[i].name,
                        type: files[i].type,
                        size: files[i].size,
                        id: uuidv4(),
                        file: files[i],
                        loaded: false,
                        percent: 0,
                        url: null
                    });
                    setFileList(uploadList);
                }
        }
    }

    function fileRemove(file){ //delete file
        const uploadList = [...fileList];
        uploadList.splice(fileList.indexOf(file), 1);
        setFileList(uploadList);
    }


    return (
    <div 
    onDragOver={onDragStart}
    onDragLeave={onDragLeave}
    onDrop={onDrop}>
        <div ref={focusUploadRef} className='upload-block'>
            <img src={image} alt="Upload icon" />
            <h2>Drag&drop files or Browse</h2>
            <p className="upload-block__text-limit">Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD</p>
            {fileList.length===5? <p className="upload-block__text-limit upload-block__text-limit_active">Selected limited amount of files!</p>:<p className='upload-block__text-limit'>You can upload up to 5 files</p>}
            <input type="file" accept="image/png, image/jpeg, .gif, .mp4, .pdf, .psd" multiple onChange={getUploadfile}/>  
        </div>
        {
            fileList? <div className="selected-files">
            {fileList.map((file, index) => 
            <div className="selected-files__items" key={file.id}>
                <div className="items-left">
                <img src={TypesConfig[file.type.split('/')[1]] || TypesConfig['default']} alt="Type of file icon" />
                <p className="items-text_name">{file.name.split('.')[0]}</p>
                </div>
                
                <div className="items-right">
                <div className="link-block">
                    <a href={file.url} target="_blank" rel="noreferrer"><img src={clip} alt="Link" style={{opacity: file.url===undefined? "0.5" : "1"}}/></a>
                </div>
                <p className={file.percent.length>0? "items-text_persent-active":"items-text_persent"} >{file.percent}% done</p>
                <div className="delete-files" onClick={() => fileRemove(file)}>
                    <img src={deleteIcon} alt="Delete file" />
                </div>

                </div>
            </div>
            )}
     </div> : null
        }
        <input onClick={()=>uploadFiles(fileList, setFileList)} className={fileList.length>0? "input-submit active":"input-submit"} type="submit" value={"UPLOAD FILES TO FIREBASE"}/> 
    </div>
    );
}

export default DragDropFiles;