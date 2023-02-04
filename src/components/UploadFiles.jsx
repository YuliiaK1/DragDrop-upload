import storage from "./firebaseConfig" 
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";

export function uploadFiles(fileList, setFileList){
 //upload on Firebase
fileList.forEach((file) => {
    if (!file.loaded) {
        const storageRef = ref(storage, `/files/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file.file, {
            customMetadata: {
                id: file.id,
            }
        });

        uploadTask.on("state_changed", 
        (snapshot)=>{
            const percent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                // get and update progress
                setFileList((prev)=> {
                    return prev.map((thisFile)=>{
                        file.loaded = true;
                        let temp;
                        if(thisFile.id === file.id) {
                            temp = {
                                ...thisFile, 
                                percent: percent
                            }
                        }
                        return temp || thisFile
                    })
                })
        }, (error)=>console.log(error),
        async () => { // get and update all urls
            await getDownloadURL(uploadTask.snapshot.ref).then((downloadURLs) => {
                setFileList((prev)=> {
                    return prev.map((thisFile)=>{
                        let temp;
                        if(thisFile.id === file.id) {
                            temp = {
                                ...thisFile, 
                                url: downloadURLs
                            }
                        }
                        return temp || thisFile
                    })
                })
            });
        }
        )
    }});
}


  