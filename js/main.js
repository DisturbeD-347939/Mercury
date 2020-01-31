function goToProfile(id)
{
    $.ajax
    ({
        type: 'GET',
        url: 'requests.php',
        contentType: 'application/json; charset=utf-8',
        data: {"searchProfile":id},
        dataType: 'json',
        success: function ()
        {
            window.location = "../php/searchProfile.php";
        },
        error: function ()
        {
            window.location = "../php/profile.php";
        } 
    });
}

function searchTag(tag)
{
    $.ajax
    ({
        type: 'GET',
        url: 'requests.php',
        contentType: 'application/json; charset=utf-8',
        data: {"searchTag":tag},
        dataType: 'json',
        success: function (response)
        {
            window.location = "../php/searchTag.php";
        },
        error: function (response)
        {
            window.location = "../php/profile.php";
        } 
    });
}

//Search bar function
$('#searchBoxInput').on('keyup', function(e)
{
    var str = this.value;
    $("#hints").empty();
    if(str.length == 0)
    {
        $("#txtHint").text = "";
    }
    else
    {
        if(e.keyCode > 46) //Excludes unnecessary characters
        {
            $.ajax //AJAX request to get results from search
            ({
                type: 'GET',
                url: 'requests.php',
                contentType: 'application/json; charset=utf-8',
                data: {"search":str},
                dataType: 'json',
                success: function (response)
                {
                    var hints = response["hint"].split(',');
                    for(var i = 0; i < hints.length; i++) //Display results
                    {
                        //Split info with spaces
                        var splitHint = hints[i].split(" ");
                        //Removes bugged space
                        if(splitHint.length > 4)
                        {
                            splitHint.splice(0,1);
                        }

                        if(splitHint[0]) //If there is info, display search
                        {
                            $('#hints').append("<div id=" + splitHint[3] + " class='searches' onclick='goToProfile(this.id)'><img src='../Users/" + splitHint[3] + "/profilePicture.png'></img><div><p>" + splitHint[0] + " " + splitHint[1] + "</p><p>" + splitHint[2] + "</p></div>");
                        }
                    }
                    //If nothing was found display error messsage
                    if(!$('#hints > div').length)
                    {
                        $('#hints').append("<div class='searches'><p>No profiles found...</p></div>")
                    }
                },
                error: function (err)
                {
                    console.log(err);
                    console.log("Error occured");
                } 
            });
        }
    }
});

function escapeHtml(text) 
{
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
  
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

//Create new post AJAX request
$('#postFormPost').submit(function(e)
{
    e.preventDefault();
    $.ajax
    ({
        type: "POST",
        url: "requests.php",
        data: $(this).serialize(),
        success: function(response)
        {
            checkHashtags();
            var jsonResponse = JSON.parse(response);
            posts = jsonResponse["result"];

            var fileID = jsonResponse["result"][1][jsonResponse["result"][1].length-1]["id"];

            if($('#postPic').val() != "")
            {
                var file_data = $('#postPic').prop('files')[0];
                var form_data = new FormData();                  
                form_data.append('file', file_data);
                form_data.append('id', fileID);
                $.ajax
                ({
                    url: 'uploadPostPic.php', // point to server-side PHP script 
                    dataType: 'text',  // what to expect back from the PHP script, if anything
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,                         
                    type: 'post',
                    success: function(data)
                    {
                        displayPosts();
                    }
                });
            }
            else
            {
                displayPosts();
            }
        }
    })
});