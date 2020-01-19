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
            $('#' + id + '> div > img').attr("src", "../images/like.png");
            $('#' + id + '> div').attr("onclick", "dislike(" + id + ")");
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
            $('#' + id + '> div > img').attr("src", "../images/dislike.png");
            $('#' + id + '> div').attr("onclick", "like(" + id + ")");
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
                $('#' + postID + '> div > p').text(response['result'][0].length);
                for(var i = 0; i < response['result'][0].length; i++)
                {
                    if(response['result'][0][i]["likeID"] == profileID)
                    {
                        $('#' + postID + '> div > img').attr("src", "../images/like.png");
                        $('#' + postID + '> div').attr("onclick", "dislike(" + postID + ")");
                    }
                }
            }
            else
            {
                $('#' + postID + '> div > img').attr("src", "../images/dislike.png");
                $('#' + postID + '> div > p').text("0");
                $('#' + postID + '> div').attr("onclick", "like(" + postID + ")");
            }
        }
    })
}

function sortFunction(a, b) 
{
    if (a[0] === b[0]) return 0;
    else return (a[0] < b[0]) ? -1 : 1;
}