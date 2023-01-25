import { useRef, useState } from "react";
import image from "../assets/upload-icon.svg"
import deleteIcon from "../assets/delete-icon.svg"
import {TypesConfig} from "./FileTypesConfig"
import './DragDropFiles.css';
import storage from "./firebaseConfig" 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function DragDropFiles() {
    const focusUploadRef = useRef(null);
    const [fileList, setFileList] = useState([]); // state to store uploaded file
    const [percent, setPercent] = useState(0); // state for progress of upload

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
                    uploadList.push(files[i]);
                    setFileList(uploadList);
                }
        }
    }

    function fileRemove(file){ //delete file
        const uploadList = [...fileList];
        uploadList.splice(fileList.indexOf(file), 1);
        setFileList(uploadList);
    }

    function uploadFiles() { //upload on Firebase
        const promises = []
        fileList.forEach((file) => {
        const storageRef = ref(storage, `/files/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file);
        promises.push(uploadTask)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
            const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            
            // update progress
            setPercent(percent);
            },
            (err) => console.log(err),
            () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);
            });
            }
            ); 
        })
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
            {fileList.map((file, id) => 
            <div className="selected-files__items" key={id}>
                <div className="items-left">
                <img src={TypesConfig[file.type.split('/')[1]] || TypesConfig['default']} alt="Type of file icon" />
                <p className="items-text_name">{file.name.split('.')[0]}</p>
                </div>
                
                <div className="items-right">
                <p className="items-text_persent">{percent}% done</p>
                <div className="delete-files" onClick={() => fileRemove(file)}>
                    <img src={deleteIcon} alt="Delete file" />
                </div>

                </div>
            </div>
            )}
     </div> : null
        }
        <input onClick={uploadFiles} className={fileList.length>0? "input-submit active":"input-submit"} type="submit" value={"UPLOAD FILES TO FIREBASE"}/> 
    </div>
    );
}

export default DragDropFiles;
