import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC8msgc4oLhxHc58Xfm6Ym3bVcY-wZXu1s",
    authDomain: "fir-upload-44376.firebaseapp.com",
    projectId: "fir-upload-44376",
    storageBucket: "fir-upload-44376.appspot.com",
    messagingSenderId: "924585629649",
    appId: "1:924585629649:web:76c04b34b217c930ee32f0"
  };

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export default storage;
