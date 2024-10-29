// 입력한 데이터를 XML로 변환하여 저장
function saveData() {
    const inputText = document.getElementById("inputText").value;

    // XML 구조를 문자열로 생성
    const xmlData = `
    <data>
        <entry>${inputText}</entry>
    </data>`;

    // 로컬 스토리지에 XML 데이터 저장
    localStorage.setItem("xmlData", xmlData);

    // 저장된 데이터 출력
    displayData();
}

// 저장된 XML 데이터를 페이지에 출력
function displayData() {
    const outputText = document.getElementById("outputText");
    const xmlData = localStorage.getItem("xmlData");

    if (xmlData) {
        outputText.textContent = xmlData;
    } else {
        outputText.textContent = "저장된 데이터가 없습니다.";
    }
}

// 페이지 로드 시 데이터 표시
window.onload = displayData;
