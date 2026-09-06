/* =====================================================
   MONEYSMART RURAL
   FINANCIAL LITERACY FOR RURAL STUDENTS
   ===================================================== */


/* =====================================================
   LOGIN & REGISTER
   ===================================================== */

function openLogin() {
    document.getElementById("loginModal").style.display = "flex";
}

function openRegister() {
    document.getElementById("registerModal").style.display = "flex";
}

function closeModals() {
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("registerModal").style.display = "none";
}

function switchToRegister() {
    closeModals();
    openRegister();
}

function switchToLogin() {
    closeModals();
    openLogin();
}


/* REGISTER */

function registerUser() {

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const message = document.getElementById("registerMessage");

    if (name === "" || email === "" || password === "" || confirmPassword === "") {
        message.innerText = "⚠️ Please fill all fields.";
        message.style.color = "red";
        return;
    }

    if (password !== confirmPassword) {
        message.innerText = "⚠️ Passwords do not match.";
        message.style.color = "red";
        return;
    }

    if (password.length < 6) {
        message.innerText = "⚠️ Password must contain at least 6 characters.";
        message.style.color = "red";
        return;
    }

    const user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem("financialLiteracyUser", JSON.stringify(user));

    message.innerText = "✅ Registration successful! You can now login.";
    message.style.color = "green";

    document.getElementById("registerName").value = "";
    document.getElementById("registerEmail").value = "";
    document.getElementById("registerPassword").value = "";
    document.getElementById("confirmPassword").value = "";
}


/* LOGIN */

function loginUser() {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const message = document.getElementById("loginMessage");

    const savedUser = localStorage.getItem("financialLiteracyUser");

    if (!savedUser) {
        message.innerText = "⚠️ Please register first.";
        message.style.color = "red";
        return;
    }

    const user = JSON.parse(savedUser);

    if (email === user.email && password === user.password) {

        localStorage.setItem("loggedIn", "true");

        message.innerText = "✅ Login successful! Welcome " + user.name + "!";
        message.style.color = "green";

        setTimeout(() => {
            closeModals();
            updateLoginButton();
        }, 1000);

    } else {

        message.innerText = "❌ Incorrect email or password.";
        message.style.color = "red";
    }
}


/* LOGOUT */

function logoutUser() {

    localStorage.removeItem("loggedIn");

    alert("You have been logged out successfully.");

    updateLoginButton();
}


/* UPDATE LOGIN BUTTON */

function updateLoginButton() {

    const buttons = document.querySelectorAll(".nav-buttons button");

    if (buttons.length < 2) {
        return;
    }

    const loggedIn = localStorage.getItem("loggedIn");
    const savedUser = localStorage.getItem("financialLiteracyUser");

    if (loggedIn === "true" && savedUser) {

        const user = JSON.parse(savedUser);

        buttons[0].innerText = "👋 " + user.name;
        buttons[0].onclick = function () {
            logoutUser();
        };

        buttons[1].innerText = "Logout";
        buttons[1].onclick = function () {
            logoutUser();
        };

    } else {

        buttons[0].innerText = "Login";
        buttons[0].onclick = openLogin;

        buttons[1].innerText = "Register";
        buttons[1].onclick = openRegister;
    }
}


/* =====================================================
   SAVINGS CALCULATOR
   ===================================================== */

function calculateSavings() {

    const monthlySaving = parseFloat(
        document.getElementById("monthlySaving").value
    );

    const annualRate = parseFloat(
        document.getElementById("interestRate").value
    );

    const years = parseFloat(
        document.getElementById("savingYears").value
    );

    const result = document.getElementById("calculatorResult");


    if (
        isNaN(monthlySaving) ||
        isNaN(annualRate) ||
        isNaN(years) ||
        monthlySaving <= 0 ||
        annualRate < 0 ||
        years <= 0
    ) {

        result.innerHTML =
            "⚠️ Please enter valid values.";

        return;
    }


    const months = years * 12;

    const monthlyRate = annualRate / 100 / 12;


    let futureValue;


    if (monthlyRate === 0) {

        futureValue = monthlySaving * months;

    } else {

        futureValue =
            monthlySaving *
            (
                (Math.pow(1 + monthlyRate, months) - 1)
                / monthlyRate
            );
    }


    const totalDeposited = monthlySaving * months;

    const interestEarned = futureValue - totalDeposited;


    result.innerHTML = `
        💰 Total Deposited: ₹${totalDeposited.toFixed(2)}
        <br><br>
        📈 Interest Earned: ₹${interestEarned.toFixed(2)}
        <br><br>
        🎯 Estimated Savings: ₹${futureValue.toFixed(2)}
    `;
}


/* =====================================================
   FINANCIAL LITERACY QUIZ
   ===================================================== */

