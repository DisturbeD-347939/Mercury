setTimeout(run, 50);

//AJAX request to get posts from am user
function request(ids, callback)
{
    $.ajax
    ({
        type: 'GET',
        url: 'requests.php',
        contentType: 'application/json; charset=utf-8',
        data: {"getPosts":ids},
        dataType: 'json',
        success: function (response)
        {
            callback(response);
        },
        error: function ()
        {
            callback("fail");
        } 
    });
}

//Main function
function run()
{
    //Format ids
    ids = JSON.parse(ids);
    //Call parsing ids function
    parseIDs(ids, function(data)
    {
        //Request posts from userIDs
        request(data, function(data)
        {
            //Display all the posts
            for(var i = 0; i < data["result"][0].length; i++)
            {
                var date = "Error getting timestamps";
                if(data["result"][0][i]["timestamp"]) 
                {
                    //Turn timestamp into milliseconds
                    date = new Date(data["result"][0][i]["timestamp"] * 1000);
                    //Set date to when post was created
                    date = date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "." + date.getMonth()+1 + "." + date.getFullYear();
                }
                //Create posts
                $('#feedPosts').append("<div id=" + data["result"][0][i]["id"] + "><hr><h3>" + data["result"][0][i]["title"] + "</h3><p>" + data["result"][0][i]["content"] + "</p><p><small>" + date + "</small></p></div>");
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