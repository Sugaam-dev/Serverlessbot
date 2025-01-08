$(function() {
  var INDEX = 0;

  // Error handling message configuration
  const ERROR_MESSAGE = {
    text: "System is under update, please try after sometime. Meanwhile, you can contact us at info@sugaam.in",
    duration: 5000 // Message display duration in milliseconds
  };

  // Function to display error message
  function showErrorMessage(error) {
    console.error('Chatbot Error:', error);
    
    // Create error message element if it doesn't exist
    if (!$('#chat-error-message').length) {
      $('body').append(`
        <div id="chat-error-message" style="display: none; position: fixed; top: 20px; right: 20px; 
          background-color: #ff5757; color: white; padding: 15px; border-radius: 5px; 
          box-shadow: 0 2px 5px rgba(0,0,0,0.2); max-width: 300px; z-index: 10000;">
          ${ERROR_MESSAGE.text}
        </div>
      `);
    }

    // Show error message with fade effect
    $('#chat-error-message')
      .fadeIn(300)
      .delay(ERROR_MESSAGE.duration)
      .fadeOut(300);

    // Disable chat input during error state
    $("#chat-input").attr("disabled", true);
    
    // Re-enable chat input after a delay
    setTimeout(() => {
      $("#chat-input").attr("disabled", false);
    }, ERROR_MESSAGE.duration);
  }

  // Enhanced sendMessageToBackend with better error handling
  async function sendMessageToBackend(message) {
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message }),
        timeout: 30000 // 30 second timeout
      });

      if (!response.ok) {
        throw new Error(`Network response error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from API');
      }

      const botMessage = data.choices[0].message.content.trim();
      generate_message(botMessage, 'bot');

    } catch (error) {
      showErrorMessage(error);
      generate_message("I apologize, but I'm having trouble processing your request right now.", 'bot');
    }
  }

  // Click event with error handling
  $("#chat-submit").click(function(e) {
    e.preventDefault();
    try {
      var msg = $("#chat-input").val();
      if (msg.trim() == '') {
        return false;
      }
      generate_message(msg, 'user');
      sendMessageToBackend(msg);
    } catch (error) {
      showErrorMessage(error);
    }
  });

  // Enhanced generate_message with error handling
  function generate_message(msg, type) {
    try {
      INDEX++;
      var str = "";
      str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
      
      if (type === 'user') {
        str += "  <span class=\"msg-avatar\">";
        str += "  </span>";
      }
      
      str += "  <div class=\"cm-msg-text\">";
      str += msg;
      str += "  </div>";
      str += "</div>";

      $(".chat-logs").append(str);
      $("#cm-msg-" + INDEX).hide().fadeIn(300);

      if (type == 'user') {
        $("#chat-input").val('');
      }

      $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    } catch (error) {
      showErrorMessage(error);
    }
  }

  // Enhanced generate_button_message with error handling
  function generate_button_message(msg, buttons) {
    try {
      INDEX++;
      var btn_obj = buttons.map(function(button) {
        return "              <li class=\"button\"><a href=\"javascript:;\" class=\"btn btn-primary chat-btn\" chat-value=\"" + button.value + "\">" + button.name + "<\/a><\/li>";
      }).join('');

      var str = "";
      str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg bot\">";
      str += "  <div class=\"cm-msg-text\">";
      str += msg;
      str += "  </div>";
      str += "  <div class=\"cm-msg-button\">";
      str += "    <ul>";
      str += btn_obj;
      str += "    </ul>";
      str += "  </div>";
      str += "</div>";

      $(".chat-logs").append(str);
      $("#cm-msg-" + INDEX).hide().fadeIn(300);
      $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
      $("#chat-input").attr("disabled", true);
    } catch (error) {
      showErrorMessage(error);
    }
  }

  // Button click handler with error handling
  $(document).delegate(".chat-btn", "click", function() {
    try {
      var value = $(this).attr("chat-value");
      var name = $(this).html();
      $("#chat-input").attr("disabled", false);
      generate_message(name, 'user');
    } catch (error) {
      showErrorMessage(error);
    }
  });

  function endSession() {
    try {
      $(".chat-logs").empty();
      $("#chat-input").val('');
      $("#chat-input").attr("disabled", true);
      INDEX = 0;
    } catch (error) {
      showErrorMessage(error);
    }
  }

  $("#chat-circle").click(function() {
    try {
      $("#chat-circle").toggle('scale');
      $(".chat-box").toggle('scale');
      startNewSession();
    } catch (error) {
      showErrorMessage(error);
    }
  });

  $(".chat-box-toggle").click(function() {
    try {
      $("#chat-circle").toggle('scale');
      $(".chat-box").toggle('scale');
      endSession();
    } catch (error) {
      showErrorMessage(error);
    }
  });

  function startNewSession() {
    try {
      $("#chat-input").attr("disabled", false);
    } catch (error) {
      showErrorMessage(error);
    }
  }
});