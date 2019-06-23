$(document).ready(function () {
    $('#tblPoReport').DataTable();
    LoadGridData();
});



//edit method
$(document).on('click', '.btn-detail', function () {
    var uid = $(this).attr('id');
    window.location = ('../Reports/PoDetailView?UID=' + uid);
   
});



//load grid
LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/PurchaseOrder",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            $('#tblPoReport').DataTable().destroy();
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                html += '<td class="hidden">' + obj.UID + '</td>';

                if (obj.PurchaseOrderNo != null) {
                    html += '<td>' + obj.PurchaseOrderNo + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.VendorId != null) {
                    html += '<td>' + obj.VendorId + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Status == true) {
                    html += '<td>' + ' Posted' + '</td>';
                }
                else {
                    html += '<td>Not Posted</td>';
                }

                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-detail">';
                html += '<i class="fa fa-edit"></i>';
                html += ' Detail';
                html += ' </button></td>';
                html += '</tr>'
            }
            $("#tbody").append(html);
            $('#tblPoReport').DataTable().draw();
        }
    });
}

