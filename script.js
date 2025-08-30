// Enhanced code with API integration
class CodeUnlocker {
  constructor() {
    // Use your live API URL - change this to your actual worker URL
    this.API_BASE = 'https://code-unlock-api.thanos.workers.dev';
    
    // Remove the local codes object since we'll get them from the API
    this.init();
  }

  init() {
    const submitBtn = document.getElementById("submitBtn");
    const codeInput = document.getElementById("codeInput");
    
    submitBtn.addEventListener("click", () => this.checkCode());
    
    // Add Enter key support
    codeInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.checkCode();
      }
    });
    
    // Focus input on page load
    codeInput.focus();
  }

  async checkCode() {
    const input = document.getElementById("codeInput").value.trim();
    const submitBtn = document.getElementById("submitBtn");
    const btnText = document.getElementById("btnText");
    const spinner = document.getElementById("spinner");
    
    if (!input) {
      this.showMessage("Please enter a code", "error");
      return;
    }

    // Show loading state
    submitBtn.classList.add("loading");
    btnText.style.display = "none";
    spinner.style.display = "block";

    try {
      // Call the unlock API
      const response = await fetch(`${this.API_BASE}/api/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: input })
      });

      const result = await response.json();

      if (result.success) {
        // API returned success with download URL
        this.downloadFile(result.downloadUrl, result.fileName);
        document.getElementById("codeInput").value = ""; // Clear input
      } else {
        // API returned an error
        this.showMessage(result.error || "Invalid code. Please try again!", "error");
      }

    } catch (error) {
      console.error('API error:', error);
      this.showMessage("Connection error. Please try again!", "error");
    }

    // Reset button state
    submitBtn.classList.remove("loading");
    btnText.style.display = "inline";
    spinner.style.display = "none";
  }

  async downloadFile(downloadUrl, fileName) {
    try {
      this.showMessage("Download starting...", "success");
      
      // Fetch the file from the API
      const response = await fetch(`${this.API_BASE}${downloadUrl}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Convert response to blob
      const blob = await response.blob();
      
      // Create and trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(link.href);
      
      setTimeout(() => {
        this.showMessage("File download completed successfully! ✨", "success");
      }, 1000);
      
    } catch (error) {
      this.showMessage("Download failed. Please try again.", "error");
      console.error("Download error:", error);
    }
  }

  showMessage(text, type) {
    const msg = document.getElementById("message");
    msg.textContent = text;
    msg.className = `${type} show`;
    
    // Clear previous timeout
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    
    // Auto-hide success messages after 5 seconds
    if (type === "success") {
      this.messageTimeout = setTimeout(() => {
        msg.classList.remove("show");
      }, 5000);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.codeUnlockerInstance = new CodeUnlocker();
});

// Admin panel functionality - updated to use API
document.getElementById("adminIcon").addEventListener("click", () => {
  document.getElementById("adminModal").classList.add("show");
  document.getElementById("adminPassword").focus();
});

// Allow Enter key for admin password
document.getElementById("adminPassword").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkAdminPassword();
  }
});

async function checkAdminPassword() {
  const password = document.getElementById("adminPassword").value;
  const API_BASE = 'https://code-unlock-api.thanos.workers.dev';
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/codes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: password })
    });

    const result = await response.json();

    if (result.success) {
      document.getElementById("adminLogin").style.display = "none";
      document.getElementById("adminContent").style.display = "block";
      displayAllCodes(result.codes);
      document.getElementById("adminPassword").value = "";
    } else {
      alert("Incorrect password!");
      document.getElementById("adminPassword").value = "";
      document.getElementById("adminPassword").focus();
    }
  } catch (error) {
    console.error('Admin API error:', error);
    alert("Connection error. Please try again!");
  }
}

function displayAllCodes(codes) {
  const codesList = document.getElementById("codesList");
  codesList.innerHTML = "";
  
  Object.entries(codes).forEach(([code, file]) => {
    const codeItem = document.createElement("div");
    codeItem.className = "code-item";
    codeItem.innerHTML = `
      <div class="code">${code}</div>
      <div class="file">${file}</div>
    `;
    codesList.appendChild(codeItem);
  });
}

function closeAdminModal() {
  document.getElementById("adminModal").classList.remove("show");
  document.getElementById("adminLogin").style.display = "block";
  document.getElementById("adminContent").style.display = "none";
  document.getElementById("adminPassword").value = "";
}

// Close modal when clicking outside
document.getElementById("adminModal").addEventListener("click", (e) => {
  if (e.target.id === "adminModal") {
    closeAdminModal();
  }
});