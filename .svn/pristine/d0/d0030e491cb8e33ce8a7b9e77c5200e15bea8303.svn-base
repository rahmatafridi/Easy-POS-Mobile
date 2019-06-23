var IsEditMode = false;

$(document).ready(function () {
    $('#tblMeasure').DataTable({ responsive: true });
    LoadGridData();
    GenerateCode();
    DataSubmit();

});


var GenerateCode = function () {

    $.ajax({
        type: "POST",
        cache: false,
        url: "../UnitOfMeasureManagement/GenerateCode",
        processData: false,
        contentType: false,
        success: function (data) {
            $('#Code').val(data);
            $('#Code').attr('disabled', true);
        }
    });
}

$("#IsActive").on('ifChecked', function (event) {
    $(this).closest("input").attr('value', true);
});
$("#IsActive").on('ifUnchecked', function (event) {
    $(this).closest("input").attr('value', false);
});

function Reset() {
    IsEditMode = false;
    GenerateCode();
    $('#Code').val('');
    $('#Name').val('');
    $("#IsActive").iCheck('uncheck');
    $('#btn-save').html("<i class='fa fa-save'></i> Save");
}

$('#btn-refresh').click(function () {
    Reset();
});



var DataSubmit = function () {

    $(".frmMeasure").validate({

        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "",
        rules: {
            Name: {
                required: true,
                maxlength: 50
            },

        },

        invalidHandler: function (event, validator) { //display error alert on form submit

        },

        highlight: function (element) { // hightlight error inputs            
            $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function (error, element) {
            if (element.closest('.input-icon').size() === 1) {
                error.insertAfter(element.closest('.input-icon'));
            } else {
                error.insertAfter(element);
            }
        },

        submitHandler: function (form) {
            $("#btn-save").attr('disabled', 'true');
            $(".frmMeasure :disabled").removeAttr('disabled');
            if (!IsEditMode) {
                $.post(
                    "../UnitOfMeasureManagement/AddUnitOfMeasure",
                    $(".frmMeasure").serialize(),
                    function (value) {
                        if (value != 'error') {
                            if (value == 'SESSION EXPIRED') {
                                window.location = '../Authentication/Login';
                            }
                            else if (value=='exist') {
                                swal("warning", "Unit Of Measure Already Exist", "warning")
                                Reset();
                                return;
                            }
                            
                            else {
                                swal(
                                    'success',
                                    'Unit Measure Add successfully',
                                    'success'
                                    )
                                Reset();
                                $('#btn-save').removeAttr('disabled');
                                $('#tblMeasure').DataTable().destroy();

                                var obj = JSON.parse(value);

                                html += '';
                                var html = '<tr>';
                                html += '<td class="hidden">' + obj.UID + '</td>';

                                if (obj.Code != null) {
                                    html += '<td>' + obj.Code + '</td>';
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
                                if (obj.IsActive) {
                                    html += '<td><span class="label label-success label-xs">Active</span></td>';
                                }
                                else {
                                    html += '<td><span class="label label-danger label-xs">In Active</span></td>';
                                }
                                html += '<td>';
                                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                                html += '<i class="fa fa-edit"></i>';
                                html += ' Edit';
                                html += ' </button>';
                                html += ' </td>';

                                html += '</tr>'

                                $("#tblbody").append(html);
                                $('#tblMeasure').DataTable().draw();
                            }
                        }
                        else {
                            swal("Error", "Data Not Saved. Please Refresh & Try Again", "error")
                            $('#btn-save').removeAttr('disabled');
                        }

                        "text"
                    }
                    )
            }
            else {
                $.post(
                "../UnitOfMeasureManagement/EditUnitOfMeasure",
                $(".frmMeasure").serialize(),
                function (value) {
                    if (status == 'exist') {
                        swal(
                              'Warning',
                              'Unit Already Exist!',
                              'warning'
                            )
                    }
                    if (value != 'error') {
                        if (value == 'SESSION EXPIRED') {
                            window.location = '../Authentication/Login';
                        }
                        else if (value == 'exist') {
                            swal("warning", "Unit Of Measure Already Exist", "warning")
                            Reset();
                            return;
                        }
                        else if (value == 'assigned') {
                            swal("error", "Cant't Change Assigned Value! ", "error")
                            Reset();
                            return;
                        }

                        else {
                            swal(
                                  'Success',
                                  'Unit Updated Successfully!',
                                  'success'
                                )
                            Reset();
                            $('#btn-save').removeAttr('disabled');
                            var data = JSON.parse(value);
                            $('#tblMeasure').DataTable().destroy();

                            $('#tblMeasure tbody tr').each(function (i, obj) {
                                var id = $(this).closest('tr').find('td:first-child').text();
                                if (id == data.UID) {
                                    if (data.Code != null) {
                                        $(this).closest('tr').find('td:nth-child(2)').text(data.Code);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(2)').text("-");
                                    }

                                    if (data.Name != null) {
                                        $(this).closest('tr').find('td:nth-child(3)').text(data.Name);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(3)').text("-");
                                    }
                                       if (data.IsActive) {
                                        //alert(data.IsActive);
                                        $(this).closest('tr').find('td:nth-child(4)').html('<td><span class="label label-success label-xs">Active</span></td>');
                                    }
                                    else {
                                        //alert(data.IsActive);
                                        $(this).closest('tr').find('td:nth-child(4)').html('<td><span class="label label-danger label-xs">In Active</span></td>');
                                    }

                                }
                            });

                            $('#tblMeasure').DataTable().draw();
                        }
                    }
                    else {
                        swal("Error", "Data not updated!!", "error")
                        $('#btn-save').removeAttr('disabled');
                    }
                },
                "text"
            );
            }
        }
    }
     );
    jQuery('#btn-save').click(function () {

        if ($('.frmMeasure').validate().form()) {
            $('.frmMeasure').submit();
        }
    });
}

var LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../UnitOfMeasureManagement/LoadGrid",
        processData: false,
        contentType: false,
        success: function (data) {
            // alert(data);
            data = JSON.parse(data);
            $('#tblMeasure').DataTable().destroy();
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                html += '<td class="hidden">' + obj.UID + '</td>';

                if (obj.Code != null) {
                    html += '<td>' + obj.Code + '</td>';
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
                if (obj.IsActive) {
                    html += '<td><span class="label label-success label-xs">Active</span></td>';
                }
                else {
                    html += '<td><span class="label label-danger label-xs">In Active</span></td>';
                }
                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                html += '<i class="fa fa-edit"></i>';
                html += ' Edit';
                html += ' </button>';
                html += ' </td>';
                html += '</tr>'
            }

            $("#tblbody").append(html);
            $('#tblMeasure').DataTable().draw();
        }
    });
}


$(document).on('click', '.btn-edit', function () {
    //  alert('called');
    var uid = $(this).attr('id');
    var data = new FormData();
    data.append("UID", uid);
    $.ajax({
        type: "POST",
        cache: false,
        url: "../UnitOfMeasureManagement/Edit",
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {
            if (Rdata != 'error') {
                var obj = JSON.parse(Rdata);

                $('#UID').val(obj.UID);
                $('#Code').val(obj.Code);
                $('#Name').val(obj.Name);
                $('#btn-save').html("<i class='fa fa-save'></i> Update");
                IsEditMode = true;
                if (obj.IsActive) {
                    $("#IsActive").iCheck('check');
                }
                else {
                    $("#IsActive").iCheck('uncheck');
                }
                IsEditMode = true;
                $(window).scrollTop(0);
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
