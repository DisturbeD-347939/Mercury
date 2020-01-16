setTimeout(run, 50);

//HEEEEEEEEEEEEEEEEEEEEEEEEEELP
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

function run()
{
    ids = JSON.parse(ids);
    parseIDs(ids, function(data)
    {
        request(data, function(data)
        {
            for(var i = 0; i < data["result"][0].length; i++)
            {
                var date = "null";
                if(data["result"][0][i]["timestamp"]) 
                {
                    //Turn timestamp into milliseconds
                    date = new Date(data["result"][0][i]["timestamp"] * 1000);
                    //Set date to when post was created
                    date = date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "." + date.getMonth()+1 + "." + date.getFullYear();
                }
                $('#feedPosts').append("<div id=" + data["result"][0][i]["id"] + "><hr><h3>" + data["result"][0][i]["title"] + "</h3><p>" + data["result"][0][i]["content"] + "</p><p><small>" + date + "</small></p></div>");
            }
        })
    })
    
}

function parseIDs(ids, callback)
{
    var data = "";
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

function displayPosts()
{
    console.log("Displaying");
}
