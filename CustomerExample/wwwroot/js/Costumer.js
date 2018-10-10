
//Ready document
$(document).ready(function(){

    GetNotes();

});


//Retrieve the notes for current costumer
function GetNotes(){
    var geturl =  "/Main/GetNotes/" + $('#customerid').val();
    //console.log(geturl);

 $.ajax({
    type: "GET",
    url: geturl,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
    //alert(JSON.stringify(data));

    $('#CostumerNotes tbody').empty();    
    
    $.each(data, function (i, item) {
    var rows = '<tr>' +
        '<td id="NoteId">' + item.noteid + '</td>' +
        "<td id='Note'>" + item.note + "</td>" +
        "<td id='CreationDT'>" + item.creationDT + "</td>" +
        "<td id='Status'>" + 
        "</tr>";

        $('#CostumerNotes').append(rows);


    }); //End of foreach Loop
    //console.log(data);
    
    }, //End of AJAX Success function

    failure: function (data) {
        alert(data.responseText);
        }, //End of AJAX failure function
    error: function (data) {
        alert(data.responseText);
        } //End of AJAX error function

    });

}


