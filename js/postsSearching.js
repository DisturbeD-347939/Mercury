setTimeout(displayPosts, 50);

//Function to display posts
function displayPosts()
{
    //If there are posts to display
    if(posts != null)
    {
        console.log(posts);
        if(posts.length != 0 && posts[0] != 0 && posts.length != null)
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
                    checkPhotos(data[0]["result"][0][i]["id"]);
                    checkComments(data[0]["result"][0][i]["id"]);
                    
                    
                    if(!searching)
                    {
                        tempArray.push("<div class='post userPost' id=" + data[0]["result"][0][i]["id"] + "><img class='profilePic' src='" + data[2]["result"][0][1] + "'></img><h2>" +  data[1]["result"][0][0]["first_name"] + " " + data[1]["result"][0][0]["surname"] + "</h2><h3>" + escapeHtml(data[0]["result"][0][i]["title"]) + "</h3><p class='content'>" + escapeHtml(data[0]["result"][0][i]["content"]) + "</p><p class='date'><small>" + date + "</small></p><img class='postPic'><div class='like postButtons' onclick=like(" + data[0]["result"][0][i]["id"] + ")></img><img class='postLike' src='../images/dislike.png'></img><p>0</p></div><div class='comments postButtons' onclick=showComments(" + data[0]["result"][0][i]["id"] + ")><img class='hiddenComments' src='../images/hiddenComments.png'></img><p>0</p></div><button onclick='deletePost(" + data[0]["result"][0][i]["id"] + ")'></button><div class='commentBox'></div></div>");
                    }
                    else
                    {
                        tempArray.push("<div class='post userPost' id=" + data[0]["result"][0][i]["id"] + "><img class='profilePic' src='" + data[2]["result"][0][1] + "'></img><h2>" +  data[1]["result"][0][0]["first_name"] + " " + data[1]["result"][0][0]["surname"] + "</h2><h3>" + escapeHtml(data[0]["result"][0][i]["title"]) + "</h3><p class='content'>" + escapeHtml(data[0]["result"][0][i]["content"]) + "</p><p class='date'><small>" + date + "</small></p><img class='postPic'><div class='like postButtons' onclick=like(" + data[0]["result"][0][i]["id"] + ")><img class='postLike' src='../images/dislike.png'></img><p>0</p></div><div class='comments postButtons' onclick=showComments(" + data[0]["result"][0][i]["id"] + ")><img class='hiddenComments' src='../images/hiddenComments.png'></img><p>0</p></div><div class='commentBox'></div></div>");
                    }
    
                    timestamps.push(tempArray);
                    tempArray = [];
                }
                timestamps.reverse(timestamps.sort(sortFunction));
                for(var i = 0; i < timestamps.length; i++)
                {
                    $('#posts').append(timestamps[i][1]);
                    hashtagIt('.userPost');
                }
            });
        }
    }
    
}

