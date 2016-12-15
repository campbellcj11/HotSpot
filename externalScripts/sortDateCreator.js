/*
This function automatically populates the sort date field in firebase.

As of now this code needs to be run in google scripts with the firebase app library loaded
into the script. The url for the firebase API is MYeP8ZEEt1ylVDxS7uyg9plDOcoke7-2l.

*/
function sortDateCreator() {
  var firebaseUrl = "https://projectnow-964ba.firebaseio.com/";
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl);
  var data = base.getData("events");
  for(var i in data)
  {
    Logger.log(data[i].Date);
    var currentDate = new Date(data[i].Date);
    Logger.log(currentDate.getTime());
    Logger.log(i);
    base.setData("events/" + i + "/Sort_Date", currentDate.getTime());
  }
}
