const scheduleButton = document.getElementById("scheduleButton");
const testButton = document.getElementById("testButton");
const speakButton = document.getElementById("speak-btn");
const topicInput = document.getElementById("topicInput");
const responseMessage = document.getElementById("responseMessage");
const voiceSelect = document.getElementById("voice-select");
let loadingBar;

scheduleButton.addEventListener("click", async () => {
    const topic = topicInput.value.trim(); 
    localStorage.setItem("topic", topic);
    if (!topic) {
        responseMessage.textContent = "Please enter a topic!";
        responseMessage.style.color = "red";
    } else {
        responseMessage.textContent = "";
        responseMessage.textContent = "Processing... Please wait.";
        responseMessage.style.color = "#f77062";
        createLoadingBar();

        try {
            const response = await fetch("https:/horizontal-lois-ai-classroom-6d952d4d.koyeb.app/get_maal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ topic }), 
            });
            if (!response.ok) {
                const errorData = await response.json();
                responseMessage.textContent = errorData.message || "An error occurred.";
                responseMessage.style.color = "red";
                return;
            }
            const data = await response.json();
            console.log(data);
            localStorage.setItem("questions", JSON.stringify(data.questions));
            localStorage.setItem("content", data.content);

            console.log(localStorage.getItem("questions"));
            console.log(localStorage.getItem("content"));

            responseMessage.textContent = "Class scheduled";
            responseMessage.style.color = "green";

            speakButton.classList.remove("hidden");
            speakButton.disabled = false;

            testButton.classList.remove("hidden");
            testButton.disabled = false;

        } catch (error) {
            console.error("Error communicating with the API:", error);
            responseMessage.textContent = "Failed to schedule the class. Please try again later.";
            responseMessage.style.color = "red";
        }

        setTimeout(() => {
            removeLoadingBar();
        }, 10000); 
    }
});

function createLoadingBar() {
    loadingBar = document.createElement("div");
    loadingBar.className = "loading-bar-container";
    loadingBar.innerHTML = `<div class="loading-bar"></div>`;
    document.querySelector(".container").appendChild(loadingBar);
}

function removeLoadingBar() {
    if (loadingBar) {
        loadingBar.remove();
    }
}

testButton.addEventListener("click", async () => {
    window.location.href = "questions.html";
});

function populateVoiceList() {
    if (!'speechSynthesis' in window) {
        console.error("Tata bye bye hogya");
    }
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
        console.log("No voices found");
    }
    voiceSelect.innerHTML = "";
    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}
speechSynthesis.onvoiceschanged = populateVoiceList;

speakButton.addEventListener("click", () => {
    const content = localStorage.getItem("content");

    if (content && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(content);

        const selectedVoiceIndex = voiceSelect.value;
        const voices = speechSynthesis.getVoices();
        if (voices[selectedVoiceIndex]) {
            utterance.voice = voices[selectedVoiceIndex];
        }

        speechSynthesis.speak(utterance);
    }
    else {
        console.error("Khel khatm dukaan band");
    }
})
