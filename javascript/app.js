// Initialize Firebase
var config = {
apiKey: "AIzaSyDPeOJZRl5eU0vM5IgXm7nLFE6KTCd9yCY",
authDomain: "train-activity-c7cc8.firebaseapp.com",
databaseURL: "https://train-activity-c7cc8.firebaseio.com",
projectId: "train-activity-c7cc8",
storageBucket: "train-activity-c7cc8.appspot.com",
messagingSenderId: "1021510747733"
};

firebase.initializeApp(config);

let fireDatabase = firebase.database();

$('#pointer').click(function() {
    let toggleAddTrain = $('#pointer').attr('aria-expanded');
    if (toggleAddTrain === 'false') {
        $('#toggleCollapse').text(' (Click to collapse)')
    }
    if (toggleAddTrain === 'true') {
        $('#toggleCollapse').text(' (Click to expand)')
    }
})

$('#addTrainBtn').click(function() {
    event.preventDefault();
    let trainName = $('#trainName').val().trim();
    let destination = $('#destination').val().trim();
    let trainTime = $('#trainTime').val().trim();
    let frequency = $('#frequency').val().trim();
    console.log('Train Name: ' + trainName);
    console.log('Destination: ' + destination);
    console.log('First Train Arrival: ' + trainTime);
    console.log('Frequency: ' + frequency);

    fireDatabase.ref().push({
        name: trainName,
        destination: destination,
        firstTime: trainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });


})

fireDatabase.ref().on("child_added", function(childSnapshot) {

    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTime);
    console.log(childSnapshot.val().frequency);

    trainName = childSnapshot.val().name;
    trainDestination = childSnapshot.val().destination;
    trainFirstDepartureTime = childSnapshot.val().firstTime;
    trainFrequency = childSnapshot.val().frequency;

    let tbody = $('tbody');
    let tr = $('<tr>');
    // name of train
    tr.append('<td>' + trainName + '</td>');
    // train destination
    tr.append('<td>' + trainDestination + '</td>');
    // train frequency
    tr.append('<td>' + trainFrequency + '</td>');
    
    
        // calculate train time
        var firstTimeConverted = moment(trainFirstDepartureTime, "HH:mm").subtract(1, "years");
        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // Time apart (remainder)
        var tRemainder = diffTime % trainFrequency;
        // Minute Until Train
        var tMinutesTillTrain = trainFrequency - tRemainder;
        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        var nextTrainTime = moment(nextTrain).format('h:mm A')
    // next arrival
    tr.append('<td>' + nextTrainTime + '</td>');
    // minutes before train arrive
    tr.append('<td>' + tMinutesTillTrain + '</td>');
    // append to all to tbody
    tbody.append(tr);
    }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
