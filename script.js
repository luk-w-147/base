// Map of codes → file URLs
const codes = {
  "ABC123": "files/file1.pdf",
  "XYZ789": "files/file2.zip",
  "HELLO42": "files/file3.mp3"
};

document.getElementById("submitBtn").addEventListener("click", checkCode);

function checkCode() {
  const input = document.getElementById("codeInput").value.trim();
  const msg = document.getElementById("message");

  if (codes[input]) {
    msg.style.color = "green";
    msg.textContent = "Downloading...";

    // create hidden download link
    const link = document.createElement("a");
    link.href = codes[input];
    link.download = ""; // tells browser to download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    msg.style.color = "red";
    msg.textContent = "Invalid code. Try again!";
  }
}