const quizQuestions = [

    {
        question: "What is the main purpose of saving money?",
        answers: [
            "To spend everything immediately",
            "To prepare for future needs",
            "To avoid using banks",
            "To increase unnecessary expenses"
        ],
        correct: 1
    },

    {
        question: "What does a budget help you do?",
        answers: [
            "Plan income and expenses",
            "Spend without thinking",
            "Avoid saving",
            "Borrow more money"
        ],
        correct: 0
    },

    {
        question: "What should you NEVER share with anyone?",
        answers: [
            "Your name",
            "Your favourite colour",
            "Your OTP and UPI PIN",
            "Your hobby"
        ],
        correct: 2
    },

    {
        question: "What is UPI mainly used for?",
        answers: [
            "Digital payments",
            "Watching movies",
            "Writing documents",
            "Taking photographs"
        ],
        correct: 0
    },

    {
        question: "What is interest on a loan?",
        answers: [
            "A type of reward",
            "The cost of borrowing money",
            "A bank password",
            "A UPI PIN"
        ],
        correct: 1
    }

];


let currentQuestion = 0;
let score = 0;
let quizAnswered = false;


/* LOAD QUESTION */

function loadQuestion() {

    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");
    const progressBar = document.getElementById("progressBar");
    const nextButton = document.getElementById("nextButton");

    if (!questionElement || !answersElement) {
        return;
    }

    quizAnswered = false;

    const current = quizQuestions[currentQuestion];

    questionElement.innerText =
        (currentQuestion + 1) +
        ". " +
        current.question;

    answersElement.innerHTML = "";

    current.answers.forEach((answer, index) => {

        const button = document.createElement("button");

        button.innerText = answer;

        button.onclick = function () {
            selectAnswer(index);
        };

        answersElement.appendChild(button);
    });


    const progress =
        ((currentQuestion) / quizQuestions.length) * 100;

    progressBar.style.width = progress + "%";

    nextButton.style.display = "inline-block";

    document.getElementById("quizResult").innerText = "";
}


/* SELECT ANSWER */

function selectAnswer(selectedIndex) {

    if (quizAnswered) {
        return;
    }

    quizAnswered = true;

    const current = quizQuestions[currentQuestion];

    const answerButtons =
        document.querySelectorAll("#answers button");


    if (selectedIndex === current.correct) {

        score++;

        answerButtons[selectedIndex].style.background =
            "#dff5e7";

        answerButtons[selectedIndex].style.borderColor =
            "#16804e";

    } else {

        answerButtons[selectedIndex].style.background =
            "#ffe5e5";

        answerButtons[selectedIndex].style.borderColor =
            "#d9534f";

        answerButtons[current.correct].style.background =
            "#dff5e7";
    }
}


/* NEXT QUESTION */

function nextQuestion() {

    if (!quizAnswered) {

        alert("Please select an answer first.");

        return;
    }


    currentQuestion++;


    if (currentQuestion < quizQuestions.length) {

        loadQuestion();

    } else {

        showQuizResult();
    }
}


/* QUIZ RESULT */

function showQuizResult() {

    document.getElementById("question").innerText =
        "🎉 Quiz Completed!";

    document.getElementById("answers").innerHTML = "";

    document.getElementById("progressBar").style.width = "100%";

    document.getElementById("nextButton").style.display = "none";


    let message = "";

    if (score === 5) {

        message = "Excellent! 🌟 You have very good financial knowledge.";

    } else if (score >= 3) {

        message = "Good job! 👍 Keep learning about money management.";

    } else {

        message = "Keep learning! 📚 Financial knowledge grows with practice.";
    }


    document.getElementById("quizResult").innerHTML = `
        <h3>Your Score: ${score} / ${quizQuestions.length}</h3>
        <p>${message}</p>
        <button onclick="restartQuiz()">
            Try Again
        </button>
    `;
}


/* RESTART QUIZ */

function restartQuiz() {

    currentQuestion = 0;
    score = 0;

    loadQuestion();
}


/* =====================================================
   FEEDBACK
   ===================================================== */

const feedbackForm =
    document.getElementById("feedbackForm");

if (feedbackForm) {

    feedbackForm.addEventListener("submit", function(event) {

        event.preventDefault();

        alert(
            "Thank you for your feedback! 🌱"
        );

        feedbackForm.reset();

    });
}


/* =====================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ===================================================== */

window.addEventListener("click", function(event) {

    const loginModal =
        document.getElementById("loginModal");

    const registerModal =
        document.getElementById("registerModal");


    if (event.target === loginModal) {

        closeModals();

    }


    if (event.target === registerModal) {

        closeModals();

    }

});


/* =====================================================
   START WEBSITE
   ===================================================== */

document.addEventListener("DOMContentLoaded", function() {

    updateLoginButton();

    loadQuestion();

});