
$(document).ready(function () {
    LoadServiceDDL();
});

$('#btnAssign').click(function () {

    $('#box1View :selected').each(function (i, selected) {
        var s = $(selected).text();
        var v = $(selected).val();

        if ($("#box2View option[value='" + v + "']").length == 0) {
            $('#box2View')
            .append($("<option></option>")
            .attr("value", v)
            .text(s));
        }
    });
})

$('#btnRevoke').click(function () {
    $('#box2View :selected').each(function (i, selected) {        
        console.log($(selected).val());
        var v = $(selected).val();
        $("#box2View option[value='" + v + "']").remove();
    });
});

//Save Changes..

$('#btn-save').click(function () {
    //hidebtn('#btn-save');
    $('#btn-save').attr('disabled', 'true');
    var CID = $('#ClientId').val();
    var SID = $('#ServiceId').val();
    var list = [];

    $('#box2View option').each(function () {
        var v = $(this).val();
        list.push(v);
    });

    $.ajax({
        type: "POST",
        cache: false,
        url: "../../ProductAssignmentManagement/Save",
        data: {
            sel: list,
            ClientId: CID,
            ServiceId: SID
        },
        traditional: true,
        success: function (data) {
            //alert(data);
            if (data != '' && data != null) {
                if (data != 'error' && data != 'Error') {
                    $('#btn-save').removeAttr('disabled');
                    swal({
                        title: 'Success',
                        text: 'Products Assigned to Client Successfully!',
                        timer: 2000
                    }).then(
                    function () {
                        window.location.href = "../ClientManagement/Index";
                    },
                   // handling the promise rejection
                   function (dismiss) {
                       if (dismiss === 'timer') {
                           window.location.href = "../ClientManagement/Index";
                       }
                   })
                }
                else {
                    $('#btn-save').removeAttr('disabled');
                    alert("An error occured. Data not saved.");
                }
            }
            else {
                $('#btn-save').removeAttr('disabled');
                alert("Error! Please Select One or more rights.");
            }
        },
        error: function (e) {
            $('#btn-save').removeAttr('disabled');
            console.log(e.error);
        }
    });
});

//for loading Services
var LoadServiceDDL = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../../ProductAssignmentManagement/LoadServiceDDL",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);
            var $el = $('#ServiceId');
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="">' + "Select Product" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="">' + "Select Product" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}

$('#ServiceId').on('change', function () {
    if ($('#ServiceId').val() != '') {
        LoadAvailableProductsByServiceId();
        LoadAssignedProductsByServiceId();
    }
    else {
        var $el = $('#box1View');
        $el.empty();
        var $el = $('#box2View');
        $el.empty();
    }
});

function LoadAvailableProductsByServiceId() {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../../ProductAssignmentManagement/GetProducts?Id=" + $('#ServiceId').val(),
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);
            var $el = $('#box1View');
            $el.empty();
            if (sch.length > 0) {
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
        },
        error: function (data) {
            alert('Error');
        }
    });
}

function LoadAssignedProductsByServiceId() {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../../ProductAssignmentManagement/GetAssignedProducts?Id=" + $('#ServiceId').val() + "&ClientId=" + $('#ClientId').val(),
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);
            var $el = $('#box2View');
            $el.empty();
            if (sch.length > 0) {
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.ProductId + '">' + obj.Name + '</option>');
                });
            }
        },
        error: function (data) {
            alert('Error');
        }
    });
}
