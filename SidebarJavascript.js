<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script>
  /**
   * Run initializations on sidebar load.
   */
  $(function() {
    $('#run').click(onRunClick);
    console.log("running");
  });

  /**
   * Calls the server to call NLP.
   * Replaces text in p tag in HTML.
   */
  function onRunClick() {
    this.disabled = true;
    
    console.log('Saving...');

    // calls NLP (in Code.gs, has access to current context and full document), in response displays what is returned
    google.script.run
        .withSuccessHandler(
          function(msg, element) {
            // Respond to success conditions here.
            url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyCGgRKJ-stCaaq5Dgof44eTEa4yCw71O2o&cx=b0477a31df647c8f5&num=3&q=" + msg
            
            async function logFetch(url) {
            console.log('in async');
            try {
                const response = await fetch(url);
                var text = await response.text();
                var json = JSON.parse(text);
                console.log(json.items);
                
                document.getElementById("tags").innerHTML = "";
                
                var messageArray = msg.split(" ");
                for (i = 0; i < messageArray.length; i++) {
                var para = document.createElement("LI");
                para.innerText = messageArray[i];
                para.style.color = '#528EF4';
                para.style.fontFamily = 'Allerta Stencil';
                document.getElementById("tags").appendChild(para);
                }
                
                $('#text1').text(json.items[0].snippet);
                $('#text1_link').text(json.items[0].formattedUrl);
                document.getElementById('text1_link').href = json.items[0].formattedUrl;
                
                $('#text2').text(json.items[1].snippet);
                $('#text2_link').text(json.items[1].formattedUrl);
                document.getElementById('text2_link').href = json.items[0].formattedUrl;
                
                $('#text3').text(json.items[2].snippet);
                $('#text3_link').text(json.items[2].formattedUrl);
                document.getElementById('text3_link').href = json.items[0].formattedUrl;
                
                element.disabled = false;
                console.log("complete");
            }
            catch (err) {
                  console.log('fetch failed', err);
                  }
            }
            
           logFetch(url);
          })
        .withFailureHandler(
          function(msg, element) {
            // Respond to failure conditions here.
            console.log(msg, element);
            element.disabled = false;
          })
        .withUserObject(this)
        .NLP();
  }


</script>




