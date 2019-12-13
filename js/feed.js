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
                console.log(data["result"][0][i]);
                $('#feedPosts').append("<div id=" + data["result"][0][i]["id"] + "><hr><h3>" + data["result"][0][i]["title"] + "</h3><p>" + data["result"][0][i]["content"] + "</p></div>");
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
