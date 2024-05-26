import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";

import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyC1hSKGfz3O-5H0puNAc_GYYC0ZQ2ieEAA",
  authDomain: "quiz-app-d689d.firebaseapp.com",
  projectId: "quiz-app-d689d",
  storageBucket: "quiz-app-d689d.appspot.com",
  messagingSenderId: "29831089474",
  appId: "1:29831089474:web:3affc92746abc877af8cdb",
  measurementId: "G-NJR3Z7NC63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db=getFirestore();

const login = document.querySelector(".button");

login.addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;


/*  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      //const username=user.doc.username;
      //console.log(use);
      alert("Login Succesful");
      // ...
      //window.location.href="quiz.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      // ..
    });*/

    try{
      const userCredential=await signInWithEmailAndPassword(auth,email,password);
      const user=userCredential.user;
      const userDocRef=doc(db,"users",user.uid);
      const userDoc=await getDoc(userDocRef);
          if(userDoc.exists()){
          const username=userDoc.data().username;
          localStorage.setItem('username',username);
         // console.log(username);
          alert("Login Succesful");
          window.location.href='quiz.html';
          }
          else{
            alert("No such user found");
          }

    }catch(error){
      alert(error.message);
    }
})

const register=document.querySelector("#registerBtn");
register.addEventListener("click",(event)=>{
  event.preventDefault();
  window.location.href="register.html";
})