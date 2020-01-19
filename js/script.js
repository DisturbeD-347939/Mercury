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

        request(posts[1][0].userID, function(data)
        {
            var tempArray = [];
            var timestamps = [];

            for(var i = 0; i < data[0]["result"][0].length; i++)
            {
                tempArray.push(data[0]["result"][0][i]["timestamp"]);

                //Turn timestamp into milliseconds
                var date = new Date(data[0]["result"][0][i]["timestamp"] * 1000);
                //Set date to when post was created
                date = date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "." + date.getMonth()+1 + "." +date.getFullYear();
                //Get names

                checkLikes(data[0]["result"][0][i]["id"]);
                
                tempArray.push("<div class='post userPost' id=" + data[0]["result"][0][i]["id"] + "><img src='" + data[2]["result"][0][1] + "'></img><h2>" +  data[1]["result"][0][0]["first_name"] + " " + data[1]["result"][0][0]["surname"] + "</h2><h3>" +data[0]["result"][0][i]["title"] + "</h3><p id='content'>" + data[0]["result"][0][i]["content"] + "</p><p><small>" + date + "</small></p><div onclick=like(" + data[0]["result"][0][i]["id"] + ")><img id='postLike' src='../images/dislike.png'></img><p>0</p></div><button onclick='deletePost(" + data[0]["result"][0][i]["id"] + ")'></button></div>");

                timestamps.push(tempArray);
                tempArray = [];
            }
            timestamps.reverse(timestamps.sort(sortFunction));
            for(var i = 0; i < timestamps.length; i++)
            {
                $('#posts').append(timestamps[i][1]);
            }
        });

        
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