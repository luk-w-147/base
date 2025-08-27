// Map of codes → file URLs
const codes = {
  "nickisthebest": "files/file.3mf",
  "nickisthegoat": "files/file1.html"
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
