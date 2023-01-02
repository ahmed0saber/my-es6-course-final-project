const getQuestionsFromAPI = async () => {
    const response = await fetch("https://quiz-api-0a7v.onrender.com/questions")
    const jsonResponse = await response.json()

    return jsonResponse
}

const displayQuestions = async () => {
    const questions = await getQuestionsFromAPI()
    const questionsContainer = document.querySelector(".questions-container")
    questionsContainer.innerHTML = ""

    questions.forEach(question => {
        questionsContainer.innerHTML += `
            <div class="question-container">
                <p class="question">${question.question}</p>
                <div class="answers-container">
                    <div class="answer" data-index="0">${question.answers[0]}</div>
                    <div class="answer" data-index="1">${question.answers[1]}</div>
                    <div class="answer" data-index="2">${question.answers[2]}</div>
                </div>
            </div>
        `
    })

    handleAnswerSelection()
}
displayQuestions()

const handleAnswerSelection = () => {
    const answers = document.querySelectorAll(".answer")
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener("click", () => {
            const questionAnswers = answers[i].closest(".answers-container").querySelectorAll(".answer")
            for (let j = 0; j < questionAnswers.length; j++) {
                questionAnswers[j].classList.remove("checked")
            }
            if (answers[i].classList.contains("checked")) {
                answers[i].classList.remove("checked")
            } else {
                answers[i].classList.add("checked")
            }
        })
    }
}

const getUserAnswers = () => {
    const checkedAnswers = document.querySelectorAll(".answer.checked")
    if (checkedAnswers.length < 5) {
        alert("all questions are required")
        return
    }
    const userAnswers = []
    for (let i = 0; i < checkedAnswers.length; i++) {
        userAnswers.push(parseInt(checkedAnswers[i].dataset.index))
    }
    return userAnswers
}

const getUsername = () => {
    const username = document.querySelector(".username").value
    if (username.trim().length === 0) {
        alert("username is required")
        return
    }
    if (!/^([a-z]|[A-Z])\w{2,}$/.test(username)) {
        alert("username is not valid, it must start with a letter, and min length of 3 non symbol or space characters")
        return
    }
    return username
}

const getScore = async (userAnswers) => {
    const res = await fetch("https://quiz-api-0a7v.onrender.com/answers", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `answers=${JSON.stringify(userAnswers)}`
    })
    const jsonResponse = await res.json()
    return jsonResponse.score
}

const getLeaderboardFromLocalStorage = () => {
    const storedData = JSON.parse(localStorage.getItem("leaderboard"))
    if (storedData) {
        return storedData
    }
    return []
}

const addRecordToLocalStorage = (username, score) => {
    const currentLeaderboard = getLeaderboardFromLocalStorage()
    const tempArray = []
    let rightPositionIsFound = false
    for (let i = 0; i < currentLeaderboard.length;) {
        if (currentLeaderboard[i].score >= score || rightPositionIsFound) {
            tempArray.push(currentLeaderboard[i])
            i++
        } else {
            tempArray.push({
                username,
                score
            })
            rightPositionIsFound = true
        }
    }
    if (!rightPositionIsFound) {
        tempArray.push({
            username,
            score
        })
    }

    localStorage.setItem("leaderboard", JSON.stringify(tempArray))
}

const handleFormSubmit = async () => {
    const userAnswers = getUserAnswers()
    const username = getUsername()
    if (userAnswers === undefined || username === undefined) {
        return
    }

    const userScore = await getScore(userAnswers)
    addRecordToLocalStorage(username, userScore)
    location.href = "../leaderboard"
}
document.querySelector(".btn-submit").addEventListener("click", handleFormSubmit)
