const getLeaderboardFromLocalStorage = () => {
    const storedData = JSON.parse(localStorage.getItem("leaderboard"))
    if (storedData) {
        return storedData
    }
    return []
}

const displayLeaderboard = () => {
    const leaderboardRecords = getLeaderboardFromLocalStorage()
    const resultsContainer = document.querySelector(".results-container")

    resultsContainer.innerHTML = ""
    for (let i = 0; i < leaderboardRecords.length; i++) {
        resultsContainer.innerHTML += `
            <div class="result">
                <span>${i + 1}</span>
                <span>${leaderboardRecords[i].username}</span>
                <span>${leaderboardRecords[i].score}</span>
            </div>
        `
    }
}
displayLeaderboard()
