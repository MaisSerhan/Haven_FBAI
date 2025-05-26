let mediaRecorder;
let audioChunks = [];

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        analyzeCry(audioBlob); // إرسال الصوت إلى موديل الذكاء الاصطناعي
      };

      mediaRecorder.start();
      document.getElementById("resultText").textContent = "جاري التسجيل...";

      // الإيقاف التلقائي بعد 5 ثوانٍ
      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000);
    })
    .catch(error => {
      console.error("فشل في الوصول إلى الميكروفون:", error);
      alert("حدث خطأ أثناء الوصول إلى الميكروفون.");
    });
}

async function analyzeCry(audioBlob) {
  document.getElementById("resultText").textContent = "يتم الآن تحليل البكاء...";
  document.getElementById("adviceBox").style.display = 'none';

  const formData = new FormData();
  formData.append("file", audioBlob, "baby.wav");

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/Wiam/baby-cry-classification-finetuned-babycry-v4", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        // ملاحظة: لا تضع Content-Type، المتصفح يضبطها تلقائيًا مع FormData
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("فشل في التحليل:", response.status, errorText);
      document.getElementById("resultText").textContent = `فشل تحليل الصوت: ${response.status}`;
      return;
    }

    const result = await response.json();

    const label = result?.[0]?.label || "غير معروف";
    const advice = getAdvice(label);

    document.getElementById("resultText").textContent = `الطفل: ${label}`;
    document.getElementById("adviceBox").textContent = advice;
    document.getElementById("adviceBox").style.display = 'block';

    // سجل في التاريخ
    const historyList = document.getElementById("historyList");
    const listItem = document.createElement("li");
    listItem.textContent = `بكاء الطفل بسبب: ${label}`;
    historyList.appendChild(listItem);

  } catch (err) {
    console.error("خطأ أثناء تحليل الصوت:", err);
    document.getElementById("resultText").textContent = "فشل تحليل الصوت (استثناء)";
  }
}

function getAdvice(label) {
  switch (label.toLowerCase()) {
    case "hungry": return "قدّمي له الحليب أو الطعام.";
    case "pain": return "افحصي الطفل جيدًا، ربما يعاني من ألم.";
    case "discomfort": return "تأكدي من الحفاظة أو حرارة الغرفة.";
    case "burping": return "حاولي تجشيئ الطفل بعد الرضاعة.";
    case "tired": return "هيئي له بيئة نوم مريحة.";
    default: return "راجعي حالة الطفل وحاولي تهدئته.";
  }
}
