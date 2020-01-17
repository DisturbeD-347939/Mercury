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
        console.log(c[0]["result"][0]);
        callback(data);
    })
}

//Main function
function run()
{
    //Format ids
    ids = JSON.parse(ids);
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
                    //Turn timestamp into milliseconds
                    date = new Date(data[0]["result"][0][i]["timestamp"] * 1000);
                    //Set date to when post was created
                    date = date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "." + date.getMonth()+1 + "." + date.getFullYear();
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
                                //Create posts
                                $('#feedPosts').append("<div class='post' id=" + data[0]["result"][0][i]["id"] + "><image src='" + data[2]["result"][k][1] + "'</image><h2>" + data[1]["result"][0][j]                               ["first_name"] + " " + data[1]["result"][0][j]["surname"] + "</h2><p><h3>" + data[0]["result"][0][i]["title"]                           + "</h3><p id='content'>" + data[0]["result"][0][i]["content"] + "</p><p id='date'><small>" + date + "</small></p></div>");
                                break;
                            }
                        }
                    }
                }
            }
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
