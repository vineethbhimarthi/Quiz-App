
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs,getDoc,setDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged ,signOut} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC1hSKGfz3O-5H0puNAc_GYYC0ZQ2ieEAA",
    authDomain: "quiz-app-d689d.firebaseapp.com",
    projectId: "quiz-app-d689d",
    storageBucket: "quiz-app-d689d.appspot.com",
    messagingSenderId: "29831089474",
    appId: "1:29831089474:web:3affc92746abc877af8cdb",
    measurementId: "G-NJR3Z7NC63"
};

const app= initializeApp(firebaseConfig)
const db = getFirestore();
const auth=getAuth(app);

document.addEventListener('DOMContentLoaded', initializePage);

function initializePage() {
   
    const welcomeUser = document.getElementById('welcomeUser');
    const quizTitle = document.getElementById('quizTitle');
    const questionsContainer = document.getElementById('questionsContainer');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const saveQuizBtn = document.getElementById('saveQuizBtn');
   const logoutBtn=document.getElementById('logoutBtn');
   const closeBtn=document.querySelector("#closeBtn");


    addQuestionBtn.addEventListener('click', addQuestion);
    saveQuizBtn.addEventListener('click', saveQuiz);

    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = "index.html";
        }).catch((error) => {
            console.error("Error logging out: ", error);
        });
    });

    let currentUser=null;

    onAuthStateChanged(auth,(user)=>{
        if(user){
            currentUser=user;
            const username=localStorage.getItem('username');
            welcomeUser.innerHTML=`Hello, ${username}`;
            loadQuizzes(user);
        } 
    })


    
   // loadScores(user);
    /*onAuthStateChanged(auth, (user) => {
        if (user) {
            loadQuizzes();
            loadScores(user);
        } else {
            // Redirect to login page or show a message
        }
    });*/
}

function addQuestion() {

    let closeBtn=document.getElementById('closeBtn');
    if(!closeBtn){
        closeBtn=document.createElement('button');
            closeBtn.innerHTML='Close';
            closeBtn.id='closeBtn';
            const createQuizSpace=document.getElementById('quizCreation');
            createQuizSpace.appendChild(closeBtn);
            closeBtn.addEventListener('click',resetForm);

    }
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.id='questionbox';
    questionInput.placeholder = 'Question';
    questionDiv.appendChild(questionInput);

    for (let i = 0; i < 4; i++) {
        const optionInput = document.createElement('input');
        optionInput.type = 'text';
        optionInput.placeholder = `Option ${i + 1}`;
        questionDiv.appendChild(optionInput);
    }
    const correctOption=document.createElement('input');
    correctOption.type='text';
    correctOption.placeholder='Enter Correct Option';
    questionDiv.appendChild(correctOption);

    const questionCard = document.createElement('div');
    questionCard.classList.add('questionCard');
     questionCard.appendChild(questionDiv);
    questionsContainer.appendChild(questionCard);
}

async function saveQuiz() {
    const title = quizTitle.value;
    if (!title) {
        alert("Quiz title is required");
        return;
    }

    const questions = [];
    document.querySelectorAll('.question').forEach(questionDiv => {
        const questionText = questionDiv.querySelector('input[type="text"]').value;
        const optionInputs = Array.from(questionDiv.querySelectorAll('input[type="text"]')).slice(1);
        const answer=optionInputs.pop().value;
        const options = optionInputs.map(input => input.value);
        questions.push({ question: questionText, options,answer });


        
        console.log(questions);
    });

    if (questions.length === 0) {
        alert("At least one question is required");
        return;
    }
    try {
        await addDoc(collection(db, 'quizzes'), {
            title,
            questions
        });
        alert("Quiz saved successfully!");
        resetForm();
        loadQuizzes(auth.currentUser);
    } catch (error) {
        console.error("Error saving quiz: ", error);
        alert("Error saving quiz");
    }
}

