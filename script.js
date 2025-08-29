// Enhanced code with better UX and case-insensitive support
class CodeUnlocker {
  constructor() {
    this.codes = {
	  "idon'tknow": "files/science_t3_ct.docx",
	  "carrotr1": "files/granola_recipe_card.xlsx",
	  "idoknow": "files/ancient_egypt_slides.pptx",
	  "cool": "files/nothing.jpg",
	  "bombaclat": "files/out.zip",
	  "69lorakeet": "files/Augie.HEIC"
	}
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
    const input = document.getElementById("codeInput").value.trim().toLowerCase(); // Case insensitive
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

    // Simulate processing time for better UX
    setTimeout(() => {
      const fileUrl = this.codes[input];
      
      if (fileUrl) {
        this.downloadFile(fileUrl);
        document.getElementById("codeInput").value = ""; // Clear input
      } else {
        this.showMessage("Invalid code. Please try again!", "error");
      }
      
      // Reset button state
      submitBtn.classList.remove("loading");
      btnText.style.display = "inline";
      spinner.style.display = "none";
    }, 800);
  }

  downloadFile(url) {
    try {
      this.showMessage("Download starting...", "success");
      
      // Create and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        this.showMessage("File download initiated successfully! ✨", "success");
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

// Admin panel functionality
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

function checkAdminPassword() {
  const password = document.getElementById("adminPassword").value;
  if (password === "admin") {
    document.getElementById("adminLogin").style.display = "none";
    document.getElementById("adminContent").style.display = "block";
    displayAllCodes();
    document.getElementById("adminPassword").value = "";
  } else {
    alert("Incorrect password!");
    document.getElementById("adminPassword").value = "";
    document.getElementById("adminPassword").focus();
  }
}

function displayAllCodes() {
  const codesList = document.getElementById("codesList");
  // Get the codes from the actual CodeUnlocker instance
  const codes = window.codeUnlockerInstance.codes;

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