var tempArray = [];
var timestamps = [];

//AJAX request to get posts from am user
function request(ids, callback)
{
    console.log(ids);
    var getPosts = $.ajax
    ({
        type: 'GET',
        url: 'requests.php',
        contentType: 'application/json; charset=utf-8',
        data: {"getPosts":ids},
        dataType: 'json'
    });
    var getNames = $.ajax
    ({
        type: 'GET',
        url: 'requests.php',
        contentType: 'application/json; charset=utf-8',
        data: {"getNames":ids},
        dataType: 'json'
    }); 
    var getProfilePicture = $.ajax
    ({
        type: 'GET',
        url: 'requests.php',
        contentType: 'application/json; charset=utf-8',
        data: {"getProfilePic":ids},
        dataType: 'json'
    })

    $.when(getPosts, getNames, getProfilePicture).done(function(a,b,c)
    {
        var data = [a[0], b[0], c[0]];
        callback(data);
    })
}


function createPost(data, callback)
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
                            tempArray.push("<div class='post' id=" + data[0]["result"][0][i]["id"] + "><img class='profilePic' src='" + data[2]["result"][k][1] + "'</img><h2><div onclick=goToProfile(" + data[1]["result"][0][j]["id"] + ")>" + data[1]["result"][0][j]["first_name"] + " " + data[1]["result"][0][j]["surname"]  + "</div></h2><h3>" + escapeHtml(data[0]["result"][0][i]["title"]) + "</h3><p class='content'>" + escapeHtml(data[0]["result"][0][i]["content"]) + "</p><p class='date'><small>" + date + "</small></p><img class='postPic'><div class='like postButtons' onclick=like(" + data[0]["result"][0][i]["id"] + ")><img class='postLike' src='../images/dislike.png'></img><p>0</p></div><div class='comments postButtons' onclick=showComments(" + data[0]["result"][0][i]["id"] + ")><img class='hiddenComments' src='../images/hiddenComments.png'></img><p>0</p></div><button onclick='deletePost(" + data[0]["result"][0][i]["id"] + ")'></button><div class='commentBox'></div></div>");
                        }
                        else
                        {
                            tempArray.push("<div class='post' id=" + data[0]["result"][0][i]["id"] + "><img class='profilePic' src='" + data[2]["result"][k][1] + "'</img><h2><div onclick=goToProfile(" + data[1]["result"][0][j]["id"] + ")>" + data[1]["result"][0][j]["first_name"] + " " + data[1]["result"][0][j]["surname"]  + "</div></h2><h3>" + escapeHtml(data[0]["result"][0][i]["title"]) + "</h3><p class='content'>" + escapeHtml(data[0]["result"][0][i]["content"]) + "</p><p class='date'><small>" + date + "</small></p><img class='postPic'><div class='like postButtons' onclick=like(" + data[0]["result"][0][i]["id"] + ")><img class='postLike' src='../images/dislike.png'></img><p>0</p></div><div class='comments postButtons' onclick=showComments(" + data[0]["result"][0][i]["id"] + ")><img class='hiddenComments' src='../images/hiddenComments.png'></img><p>0</p></div><div class='commentBox'></div></div>");
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
}
/******************************************************** LIKES ***************************************************/
function like(id)
{
    console.log("Liked " + id);
    $.ajax
    ({
        type: "POST",
        url: "requests.php",
        data: {"postID": id, "likeID": profileID, "delete": 0},
        success: function(response)
        {
            $('#' + id + '> .like > img').attr("src", "../images/like.png");
            $('#' + id + '> .like').attr("onclick", "dislike(" + id + ")");
            checkLikes(id);
        }
    })
}

function dislike(id)
{
    console.log("Disliked " + id);
    $.ajax
    ({
        type: "POST",
        url: "requests.php",
        data: {"postID": id, "likeID": profileID, "delete": 1},
        success: function(response)
        {
            $('#' + id + '> .like > img').attr("src", "../images/dislike.png");
            $('#' + id + '> .like').attr("onclick", "like(" + id + ")");
            checkLikes(id);
        }
    })
}

