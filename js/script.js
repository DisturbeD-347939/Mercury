setTimeout(displayPosts, 50);

//Function to display posts
function displayPosts()
{
    //If there are posts to display
    if(posts.length != 0 && posts[0] != 0)
    {
        //Reverse the order from newest to oldest
        posts[1] = posts[1].reverse();
        //Empty any posts that might be there already
        $("#posts").empty();
        for(var i = 0; i < posts[1].length; i++)
        {
            //Turn timestamp into milliseconds
            var date = new Date(posts[1][i].timestamp * 1000);
            //Set date to when post was created
            date = date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "." + date.getMonth()+1 + "." + date.getFullYear();

            //Check if it's the users profile or another user profile
            if(!searching)
            {
                $('#posts').append("<div id=" + posts[1][i].id + "><hr><h3>" + posts[1][i].title + "</h3><p>" + posts[1][i].content + "</p><p><small>" + date + "</small></p><button onclick='deletePost(" + posts[1][i].id + ")'>Delete post</button></div>");
            }
            else
            {
                $('#posts').append("<div id=" + posts[1][i].id + "><hr><h3>" + posts[1][i].title + "</h3><p>" + posts[1][i].content + "</p><p><small>" + date + "</small></p></div>");
            }
        }
    }
}

//Create new post AJAX request
$('#postFormProfile').submit(function(e)
{
    e.preventDefault();
    $.ajax
    ({
        type: "POST",
        url: "requests.php",
        data: $(this).serialize(),
        success: function(response)
        {
            var jsonResponse = JSON.parse(response);
            posts = jsonResponse["result"];
            displayPosts();
        }
    })
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