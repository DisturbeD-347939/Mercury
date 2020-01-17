setTimeout(run, 50);

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

/************************************FIX THIS************************************************/

    $.when(getPosts, getNames, getProfilePicture).done(function(a,b,c)
    {
        var data = [a[0], b[0], c[0]];
        callback(data);
    })
}

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
        }
    })
}

function sortFunction(a, b) 
{
    if (a[0] === b[0]) return 0;
    else return (a[0] < b[0]) ? -1 : 1;
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
                                tempArray.push("<div class='post' id=" + data[0]["result"][0][i]["id"] + "><image   src='" + data[2]["result"][k][1] + "'</image><h2>" + data[1]["result"][0][j]                                  ["first_name"] + " " + data[1]["result"][0][j]["surname"]  + "</h2><p><h3>" + data[0]["result"][0][i]["title"]                           + "</  h3><p id='content'>" + data[0]["result"][0][i]["content"] + "</p><p   id='date'><small>" + date + "</small></p></div>");

                                timestamps.push(tempArray);
                                tempArray = [];
                                //Create posts
                                /*$('#feedPosts').append("<div class='post' id=" + data[0]["result"][0][i]["id"] +  "><image src='" + data[2]["result"][k][1] + "'</image><h2>" + data[1]["result"][0]   [j]                               ["first_name"] + " " + data[1]["result"][0][j]   ["surname"] + "</h2><p><h3>" + data[0]["result"][0][i]["title"]                               + "</h3><p id='content'>" + data[0]["result"][0][i]["content"] + "</p><p     id='date'><small>" + date + "</small></p></div>");*/
                                break;
                            }
                        }
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
            var jsonResponse = JSON.parse(response);
            posts = jsonResponse["result"];
            displayPosts();
        }
    })
});