function checkLikes(postID)
{
    $.ajax
    ({
        type: "POST",
        url: "requests.php",
        data: {"getLikes": postID},
        success: function(response)
        {
            response = JSON.parse(response);
            if(response['result'][0].length > 0)
            {
                $('#' + postID + '> .like > p').text(response['result'][0].length);
                for(var i = 0; i < response['result'][0].length; i++)
                {
                    if(response['result'][0][i]["likeID"] == profileID)
                    {
                        $('#' + postID + '> .like > img').attr("src", "../images/like.png");
                        $('#' + postID + '> .like').attr("onclick", "dislike(" + postID + ")");
                    }
                }
            }
            else
            {
                $('#' + postID + '> .like > img').attr("src", "../images/dislike.png");
                $('#' + postID + '> .like > p').text("0");
                $('#' + postID + '> .like').attr("onclick", "like(" + postID + ")");
            }
        }
    })
}

/******************************************************** COMMENTS ***************************************************/

function checkComments(postID)
{
    $.ajax
    ({
        type: "POST",
        url: "requests.php",
        data: {"getCommentsCount": postID},
        success: function(response)
        {
            response = JSON.parse(response);
            if(response["result"][0][0]["COUNT(id)"] >= 1)
            {
                $('#' + postID + '> .comments > p').text(response["result"][0][0]["COUNT(id)"]);
            }
            else
            {
                $('#' + postID + '> .comments > p').text("0");
            }
        }
    })
}

function showComments(postID)
{
    $.ajax
    ({
        type: "POST",
        url: "requests.php",
        data: {"getComments": postID},
        success: function(comments)
        {
            comments = JSON.parse(comments);
            comments = comments["result"][0];
            $('#' + postID + '> .like').css("border-bottom", "0px");
            $('#' + postID + '> .comments').css("border-bottom", "0px");
            $('#' + postID + ' > .commentBox').css("border-top", "1px solid #DADDE1");
            $('#' + postID + '> .comments').attr("onclick", "hideComments(" + postID + ")");
            $('#' + postID + '> .comments > .hiddenComments').attr("src", "../images/showComments.png");
            if(comments.length > 0)
            {
                for(var i = 0; i < comments.length; i++)
                { 
                    $.ajax
                    ({
                        type: "POST",
                        url: "requests.php",
                        data: {"getPostNames": comments[i]["userID"], "i":i},
                        success: function(names)
                        {
                            names = JSON.parse(names);
                            names = names["result"];
                            counter = parseInt(names[1]);

                            //Turn timestamp into milliseconds
                            var date = new Date(comments[counter]["timestamp"] * 1000);
                            //Set date to when post was created
                            date = date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "." + date.getMonth()+1 + "." +date.getFullYear();

                            if(comments[counter]["userID"] == profileID)
                            {
                                $('#' + postID + ' > .commentBox').append("<div class='comment id='" + comments[counter]["id"] + "'><div><img src='../Users/" + comments[counter]["userID"] + "/profilePicture.png'></img><p onclick='goToProfile(" + comments[counter]["userID"] + ")'>" + names[0][0]["first_name"] + " " + names[0][0]["surname"] + "</p></div><div><p>" + comments[counter]["comment"] + "</p><p>" + date + "</p></div><button onclick='deleteComment(" + comments[counter]["id"] + "," + postID + ")'></button></div>");
                            }
                            else
                            {
                                $('#' + postID + ' > .commentBox').append("<div class='comment' id='" + comments[counter]["id"] + "'><div><img src='../Users/" + comments[counter]["userID"] + "/profilePicture.png'></img><p onclick='goToProfile(" + comments[counter]["userID"] + ")'>" + names[0][0]["first_name"] + " " + names[0][0]["surname"] + "</p></div><div><p>" + comments[counter]["comment"] + "</p><p>" + date + "</p></div></div>");
                            }
                                
                            if($('#' + postID + ' > .commentBox > div').length == (comments.length))
                            {
                                var form = "<form method='post'><textarea name='text' required></textarea><input type='submit' value='Comment'></form>";

                                //$('#' + postID + ' > .commentBox > form > ')
                                $('#' + postID + ' > .commentBox').append(form);

                                //Create new post AJAX request
                                $('#' + postID + ' > .commentBox > form').submit(function(e)
                                {
                                    e.preventDefault();
                                    $.ajax
                                    ({
                                        type: "POST",
                                        url: "requests.php",
                                        data: {"form": $(this)[0][0]["value"], "id": postID},
                                        success: function(response)
                                        {
                                            $('#' + postID + ' > .commentBox').empty();
                                            showComments(postID);
                                            checkComments(postID);
                                        }
                                    })
                                });
                            }
                        }
                    })
                }
            }
            //No comments
            else
            {
                var form = "<form method='post'><textarea name='text' required></textarea><input type='submit' value='Comment'></form>";
                $('#' + postID + ' > .commentBox').append(form);

                $('#' + postID + ' > .commentBox > form').submit(function(e)
                {
                    e.preventDefault();
                    $.ajax
                    ({
                        type: "POST",
                        url: "requests.php",
                        data: {"form": $(this)[0][0]["value"], "id": postID},
                        success: function(response)
                        {
                            $('#' + postID + ' > .commentBox').empty();
                            showComments(postID);
                        }
                    })
                });
            }
        }
    })
}

