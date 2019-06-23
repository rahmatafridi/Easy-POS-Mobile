$(document).ready(function () {
    $('#tblTrReport').DataTable();
    LoadGridData();
});



//edit method
$(document).on('click', '.btn-detail', function () {
    var uid = $(this).attr('id');
    window.location = ('../Reports/TransferDetailView?UID=' + uid);

});



//load grid
LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/LoadTransferMain",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            $('#tblTrReport').DataTable().destroy();
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                html += '<td class="hidden">' + obj.UID + '</td>';

                if (obj.TransferNo != null) {
                    html += '<td>' + obj.TransferNo + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Location != null) {
                    html += '<td>' + obj.Location + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Date != null) {
                    html += '<td>' + obj.Date + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                

                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-detail">';
                html += '<i class="fa fa-edit"></i>';
                html += ' Detail';
                html += ' </button></td>';
                html += '</tr>'
            }
            $("#tbody").append(html);
            $('#tblTrReport').DataTable().draw();
        }
    });
}

