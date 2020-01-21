//AJAX request to get posts from am user
function request(ids, callback)
{
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
                console.log(response["result"][0][0]["COUNT(id)"]);
                $('#' + postID + '> .comments > p').text(response["result"][0][0]["COUNT(id)"]);
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
            if(comments.length > 0)
            {
                $('#' + postID + '> .like').css("border-bottom", "0px");
                $('#' + postID + '> .comments').css("border-bottom", "0px");
                $('#' + postID + ' > .commentBox').css("border-top", "1px solid #DADDE1");
                $('#' + postID + '> .comments').attr("onclick", "hideComments(" + postID + ")");
                $('#' + postID + '> .comments > .hiddenComments').attr("src", "../images/showComments.png");
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

                            $('#' + postID + ' > .commentBox').append("<div class='comment'><div><img src='../Users/" + comments[counter]["userID"] + "/profilePicture.png'></img><p onclick='goToProfile(" + comments[counter]["userID"] + ")'>" + names[0][0]["first_name"] + " " + names[0][0]["surname"] + "</p></div><div><p>" + comments[counter]["comment"] + "</p><p>" + date + "</p></div></div>");

                            
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
                                        }
                                    })
                                });
                            }
                        }
                    })
                }
            }
        }
    })
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