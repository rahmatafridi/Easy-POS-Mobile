﻿

$(document).ready(function () {
    LoadGridData();

    $('#tblBarcode').DataTable();

    $('#BTypeId').chosen();
    //$('#ColorId').chosen();

    $('#gb_message_div').hide();
    LoadBarcode();
   
});

$('#btnsavebarcode').click(function () {
    var BType = $('#BTypeId').val();
    if (BType == 1) { // Auto Barcode
        if ($('#gb_barcode_value').val() == "") {

            $('#gb_message').html('Please Refresh Your Page To Generate Auto Barcode!');
            $('#gb_message_div').show();
            $('#gb_message_div').fadeOut(10000, function () {
                $('#gb_message').html('');
            });
        }
        else {
            AddBarcode();
        }
    }
    else if (BType == 2) { // Manual Barcode
        if ($('#gb_barcode_value').val() == "") {

            $('#gb_message').html('Please provide Barcode!');
            $('#gb_message_div').show();
            $('#gb_message_div').fadeOut(10000, function () {
                $('#gb_message').html('');
            });
        }
        else {
            AddBarcode();
        }
    }
});

var AddBarcode = function () {
    var mydata = {
        UID: $('#gb_uid').val(),
        BarcodeType: $('#BTypeId').val(),
        Barcode: $('#gb_barcode_value').val(),
        ColorId: $('#ColorId').val()
    }

    $.ajax({
        type: "POST",
        url: "../BarcodeManagement/AddBarcode",
        data: mydata,
        dataType: "json",
        success: function (data) {
            if (data == 'exist') {
                swal("warning", "Barcode Already Assigned", "warning");
                return;
            }
            else {
                swal(
                     'Success',
                     'Barcode Generated Successfully.',
                     'success'
                    );
                $('#ColorId').val('').trigger("chosen:updated");

                //data = JSON.parse(data);

                console.log(data);

                $('#tblBarcode').DataTable().destroy();

                $('#tbody').empty();

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

                    if (obj.UomName != null) {
                        html += '<td>' + obj.UomName + '</td>';
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
                    if (obj.CategoryName == 'Mobile' || obj.CategoryName == 'Used Mobile') {
                        if (obj.Barcode != null) {
                            html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-print">';
                            html += '<i class="fa fa-print"></i>';
                            html += ' Print Barcode';
                            html += ' </button>';

                            html += '<button id=' + obj.UID + ' class="btn btn-primary btn-block btn-xs btn-generate-barcode">';
                            html += '<i class="fa fa-edit"></i>';
                            html += ' Generate Barcode';
                            html += ' </button>';
                        }
                        else {
                            html += '<button id=' + obj.UID + ' class="btn btn-primary btn-block btn-xs btn-generate-barcode">';
                            html += '<i class="fa fa-edit"></i>';
                            html += ' Generate Barcode';
                            html += ' </button>';
                        }
                    }
                    else {
                        if (obj.Barcode != null) {
                            html += '<button id=' + obj.UID + ' class="btn btn-block btn-xs" style="Background-color:red;color:white;">';
                            html += '<i class=""></i>';
                            html += ' Barcode Generated';
                            html += ' </button>';
                        }
                        else {
                            html += '<button id=' + obj.UID + ' class="btn btn-primary btn-block btn-xs btn-generate-barcode">';
                            html += '<i class="fa fa-edit"></i>';
                            html += ' Generate Barcode';
                            html += ' </button>';
                        }
                    }


                    html += '</td>';
                    html += '</tr>'
                }
                $("#tbody").append(html);
                $('#tblBarcode').DataTable().draw();

                $('#AssignBarcodeModal').modal('hide');
            }
        }
    });
}

//load grid
var LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../BarcodeManagement/LoadGrid",
        processData: false,
        contentType: false,
        success: function (data) {
            console.log(data);
            data = JSON.parse(data);
            $('#tblBarcode').DataTable().destroy();
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

                if (obj.UomName != null) {
                    html += '<td>' + obj.UomName + '</td>';
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
                if (obj.CategoryName == 'Mobile' || obj.CategoryName == 'Used Mobile') {
                    if (obj.Barcode != null) {
                        html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-print">';
                        html += '<i class="fa fa-print"></i>';
                        html += ' Print Barcode';
                        html += ' </button>';

                        html += '<button id=' + obj.UID + ' class="btn btn-primary btn-block btn-xs btn-generate-barcode">';
                        html += '<i class="fa fa-edit"></i>';
                        html += ' Generate Barcode';
                        html += ' </button>';
                    }
                    else {
                        html += '<button id=' + obj.UID + ' class="btn btn-primary btn-block btn-xs btn-generate-barcode">';
                        html += '<i class="fa fa-edit"></i>';
                        html += ' Generate Barcode';
                        html += ' </button>';
                    }
                }
                else {
                    if (obj.Barcode != null) {
                        html += '<button id=' + obj.UID + ' class="btn btn-block btn-xs" style="Background-color:red;color:white;">';
                        html += '<i class=""></i>';
                        html += ' Barcode Generated';
                        html += ' </button>';
                    }
                    else {
                        html += '<button id=' + obj.UID + ' class="btn btn-primary btn-block btn-xs btn-generate-barcode">';
                        html += '<i class="fa fa-edit"></i>';
                        html += ' Generate Barcode';
                        html += ' </button>';
                    }
                }


                html += '</td>';
                html += '</tr>'
            }
            $("#tbody").append(html);
            $('#tblBarcode').DataTable().draw();
        }
    });
}



//Print button
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

//Assign Barcode Button
$(document).on('click', '.btn-generate-barcode', function () {
    var uid = $(this).attr('id');
    var data = new FormData();
    data.append("Id", uid);

    $.ajax({
        type: "POST",
        cache: false,
        url: "../BarcodeManagement/ItemByUidForBarcode",
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {

            if (Rdata != 'error') {
                console.log(Rdata);
                var obj = JSON.parse(Rdata);

                $('#gb_uid').val(obj[0].UID);
                $('#gb_article').html(obj[0].ItemName);
                $('#gb_category').html(obj[0].CategoryName);
                $('#gb_subcategory').html(obj[0].SubCategoryName);
                $('#gb_size').html(obj[0].Size);
                $('#BTypeId').val(1).trigger("chosen:updated");
               

                LoadBarcode();
                LoadColors();
                $('#AssignBarcodeModal').modal('show');
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

$("#BTypeId").on('change', function () {
    if ($('#BTypeId').val() == 1) {
        LoadBarcode();
    }
    else if ($('#BTypeId').val() == 2) {
        $('#gb_barcode_value').removeAttr('disabled');
        $('#gb_barcode_value').val('');
    }
});

var LoadColors = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../BarcodeManagement/LoadColors",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);
            
            var $el = $('#ColorId');
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="">' + "Select Color" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="">' + "Select ColorId" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}


var LoadBarcode = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../ItemManagement/LoadBarcode",
        processData: false,
        contentType: false,
        success: function (data) {
            $('#gb_barcode_value').removeAttr('disabled');
            $('#gb_barcode_value').val(data);
            $('#gb_barcode_value').attr('disabled', true);
        }
    });

}