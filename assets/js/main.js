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
            console.log(data);
            localStorage.setItem("questions", JSON.stringify(data.questions));
            localStorage.setItem("content", data.content);

            console.log(localStorage.getItem("questions"));
            console.log(localStorage.getItem("content"));

            // Fetching link inside this try block
            try {
                const response = await fetch("http://192.168.1.237:5000/get_link", {
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
                
                localStorage.setItem("link", data.link);
                console.log(localStorage.getItem("link"));
                classLink.href = link; +6+++++++++++++++++  
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