function resetForm(){
    quizTitle.value="";
    questionsContainer.innerHTML="";

    const closeBtn=document.getElementById('closeBtn');
    if(closeBtn){
        closeBtn.remove();
    }
}
/*async function loadQuizzes() {
    const quizList = document.getElementById('quizList');
    quizList.innerHTML = '<h2>Available Quizzes</h2>';
    
    try {
        const querySnapshot = await getDocs(collection(db, 'quizzes'));
        querySnapshot.forEach(doc => {
            const quiz = doc.data();
            const quizDiv = document.createElement('div');
            quizDiv.classList.add('quiz');
            
            const quizTitle = document.createElement('h3');
            quizTitle.textContent = quiz.title;
            quizDiv.appendChild(quizTitle);
            
            if (quiz.questions && Array.isArray(quiz.questions)) {
                quiz.questions.forEach(questionObj => {
                    const questionDiv = document.createElement('div');
                    questionDiv.classList.add('quiz-question');
                    
                    const questionText = document.createElement('p');
                    questionText.textContent = questionObj.question;
                    questionDiv.appendChild(questionText);
                    
                    questionObj.options.forEach(option => {
                        const optionText = document.createElement('p');
                        optionText.textContent = option;
                        optionText.classList.add('quiz-option');
                        questionDiv.appendChild(optionText);
                    });
                    
                    quizDiv.appendChild(questionDiv);
                });
            } else {
                const noQuestionsText = document.createElement('p');
                noQuestionsText.textContent = "No questions available for this quiz.";
                quizDiv.appendChild(noQuestionsText);
            }
            
            quizList.appendChild(quizDiv);
        });
    } catch (error) {
        console.error("Error loading quizzes: ", error);
        quizList.innerHTML += '<p>Error loading quizzes</p>';
    }
}*/
async function loadQuizzes(user) {
    const quizList = document.getElementById('quizList');
    quizList.innerHTML = '<h2>Available Quizzes</h2>';
    
    try {
        //const user = auth.currentUser;
        const querySnapshot = await getDocs(collection(db, 'quizzes'));
        querySnapshot.forEach(doc => {
            const quiz = doc.data();
            const quizDiv = document.createElement('div');
            quizDiv.classList.add('quiz');
            
            const quizTitle = document.createElement('h3');
            quizTitle.textContent = quiz.title;
            quizTitle.id='titleId';
            quizDiv.appendChild(quizTitle);

            const scoreDisplay=document.createElement('p');
            scoreDisplay.classList.add('score');
            loadScores(user.uid,doc.id,scoreDisplay);
            quizDiv.appendChild(scoreDisplay)

            const attemptButton = document.createElement('button');
            attemptButton.textContent = 'Attempt';
            attemptButton.addEventListener('click', () => attemptQuiz(doc.id, quiz,quizDiv,scoreDisplay));
            quizDiv.appendChild(attemptButton);

            quizList.appendChild(quizDiv);
        });
    } catch (error) {
        console.error("Error loading quizzes: ", error);
        quizList.innerHTML += '<p>Error loading quizzes</p>';
    }
}

function attemptQuiz(quizId, quiz,quizDiv,scoreDisplay) {
    const attemptButton = quizDiv.querySelector('button');
    attemptButton.disabled = true;
    const attemptSection = document.createElement('div');
    attemptSection.id = 'attemptQuiz';

    const quizTitle = document.createElement('h2');
    quizTitle.textContent = quiz.title;
    attemptSection.appendChild(quizTitle);
    let qno=1;

    quiz.questions.forEach((questionObj, questionIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('quiz-question');
        
        const questionText = document.createElement('p');
        let ques=questionObj.question;
        questionText.textContent = qno+'. '+ques;
        qno++;
        questionDiv.appendChild(questionText);
        
        questionObj.options.forEach((option, optionIndex) => {
            const optionLabel = document.createElement('label');
            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = `question${questionIndex}`;
            optionInput.value = optionIndex;
            optionLabel.appendChild(optionInput);
            optionLabel.appendChild(document.createTextNode(option));
            questionDiv.appendChild(optionLabel);
        });
        
        attemptSection.appendChild(questionDiv);
            quizList.appendChild(attemptSection);

    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', () => submitQuiz(quizId, quiz.questions,quiz,quizDiv,scoreDisplay));
    attemptSection.appendChild(submitButton);

    const closeButton=document.createElement('button');
    closeButton.textContent='Close';
    closeButton.addEventListener('click',(e)=>{
e.preventDefault();
 attemptSection.remove();
 const attemptButton = quizDiv.querySelector('button');
 attemptButton.disabled = false;
    })
    attemptSection.appendChild(closeButton);

    quizDiv.appendChild(attemptSection);

}

async function submitQuiz(quizId, questions,quiz,quizDiv,scoreDisplay) {
    
    const attemptSection = document.getElementById('attemptQuiz');
    let score = 0;
    let questionCount=0;
    quiz.questions.forEach((questionObj, questionIndex) => {
        const selectedOption = document.querySelector(`input[name="question${questionIndex}"]:checked`);
        if(selectedOption===null)
            {
                alert('Select the Option');
                return;
            }
            questionCount++;
        const answerIndex=questionObj.answer;
        console.log(answerIndex);
        console.log(selectedOption.value);
        if (selectedOption.value == answerIndex-1) {
            score++;
        }
    });
    

     console.log(score);
     score=`${score}/${questionCount}`
     const user = auth.currentUser;
    if (user) {
        try {
            const userScoreRef = doc(db, 'scores', user.uid);
            const userScoreDoc = await getDoc(userScoreRef);
            if (userScoreDoc.exists()) {
                await updateDoc(userScoreRef, { [quizId]: score });
            } else {
                await setDoc(userScoreRef, { [quizId]: score });
            }
            loadScores(user.uid,quizId,scoreDisplay);
        } catch (error) {
            console.error("Error submitting quiz: ", error);
            alert("Error submitting quiz");
        }
    }

    // Remove attempt section after submission
    const attemptButton = quizDiv.querySelector('button');
    attemptButton.disabled = false;
    attemptSection.remove();
}

async function loadScores(userId, quizId,scoreDisplay) {
    try {
        const userScoreRef = doc(db, 'scores', userId);
        const userScoreDoc = await getDoc(userScoreRef);

        if (userScoreDoc.exists()) {
            const scores = userScoreDoc.data();

            if (scores.hasOwnProperty(quizId)) {
                const score = scores[quizId];
                console.log(`Score for quiz ID ${quizId}: ${score}`);
                scoreDisplay.innerHTML=`Your Score = ${score}`;
            } else {
                console.log(`No score found for quiz ID: ${quizId}`);
                scoreDisplay.innerHTML=`Your Score = 0`;

            }
        } else {
            console.log("No scores found for user");
        }
    } catch (error) {
        console.error("Error loading scores: ", error);
    }
}





