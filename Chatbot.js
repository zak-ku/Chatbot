const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// Handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Mosend ug message
async function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    // Ipakita ang mensahe sa user
    addMessage(text, "user");

    // mo limpyo sa inputbox
    userInput.value = "";
    
    // Disable input while processing
    userInput.disabled = true;
    document.querySelector('button').disabled = true;

    try {
        // Show typing indicator
        showTypingIndicator();
        
        // Send to API
        const response = await sendOpenAIRequest(text);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Show bot response
        addMessage(response, "bot");
    } catch (error) {
        // Remove typing indicator
        removeTypingIndicator();
        
        // Use fallback response
        const fallbackResponse = getFallbackResponse(text);
        addMessage(fallbackResponse, "bot");
        console.error('API Error:', error);
    }

    // Re-enable input
    userInput.disabled = false;
    document.querySelector('button').disabled = false;
    userInput.focus();
}

// Function para ipakita ang mga message
function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("message", sender);
    
    const span = document.createElement("span");
    
    // Check if text contains HTML tags
    if (text.includes('<') && text.includes('>')) {
        span.innerHTML = text;
    } else {
        span.textContent = sender === "user" ? "You: " + text : "Tech Support: " + text;
    }
    
    div.appendChild(span);
    chatBox.appendChild(div);

    // Auto scroll sa ubos
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const div = document.createElement("div");
    div.classList.add("message", "bot");
    div.id = "typing-indicator";
    
    const span = document.createElement("span");
    span.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    
    div.appendChild(span);
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById("typing-indicator");
    if (indicator) {
        indicator.remove();
    }
}

// Fallback responses for common computer issues
function getFallbackResponse(text) {
    const msg = text.toLowerCase();

    // Hardware issues
    if (msg.includes("won't turn on") || msg.includes("not starting") || msg.includes("no power")) {
        return "Let's troubleshoot power issues:\n1. Check if the power cable is properly connected\n2. Try a different power outlet\n3. Check the power supply unit\n4. Look for any LED indicators on the computer\n5. If laptop, try removing and reinserting the battery";
    }
    
    if (msg.includes("slow") || msg.includes("lag") || msg.includes("performance")) {
        return "To improve computer performance:\n1. Close unused programs\n2. Check Task Manager for resource-heavy processes\n3. Run disk cleanup\n4. Increase virtual memory\n5. Consider adding more RAM\n6. Scan for malware";
    }
    
    if (msg.includes("blue screen") || msg.includes("bsod") || msg.includes("crash")) {
        return "For blue screen errors:\n1. Note the error code displayed\n2. Boot in safe mode\n3. Update device drivers\n4. Run system file checker (sfc /scannow)\n5. Check for Windows updates\n6. Test RAM with Windows Memory Diagnostic";
    }
    
    // Network issues
    if (msg.includes("internet") || msg.includes("wifi") || msg.includes("network")) {
        return "Network troubleshooting steps:\n1. Restart your router and modem\n2. Check if other devices can connect\n3. Run network troubleshooter\n4. Update network drivers\n5. Reset TCP/IP stack (netsh winsock reset)\n6. Check firewall settings";
    }
    
    if (msg.includes("virus") || msg.includes("malware") || msg.includes("infected")) {
        return "Virus removal steps:\n1. Run a full system scan with your antivirus\n2. Use Malwarebytes for second opinion\n3. Boot in safe mode and scan\n4. Clear browser cache and cookies\n5. Consider system restore if recent infection";
    }
    
    if (msg.includes("printer") || msg.includes("print")) {
        return "Printer troubleshooting:\n1. Check if printer is powered on and connected\n2. Verify paper and ink levels\n3. Run printer troubleshooter\n4. Reinstall printer drivers\n5. Check print spooler service is running";
    }
    
    if (msg.includes("sound") || msg.includes("audio") || msg.includes("no sound")) {
        return "Audio issues:\n1. Check volume levels and mute settings\n2. Verify correct playback device is selected\n3. Update audio drivers\n4. Check audio cables and connections\n5. Run audio troubleshooter";
    }
    
    if (msg.includes("update") || msg.includes("windows update")) {
        return "Update problems:\n1. Run Windows Update troubleshooter\n2. Clear update cache\n3. Check disk space (need at least 20GB free)\n4. Temporarily disable antivirus\n5. Use Windows Update Assistant if needed";
    }

    // General responses
    if (msg.includes("hello") || msg.includes("hi")) return "Hello! I'm here to help with computer problems. What issue are you experiencing?";
    if (msg.includes("thank")) return "You're welcome! Let me know if you need help with anything else.";
    if (msg.includes("bye") || msg.includes("goodbye")) return "Goodbye! Feel free to return if you have more computer questions.";

    return "I understand you're having computer issues. Could you provide more specific details about the problem? For example:\n- What exactly is happening?\n- When did it start?\n- Are there any error messages?\n- What have you tried already?";
}