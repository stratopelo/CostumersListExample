
//Ready function
$(document).ready(function(){

    AddSortIcons();
    AddFilterRow();
    GetStatusList();
    UpdateCostumersList();
   
});


//Retrieve the list of available status and store them on data attrbute
function GetStatusList(){
    var List = "";

    $.ajax({
    type: "GET",
    url: "/Main/StatusList",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
    //alert(JSON.stringify(data));
    
    $.each(data, function (i, item) {
    
    var elem = '<li class="pluto" data-statusid="' + item.statusId + '"><a href="#" onclick="PostCostumerStatus(' + item.statusId +  ',cid-code)">' + item.status + '</a></li>' ;
        List += elem;
        $('.statusmenu').append(elem);

    }); //End of foreach Loop
    $('.statusmenu').data('list',List);
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


//Post the status change for costumer id
function PostCostumerStatus(statusId,costumerId)
{
    var postData = {
        statusId: statusId,
        costumerId: costumerId
    };

    console.log(postData);

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Main/UpdateStatus",
        dataType: "json",
        data: JSON.stringify(postData),
        success: function (response) {
            if (response == "ok"){
                UpdateCostumersList();
            }
        }
    });


    console.log(costumerId);
    console.log(statusId);
}


//Refresh the table of costumers
function UpdateCostumersList(){
    var sortField =  $('#CostumersList').data('sortfield');
    var sortType = $('#CostumersList').data('sorttype');
    var filterFields = $('#CostumersList').data('filter-fields');
     var filterValues = $('#CostumersList').data('filter-values');


    $.ajax({
    type: "GET",
    url: "/Main/CostumersList",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: {sortField: sortField, sortType: sortType, filterFields: filterFields, filterValues: filterValues},
    success: function (data) {
    //alert(JSON.stringify(data));

    $('#CostumersList tbody').empty();    
    
    $.each(data, function (i, item) {
    var rows = '<tr data-costumerid="' + item.costumerId  + '">' +
        '<td id="Name"><a href="/Main/Costumer/' + item.costumerId + '">' + item.costumerName + '</a></td>' +
        "<td id='Country'>" + item.country + "</td>" +
        "<td id='City'>" + item.city + "</td>" +
        "<td id='Status'>" + 
        '<div class="dropdown">' +
        '<span class="dropdown-toggle" type="button" id="' + item.costumerStatus.statusId + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' +
            item.costumerStatus.status + 
        '<span class="caret" style="float:right;margin-top:5px;"></span>' +
        '</span>' +
        '<ul class="dropdown-menu" aria-labelledby="'+ item.costumerStatus.statusId + '">' +
             $('.statusmenu').data('list').replace(/cid-code/g,"'" + item.costumerId + "'");
        '</ul>' +
        '</div>' +
        
        "</td>" +
        "</tr>";

        $('#CostumersList').append(rows);
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

};








//Add filter row to table of costumers
function AddFilterRow(){

    var rows = '<tr id="filterrow" hidden>';
    
    $('#CostumersList thead tr th').each(function(){

        var row = '<td data-filterfield="' + $(this).data('field') + '">' +
                        '<div class="input-group">' +
                        '<input class="form-control input-sm filtered-input" type="text" data-filtervalue="" placeholder="" />' +
                        '<a class="input-group-addon filter-apply" style="cursor:pointer;"><i class="glyphicon glyphicon-ok"></i></a>' +
                        '</div>' +
                        '</td>'

          rows += row;
    });

    rows += '</tr>'
    $('#CostumersList thead').append(rows);


    //Table filter click event
    $('.filter').on('click', function(){
        //var Column = $(this).data('field') + "Filter";

        if ($('#filterrow').is(":hidden") == true){
            $('#filterrow').show();
            //$("#" + Column).show();
        }
        else
        {
            $('#filterrow').hide();
            $('#CostumersList thead tr td').each(function(){
                    $(this).find('div').find('input').val('');
             });

             $('#CostumersList').data('filter-fields', "");
             $('#CostumersList').data('filter-values', "");

             UpdateCostumersList();
        }
        
    });


    //Filter apply event
    $('.filter-apply').on('click',function(){

        ApplyFilter();

    });


    //Key enter handle
    $('#CostumersList thead tr td .filtered-input').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            ApplyFilter();
        }
    });

}

function ApplyFilter(){
    var FilterFields = "";
    var FilterValues = "";

    $('#CostumersList thead tr td').each(function(){
           
        var input = $(this).find('div').find('input');

        if (input.val() != undefined && input.val() != ""){
            FilterFields += $(this).data('filterfield') + ";";
            FilterValues += input.val() + ";";
        }

    });

     $('#CostumersList').data('filter-fields', FilterFields);
     $('#CostumersList').data('filter-values', FilterValues);

      UpdateCostumersList();
}







//Add sort icons to table header
function AddSortIcons(){
    $('#CostumersList thead tr th').each(function(){

        $(this).append('<span class="sort glyphicon glyphicon-sort-by-alphabet" style="cursor:pointer;float:right;" data-sortfield="' + this.dataset.field + '" data-sorttype="0" >');

    });

    $('#CostumersList thead th span.sort').on('click', function(){

        $('#CostumersList thead tr th').each(function(){

            $(this).find('span.sort').css('color','#000000');
            $(this).find('span.sort').data('sorttype',"0");
        });

        if (this.dataset.sorttype == 0 || this.dataset.sorttype == 2){
            this.dataset.sorttype = 1;
            $(this).css('color','#0000ff');
            $(this).removeClass('glyphicon-sort-by-alphabet-alt').addClass('glyphicon-sort-by-alphabet');
        }
        else
        {
            this.dataset.sorttype = 2;
            $(this).css('color','#ff0000');
            $(this).removeClass('glyphicon-sort-by-alphabet').addClass('glyphicon-sort-by-alphabet-alt');
        }

        $('#CostumersList').data('sortfield', this.dataset.sortfield);
        $('#CostumersList').data('sorttype', this.dataset.sorttype);
       
        UpdateCostumersList();
    });
}


