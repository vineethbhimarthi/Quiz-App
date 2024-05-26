import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

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
const auth = getAuth(app);
const db=getFirestore(app);

const register = document.querySelector(".button");

register.addEventListener("click", async(event) => {
  event.preventDefault();
  const email = document.getElementById('email1').value;
  const password = document.getElementById('password1').value;
  const username= document.getElementById("username").value;
  

  try{
    const userCredential=await createUserWithEmailAndPassword(auth,email,password);
    const user=userCredential.user;

    await setDoc(doc(db,'users',user.uid),{
      username:username,
      email:email
    });

    alert("Account Created Succesfully");
    window.location.href="index.html";
  }catch(error){
    alert(error.message);
  }

});
const login=document.querySelector("#loginBtn");
login.addEventListener("click",(event)=>{
  event.preventDefault();
  window.location.href="index.html";
});





