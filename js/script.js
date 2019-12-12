setTimeout(displayPosts, 50);

function displayPosts()
{
    if(posts.length != 0 && posts[0] != 0)
    {
        posts[1] = posts[1].reverse();
        $("#posts").empty();
        for(var i = 0; i < posts[1].length; i++)
        {
            if(!searching)
            {
                $('#posts').append("<div id=" + posts[1][i].id + "><hr><h3>" + posts[1][i].title + "</h3><p>" + posts[1][i].content + "</p><button onclick='deletePost(" + posts[1][i].id + ")'>Delete post</button></div>");
            }
            else
            {
                $('#posts').append("<div id=" + posts[1][i].id + "><hr><h3>" + posts[1][i].title + "</h3><p>" + posts[1][i].content + "</p></div>");
            }
        }
    }
}

$('#postForm').submit(function(e)
{
    e.preventDefault();
    $.ajax
    ({
        type: "POST",
        url: "requests.php",
        data: $(this).serialize(),
        success: function(response)
        {
            console.log("here");
            var jsonResponse = JSON.parse(response);
            posts = jsonResponse["result"];
            displayPosts();
        }
    })
});

$('#searchBoxInput').on('keyup', function(e)
{
        
    var str = this.value;
    $("#hints").empty();
    //var xmlhttp = new XMLHttpRequest();
    if(str.length == 0)
    {
        $("#txtHint").text = "";
    }
    else
    {
        if(e.keyCode > 46)
        {
            $.ajax
            ({
                type: 'GET',
                url: 'requests.php',
                contentType: 'application/json; charset=utf-8',
                data: {"search":str},
                dataType: 'json',
                success: function (response)
                {
                    var hints = response["hint"].split(',');
                    for(var i = 0; i < hints.length; i++)
                    {
                        var splitHint = hints[i].split(" ");
                        //Removes bugged space
                        if(splitHint.length > 4)
                        {
                            splitHint.splice(0,1);
                        }
                        if(splitHint[0])
                        {
                            $('#hints').append("<div id=" + splitHint[3] + " class='searches' onclick='goToProfile(this.id)' <p>" + splitHint[0] + " " + splitHint[1] + "</p><p>" + splitHint[2] + "</p>");
                        }
                    }
                    if(!$('#hints > div').length)
                    {
                        $('#hints').append("<div class='searches'><p>No profiles found...</p></div>")
                    }
                },
                error: function ()
                {
                    console.log("Error occured");
                } 
            });
        }
    }
});

function deletePost(id)
{
    $.ajax
    ({
        type: 'GET',
        url: 'requests.php',
        contentType: 'application/json; charset=utf-8',
        data: {"del":id},
        dataType: 'json',
        success: function ()
        {
            $("#" + id).hide();
        },
        error: function ()
        {
            console.log("Error occured");
        } 
    });
}

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
            console.log("Error occured");
        } 
    });
}