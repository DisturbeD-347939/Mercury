setup();

function setup()
{
    $.ajax
    ({
        type: 'GET',
        url: 'requests.php',
        contentType: 'application/json; charset=utf-8',
        data: {"followerID":followerID, "userID":userID},
        dataType: 'json',
        success: function (response)
        {
            var responseJSON = JSON.parse(JSON.stringify(response));
            if(responseJSON["result"])
            {
                $('#followButton').html("Unfollow");
                $('#followButton').attr("onclick", "unfollow(" + userID + ")");
            }
            else
            {
                $('#followButton').html("Follow");
                $('#followButton').attr("onclick", "follow(" + userID + ")");
            }
        },
        error: function ()
        {
            console.log("Error occured");
        } 
    });
}

function follow()
{
    $.ajax
    ({
        type: 'GET',
        url: 'requests.php',
        contentType: 'application/json; charset=utf-8',
        data: {"follow":userID},
        dataType: 'json',
        success: function ()
        {
            $('#followButton').attr("onclick", "unfollow(" + userID + ")");
            $('#followButton').html("Unfollow");
        },
        error: function ()
        {
            console.log("Error occured");
        } 
    });
}
}