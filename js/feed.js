setTimeout(setup, 500);

function setup()
{
    ids = JSON.parse(ids);
    console.log(ids);
    for(var i = 0; i < ids.length; i++)
    {
        console.log(ids[i]["userID"]);
    }
}