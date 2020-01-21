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
});//Turn text into hashtags
function hashtagIt(location)
{
    var titleContent = $(location).last().children('h3').text();
    if(titleContent[titleContent.length-1] == " ") titleContent = titleContent.substring(0, titleContent.length - 1);
    var hashtag = "";
    for(var j = 0; j <= titleContent.length; j++)
    {
        if(titleContent[j] == "#")
        {
            if(hashtag != "")
            {
                hashtag += " ";
            }
            while(titleContent[j] != " " && titleContent[j] != "\n" && titleContent.length > j && titleContent[j] != "undefined")
            { 
                hashtag += titleContent[j];
                j++;
            }
        }
        if(titleContent.length == j && hashtag != "")
        {
            j = 9999;
            if(hashtag[hashtag.length-1] == " ") hashtag = hashtag.substring(0, hashtag.length - 1);
            if(hashtag.indexOf(" ") >= 0)
            {
                var hashtags = hashtag.split(" ");
                for(var k = 0; k < hashtags.length; k++)
                {
                    titleContent = titleContent.replace(hashtags[k], "<span onclick=searchTag('" + hashtags[k] + "')><mark>" + hashtags[k] + "</mark></span>");
                    $(location).last().children('h3').html(titleContent);
                }
            }
            else
            {
                titleContent = titleContent.replace(hashtag, "<span onclick=searchTag('" + hashtag + "')><mark>" + hashtag + "</mark></span>");
                $(location).last().children('h3').html(titleContent);
            }
            hashtag = "";
        }
    }
}