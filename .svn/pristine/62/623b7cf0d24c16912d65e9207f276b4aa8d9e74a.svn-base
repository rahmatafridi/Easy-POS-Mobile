
$(document).ready(function () {
    LoadBarcodeForPrint();
   
    $('#tblprintbarcode').DataTable();
    

});


var LoadBarcodeForPrint = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../BarcodeManagement/PrintBarcode",
        processData: false,
        contentType: false,
        success: function (data) {
            console.log(data);
            data = JSON.parse(data);
            $('#tblprintbarcode').DataTable().destroy();
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                html += '<td class="hidden">' + obj.UID + '</td>';
                html += '<td class="hidden">' + obj.Id + '</td>';


                //if (obj.Barcode != null) {
                //    html += '<td>' + obj.Barcode + '</td>';
                //}
                //else {
                //    html += '<td>-</td>';
                //}


                if (obj.CategoryName != null) {
                    html += '<td>' + obj.CategoryName + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.SubCategoryName != null) {
                    html += '<td>' + obj.SubCategoryName + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Name != null) {
                    html += '<td>' + obj.Name + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Barcode != null) {
                    html += '<td>' + obj.Barcode + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                //if (obj.Comment != null) {
                //    html += '<td>' + obj.Comment + '</td>';
                //}
                //else {
                //    html += '<td>-</td>';
                //}

                html += '<td>';


                if (obj.Barcode != null) {
                    html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-print">';
                    html += '<i class="fa fa-print"></i>';
                    html += ' Print Barcode';
                    html += ' </button>';
                }
                else {
                    html += '<button id=' + obj.UID + ' class="btn btn-primary btn-block btn-xs btn-generate-barcode">';
                    html += '<i class="fa fa-edit"></i>';
                    html += ' Generate Barcode';
                    html += ' </button>';
                }



                html += '</td>';
                html += '</tr>'
            }
            $("#tbody").append(html);
            $('#tblprintbarcode').DataTable().draw();
        }
    });
}



$(document).on('click', '.btn-print', function () {

    var uid = $(this).attr('id');
    var data = new FormData();
    data.append("Id", uid);

    $.ajax({
        type: "POST",
        cache: false,
        url: "../BarcodeManagement/ItemByUid",
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {

            if (Rdata != 'error') {
                console.log(Rdata);
                var obj = JSON.parse(Rdata);

                $('#uid').val(obj[0].UID);
                $('#article').html(obj[0].ItemName);
                $('#category').html(obj[0].CategoryName);
                $('#size').html(obj[0].Size);
                //$('#uom').html(obj[0].Uom);
                $('#barcode').html(obj[0].Barcode);
                generateBarcode();
                $('#BarcodeModal').modal('show');
            }
            else {
                ShowErrorAlert("Error", "Some Error Occured!");
                $('#btn-validate').removeAttr('disabled');
            }
        },
        error: function (e) {
        }
    });
});



function generateBarcode() {

    var value = $("#barcode").html();
    var btype = "code128";
    var renderer = "css";
    var quietZone = true;

    var settings = {
        output: renderer,
        bgColor: "#FFFFFF",
        color: "#000000",
        barWidth: "1",
        barHeight: "50",
        moduleSize: "5",
        posX: "10",
        posY: "20",
        addQuietZone: "1"
    };

    value = { code: value, rect: true };

    $("#barcodeTarget").html("").show().barcode(value, btype, settings);
}



$('#btnprintbarcode').click(function () {

    //window.location = "../ASPXPages/Barcode.aspx?UID=" + $('#uid').val();

    var qty = $("#bqty").val();
    var url;
    //if ($('#IsMinsa').attr('checked')) {    
    url = "../ASPXPages/Barcode.aspx?UID=" + $('#uid').val();
    //if ($('#IsMinsa').is(":checked")) {

    //}
    //else {
    //    url = "../ASPXPages/Barcode.aspx?UID=" + $('#uid').val() + "&PrintName=0";
    //}

    if (qty.length <= 0) {


        swal("Please provide Quantity To Proceed.");
        $("#bqty").focus();
    }
    for (var i = 0; i < qty; i++) {
    openNewWin(url);
    }
    if (qty.length > 0) {
        $('#BarcodeModal').modal('hide');
    }

});

function openNewWin(url) {
    var x = window.open(url, '_blank', 'width=620,height=500,toolbar=1');
    x.focus();
}