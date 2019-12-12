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
    if(e.keyCode > 46)
    {
        var str = this.value;
        $("#hints").empty();
        var xmlhttp = new XMLHttpRequest();
        if(str.length == 0)
        {
            $("#txtHint").text = "";
            return;
        }
        else
        {
            xmlhttp.onreadystatechange = function() 
            {
                if (this.readyState == 4 && this.status == 200) 
                {
                    var hints = this.responseText.split(',');
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
                }
            };
            xmlhttp.open("GET", "requests.php?search=" + str, true);
            xmlhttp.send();
        }
    }
});

function deletePost(id)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { // Call a function when the state changes.
        if (this.readyState === xmlhttp.DONE && this.status === 200) 
        {
            $("#" + id).hide();
        }
    }
    xmlhttp.open("GET", "requests.php?del=" + id, true);
    xmlhttp.send();
}

function goToProfile(id)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { // Call a function when the state changes.
        if (this.readyState === xmlhttp.DONE && this.status === 200) 
        {
            window.location = "searchProfile.php";
        }
    }
    xmlhttp.open("GET", "requests.php?searchProfile=" + id, true);
    xmlhttp.send();
}

function follow(id)
{
    console.log("Following " + id);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { // Call a function when the state changes.
        if (this.readyState === xmlhttp.DONE && this.status === 200) 
        {
            $('#followButton').attr("onclick", "unfollow(" + id + ")");
            $('#followButton').html("Unfollow");
        }
    }
    xmlhttp.open("GET", "requests.php?follow=" + id, true);
    xmlhttp.send();
}

function unfollow(id)
{
    console.log("Unfollowing " + id);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { // Call a function when the state changes.
        if (this.readyState === xmlhttp.DONE && this.status === 200) 
        {
            $('#followButton').attr("onclick", "follow(" + id + ")");
            $('#followButton').html("Follow");
        }
    }
    xmlhttp.open("GET", "requests.php?unfollow=" + id, true);
    xmlhttp.send();
}