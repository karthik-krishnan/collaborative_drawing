var seconds=100; 
var int = window.setInterval("countdown()",1000);

      function countdown() 
      { 
         seconds--; 
         var count = document.getElementById("count"); 
         count.innerHTML = seconds; 
         if (seconds == 0) 
         { 
           window.clearInterval(int);
           //do what ever you want here
         } 
      }