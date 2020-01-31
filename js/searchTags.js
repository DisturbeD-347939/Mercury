setTimeout(compareTags(), 50);

//Get posts with the same tag
function compareTags()
{
    tags = tags[0];
    var postWithTags = "";
    var postWithTagsIDS = [];
    for(var i = 0; i < tags.length; i++)
    {
        if(tags[i]["hashtags"].indexOf(" ") >= 0)
        {
            var multi = tags[i]["hashtags"].split(" ");
            for(var j = 0; j < multi.length; j++)
            {
                if(multi[j] == tag)
                {
                    postWithTags += tags[i]["userID"] + ",";
                    postWithTagsIDS.push(tags[i]["id"]);
                }
            }
        }
        else
        {
            if(tags[i]["hashtags"] == tag)
            {
                postWithTags += tags[i]["userID"] + ",";
                postWithTagsIDS.push(tags[i]["id"]);
            }
        }
        if(i+1 == tags.length)
        {
            postWithTags = postWithTags.substring(0, postWithTags.length - 1);
            getPosts(postWithTags, postWithTagsIDS, function(data)
            {
                timestamps.reverse(timestamps.sort(sortFunction));
                for(var i = 0; i < timestamps.length; i++)
                {
                    $('#posts').append(timestamps[i][1]);
                    hashtagIt('#posts > div');
                }
            });
        }
    }
}

//Simply gets all posts
function getPosts(userID, postID, callback)
{
    var tempArray = [];
    var postsWithTags = [];
    
    console.log(postID);
    request(userID, function(data)
    {
        var tempPostStorage = [];
        for(var i = 0; i < data[0]["result"][0].length; i++)
        {
            for(var j = 0; j < postID.length; j++)
            {
                if(data[0]["result"][0][i]["id"] == postID[j])
                {
                    tempPostStorage.push(data[0]["result"][0][i]);
                    console.log("Found");
                }
            }
            if((i+1) >= data[0]["result"][0].length)
            {
                data[0]["result"][0] = tempPostStorage;
                createPost(data, function(timestamps)
                {
                    callback(timestamps);
                })
            }
        }
    })
}