function deleteComment(id, postID)
{
    $.ajax
    ({
        type: 'GET',
        url: 'requests.php',
        contentType: 'application/json; charset=utf-8',
        data: {"del":id, "post": 0},
        dataType: 'json',
        success: function ()
        {
            $('#' + postID + ' > .commentBox').empty();
            showComments(postID);
            checkComments(postID);
        },
        error: function ()
        {
            console.log("Error occured");
        } 
    });
}

function hideComments(postID)
{
    $('#' + postID + '> .like').css("border-bottom", "1px solid #DADDE1");
    $('#' + postID + '> .comments').css("border-bottom", "1px solid #DADDE1");
    $('#' + postID + ' > .commentBox').css("border-top", "0px");
    $('#' + postID + '> .comments').attr("onclick", "showComments(" + postID + ")");
    $('.hiddenComments').attr("src", "../images/hiddenComments.png");
    $('#' + postID + ' > .commentBox').empty();
}

/******************************************************** HASHTAGS ***************************************************/

//Turn text into hashtags
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

function checkHashtags()
{
    $.ajax
    ({
        type: "GET",
        url: "requests.php",
        data: {"getLastTextID": profileID},
        success: function(response)
        {
            response = JSON.parse(response);
            response = response["result"][0][0]["MAX(id)"];
            $.ajax
            ({
                type: "GET",
                url: "requests.php",
                data: {"getLastText": response},
                success: function(response)
                {
                    response = JSON.parse(response);
                    response = response["result"][0][0];
                    var hashtag = "";
                    for(var j = 0; j <= response["title"].length; j++)
                    {
                        if(response["title"][j] == "#")
                        {
                            if(hashtag != "")
                            {
                                hashtag += " ";
                            }
                            while(response["title"][j] != " " && response["title"][j] != "\n" && response["title"].length > j && response["title"][j] != "undefined")
                            { 
                                hashtag += response["title"][j];
                                j++;
                            }
                        }
                        if(response["title"].length == j && hashtag != "")
                        {
                            if(hashtag[hashtag.length-1] == " ") hashtag = hashtag.substring(0, hashtag.length - 1);
                            console.log(hashtag + " | " + response["id"]);
                            $.ajax
                            ({
                                type: "POST",
                                url: "requests.php",
                                data: {"hashtag": hashtag, "id": response["id"]},
                                success: function(response)
                                {
                                    console.log(response);
                                }
                            })
                        }
                    }
                }
            })
        }
    })
}

/******************************************************** MISCELLANEOUS ***************************************************/



function checkPhotos(postID)
{
    $.ajax
    ({
        type: "POST",
        url: "requests.php",
        data: {"getPhoto": postID},
        success: function(response)
        {
            if(response == 1)
            {
                $('#' + postID + '> .postPic').attr("src", "../posts/" + postID + ".png");
            }
            else
            {
                $('#' + postID + '> .postPic').hide();
            }
        }
    })
}

function sortFunction(a, b) 
{
    if (a[0] === b[0]) return 0;
    else return (a[0] < b[0]) ? -1 : 1;
}

function deletePost(id)
{
    $.ajax
    ({
        type: 'GET',
        url: 'requests.php',
        contentType: 'application/json; charset=utf-8',
        data: {"del":id, "post": 1},
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