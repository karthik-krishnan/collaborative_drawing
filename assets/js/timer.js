// var seconds=10; 
// var int = window.setInterval("countdown()",1000);
// 
//       function countdown() 
//       { 
//          seconds--; 
//          var count = document.getElementById("timer"); 
//          count.innerHTML = seconds; 
//          if (seconds == 0) 
//          { 
//            window.clearInterval(int);
//            alert("Game Over");
//          } 
//       }

var seconds = 10;
function secondPassed() {
    var minutes = Math.round((seconds - 30)/60);
    var remainingSeconds = seconds % 60;
    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;  
    }
    document.getElementById('timer').innerHTML = minutes + ":" + remainingSeconds;
    if (seconds == 0) {
        clearInterval(countdownTimer);
        document.getElementById('timer').innerHTML = "Game Over";
        alert("Game Over!");
    } else {
        seconds--;
    }
    if (seconds < 5 ) {
    	timerStyle = document.getElementById('timer');
    	timerStyle.style.color = "red";
    }
}
 
var countdownTimer = setInterval('secondPassed()', 1000);