const uploadForm = document.getElementById("uploadForm");
const responseMessage = document.getElementById("responseMessage");

uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) return;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const res = await fetch("/upload", {
            method: "POST",
            headers: {
                "Authorization": "Bearer PLACEHOLDER_TOKEN"
            },
            body: formData
        });
        const data = await res.json();

        if (res.ok) {
            responseMessage.className = "response-message response-success";
            responseMessage.innerHTML = `
            Success: ${data.message}<br/>
            <a href="/view?id=${data.id}" target="_blank" rel="noopener noreferrer">
              Click here to view your file
            </a>`;
            responseMessage.style.display = "block";
        } else {
            responseMessage.className = "response-message response-error";
            responseMessage.textContent = `Error: ${data.error}`;
            responseMessage.style.display = "block";
        }
    } catch (error) {
        responseMessage.className = "response-message response-error";
        responseMessage.textContent = "An unexpected error occurred.";
        responseMessage.style.display = "block";
        console.error(error);
    }
});