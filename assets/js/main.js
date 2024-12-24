const scheduleButton = document.getElementById("scheduleButton");
const testButton = document.getElementById("testButton");
const topicInput = document.getElementById("topicInput");
const responseMessage = document.getElementById("responseMessage");
const voiceSelect = document.getElementById("voice-select");
const voiceText = document.getElementById("voice-text");
const linkContainer = document.getElementById("linkContainer");
const classLink = document.getElementById("classLink");
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
            // console.log(data);
            localStorage.setItem("questions", JSON.stringify(data.questions));
            localStorage.setItem("content", data.content);

            // console.log(localStorage.getItem("questions"));
            // console.log(localStorage.getItem("content"));

            // Fetching link inside this try block
            try {
                const response = await fetch("http://192.168.43.161:5000/get_link", {
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
                // console.log(data);
                
                localStorage.setItem("link", data.link);
                // console.log(localStorage.getItem("link"));
                classLink.href = link;
                classLink.textContent = link;
            }
            catch(error) {
                console.error("Error communicating with the API:", error);
                responseMessage.textContent = "Failed to schedule the class. Please try again later.";
                responseMessage.style.color = "red";
            }

            responseMessage.textContent = "Class scheduled";
            responseMessage.style.color = "green";

            scheduleButton.classList.add("hidden");
            scheduleButton.disabled = true;
            voiceSelect.classList.add("hidden");
            voiceSelect.disabled = true;
            voiceText.classList.add("hidden");
            linkContainer.classList.remove("hidden");

            testButton.classList.remove("hidden");
            testButton.disabled = false;

        } catch (error) {
            console.error("Error communicating with the API:", error);
            responseMessage.textContent = "Failed to schedule the class. Please try again later.";
            responseMessage.style.color = "red";
        } finally {
            setTimeout(() => {
                removeLoadingBar();
            }, 1000);  
        }
    }
});

classLink.addEventListener("click", (event) => {
    console.log("Zoom link clicked!");
    setTimeout(() => {
        const selectedVoiceId = document.querySelector('.voice-option.selected').id;
        speakContent(selectedVoiceId);
    }, 120000);
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

const voices = {
    "lecturer-1": "Microsoft David - English (United States)",  
    "lecturer-2": "Microsoft Heera - English (India)", 
    "lecturer-3": "Microsoft Ravi - English (India)", 
    "lecturer-4": "Google UK English Female"  
};

const content = localStorage.getItem("content");

let availableVoices = [];

function loadVoices() {
    availableVoices = speechSynthesis.getVoices();

    if (availableVoices.length === 0) {
        setTimeout(loadVoices, 100);
    }
}

speechSynthesis.onvoiceschanged = loadVoices;

loadVoices();

function speakContent(voiceId) {
    const selectedVoice = voices[voiceId];
    const utterance = new SpeechSynthesisUtterance(content);
    const availableVoices = speechSynthesis.getVoices();

    const voice = availableVoices.find(v => v.name === selectedVoice);

    if (voice) {
        utterance.voice = voice;
        speechSynthesis.speak(utterance);
    } else {
        console.error("Voice not found: " + selectedVoice);
    }
}

