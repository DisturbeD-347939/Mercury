setTimeout(run, 50);

//Main function
function run()
{
    //Format ids
    ids = JSON.parse(ids);
    
    var tempArray = {userID: profileID.toString()};
    ids.push(tempArray);

    buildPosts(function(timestamps)
    {
        timestamps.reverse(timestamps.sort(sortFunction));
        for(var i = 0; i < timestamps.length; i++)
        {
            $('#feedPosts').append(timestamps[i][1]);

            var titleContent = $('#feedPosts > div').last().children('h3').text();
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
                        //console.log(hashtag);
                        j++;
                    }
                }
                //console.log(titleContent.length + " | " + j);
                if(titleContent.length == j && hashtag != "")
                {
                    j = 9999;
                    console.log("Got hashtag -> " + hashtag);
                    if(hashtag[hashtag.length-1] == " ") hashtag = hashtag.substring(0, hashtag.length - 1);
                    if(hashtag.indexOf(" ") >= 0)
                    {
                        var hashtags = hashtag.split(" ");
                        for(var k = 0; k < hashtags.length; k++)
                        {
                            titleContent = titleContent.replace(hashtags[k], "<span onclick=searchTag('" + hashtags[k] + "')><mark>" + hashtags[k] + "</mark></span>");
                            $('#feedPosts > div').last().children('h3').html(titleContent);
                        }
                    }
                    else
                    {
                        titleContent = titleContent.replace(hashtag, "<span onclick=searchTag('" + hashtag + "')><mark>" + hashtag + "</mark></span>");
                        $('#feedPosts > div').last().children('h3').html(titleContent);
                    }
                    hashtag = "";
                }
            }
        }
    })
}

function buildPosts(callback)
{
    //Variables
    var timestamps = [];
    var tempArray = [];

    //Call parsing ids function
    parseIDs(ids, function(parsed)
    {
        //Request posts from userIDs
        request(parsed, function(data)
        {
            //Get timestamps
            for(var i = 0; i < data[0]["result"][0].length; i++)
            {
                var date = "Error getting timestamps";
                if(data[0]["result"][0][i]["timestamp"]) 
                {
                    tempArray.push(data[0]["result"][0][i]["timestamp"]);
                    //Turn timestamp into milliseconds
                    date = new Date(data[0]["result"][0][i]["timestamp"] * 1000);
                    //Set date to when post was created
                    date = date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "." + date.getMonth() +1 + "." + date.getFullYear();
                }

                //Get names
                for(var j = 0; j < data[1]["result"][0].length; j++)
                {
                    if(data[1]["result"][0][j]["id"] == data[0]["result"][0][i]["userID"])
                    {
                        //Get profile pictures
                        for(var k = 0; k < data[2]["result"].length; k++)
                        {
                            if(data[2]["result"][k][0] == data[1]["result"][0][j]["id"])
                            {
                                checkLikes(data[0]["result"][0][i]["id"]);
                                checkPhotos(data[0]["result"][0][i]["id"]);
                                checkComments(data[0]["result"][0][i]["id"]);
                                
                                if(data[0]["result"][0][i]["userID"] == profileID)
                                {
                                    tempArray.push("<div class='post' id=" + data[0]["result"][0][i]["id"] + "><img class='profilePic' src='" + data[2]["result"][k][1] + "'</img><h2><div onclick=goToProfile(" + data[1]["result"][0][j]["id"] + ")>" + data[1]["result"][0][j]["first_name"] + " " + data[1]["result"][0][j]["surname"]  + "</div></h2><h3>" + data[0]["result"][0][i]["title"]+ "</h3><p class='content'>" + data[0]["result"][0][i]["content"] + "</p><p class='date'><small>" + date + "</small></p><img class='postPic'><div class='like postButtons' onclick=like(" + data[0]["result"][0][i]["id"] + ")><img class='postLike' src='../images/dislike.png'></img><p>0</p></div><div class='comments postButtons' onclick=showComments(" + data[0]["result"][0][i]["id"] + ")><img class='hiddenComments' src='../images/hiddenComments.png'></img><p>0</p></div><button onclick='deletePost(" + data[0]["result"][0][i]["id"] + ")'></button><div class='commentBox'></div></div>");
                                }
                                else
                                {
                                    tempArray.push("<div class='post' id=" + data[0]["result"][0][i]["id"] + "><img class='profilePic' src='" + data[2]["result"][k][1] + "'</img><h2><div onclick=goToProfile(" + data[1]["result"][0][j]["id"] + ")>" + data[1]["result"][0][j]["first_name"] + " " + data[1]["result"][0][j]["surname"]  + "</div></h2><h3>" + data[0]["result"][0][i]["title"]+ "</h3><p class='content'>" + data[0]["result"][0][i]["content"] + "</p><p class='date'><small>" + date + "</small></p><img class='postPic'><div class='like postButtons' onclick=like(" + data[0]["result"][0][i]["id"] + ")><img class='postLike' src='../images/dislike.png'></img><p>0</p></div><div class='comments postButtons' onclick=showComments(" + data[0]["result"][0][i]["id"] + ")><img class='hiddenComments' src='../images/hiddenComments.png'></img><p>0</p></div><div class='commentBox'></div></div>");
                                }
                                

                                //Push it into the finished array and delete everythingfrom the temp one
                                timestamps.push(tempArray);
                                tempArray = [];
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            callback(timestamps);
        })
    })
}

//Get all userID's
function parseIDs(ids, callback)
{
    var data = "";
    //Prepare ids for a query
    for(var i = 0; i < ids.length; i++)
    {
        if(i+1 == ids.length)
        {
            data += ids[i]["userID"];
        }
        else
        {
            data += ids[i]["userID"] + ",";
        }
    }
    callback(data);
}

//Create new post AJAX request
$('#postFormFeed').submit(function(e)
{
    e.preventDefault();
    $.ajax
    ({
        type: "POST",
        url: "requests.php",
        data: $(this).serialize(),
        success: function(response)
        {
            $('#feedPosts').empty();
            buildPosts(function(timestamps)
            {
                timestamps.reverse(timestamps.sort(sortFunction));
                for(var i = 0; i < timestamps.length; i++)
                {
                    $('#feedPosts').append(timestamps[i][1]);
                }
            })
        }
    })
});