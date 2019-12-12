setup();

function setup()
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    { // Call a function when the state changes.
        if (this.readyState === xmlhttp.DONE && this.status === 200) 
        {
            console.log(this.response);
        }
    }
    var values = [followerID, userID];
    console.log(values);
    xmlhttp.open("GET", "requests.php?following=" + values, true);
    xmlhttp.send();
}