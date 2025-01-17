﻿$(document).ready(function () {
    $('#fDate').val('');
    $('#tDate').val('')
    LoadPicker();
  
    $('#tblVendorReport').DataTable();
    LoadGridData();
});



var LoadPicker = function () {
    $('#fDate').datepicker("setDate", new Date());
    $('#tDate').datepicker("setDate", new Date());
}





//edit method
$(document).on('click', '.btn-detail', function () {
    var uid = $(this).attr('id');
 
    window.location = ('../Reports/VendorDetailView?UID=' + uid+"&fDate=null&tDate=null");
   
});

$(document).on('click', '.btn-detailDate', function () {
    var uid = $(this).attr('id');
    if ($('#fDate').val().length==0) {
        alert("select from date");
        return;
    }
    if ($('#tDate').val().length == 0) {
        alert("select to date");
        return;
    }

    var fDate = $('#fDate').val();
    var tDate = $('#tDate').val();
    window.location = ('../Reports/VendorDetailView?UID=' + uid+"&fDate="+fDate+"&tDate="+tDate);

});



//load grid
LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/VendorLoadGrid",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            $('#tblVendorReport').DataTable().destroy();
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                html += '<td class="hidden">' + obj.UID + '</td>';

                if (obj.Name != null) {
                    html += '<td>' + obj.Name + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Contact != null) {
                    html += '<td>' + obj.Contact + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.City != null) {
                    html += '<td>' + obj.City + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Balance != null) {
                    html += '<td>' + obj.Balance + '</td>';
                }
                else {
                    html += '<td> - </td>';
                }

                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-detail">';
                html += '<i class="fa fa-edit"></i>';
                html += ' Ledger Complete';
                html += ' </button></td>';
                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-detailDate">';
                html += '<i class="fa fa-edit"></i>';
                html += ' Ledger Date Range';
                html += ' </button></td>';
                html += '</tr>'
            }
            $("#tbody").append(html);
            $('#tblVendorReport').DataTable().draw();
        }
    });
}

