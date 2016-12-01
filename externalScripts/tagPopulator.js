/*
This function automatically populates the tags table of firebase according to the events
tables. It searches through the events table, get the tags, and then send the specified event
key to the tags table under the correct tag. It does not make duplicate copies.

As of now this code needs to be run in google scripts with the firebase app library loaded
into the script. The url for the firebase API is MYeP8ZEEt1ylVDxS7uyg9plDOcoke7-2l.
*/
function tagPopulator() {
  var firebaseUrl = "https://projectnow-964ba.firebaseio.com/";
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl);
  var data = base.getData("events");
  for(var i in data)
  {
    for (var tag in data[i].Tags)
    {
      var tagData = base.getData("tags/" + data[i].Tags[tag]);
      if (tagData === null)
      {
        var tagData = [];
        tagData[0] = i;
      }
      else
      {
        if (tagData.indexOf(i) === -1)
        {
          tagData.push(i);
        }
      }
      base.setData("tags/" + data[i].Tags[tag], tagData);
    }
  }
}

Object.size = function(obj)
{
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
