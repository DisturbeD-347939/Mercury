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
            hashtagIt('#feedPosts > div');
        }
    })
}

function buildPosts(callback)
{
    //Variables
    timestamps = [];
    tempArray = [];

    //Call parsing ids function
    parseIDs(ids, function(parsed)
    {
        //Request posts from userIDs
        request(parsed, function(data)
        {
            console.log(data);
            createPost(data, function(timestamps)
            {
                callback(timestamps);
            })
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
/*$('#postFormFeed').submit(function(e)
{
    e.preventDefault();
    $.ajax
    ({
        type: "POST",
        url: "requests.php",
        data: $(this).serialize(),
        success: function(response)
        {
            checkHashtags();
            $('#feedPosts').empty();
            buildPosts(function(timestamps)
            {
                timestamps.reverse(timestamps.sort(sortFunction));
                for(var i = 0; i < timestamps.length; i++)
                {
                    $('#feedPosts').append(timestamps[i][1]);
                    hashtagIt('#feedPosts > div');
                }
            })
        }
    })
});*/