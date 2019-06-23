var IsEditMode = false;

$(document).ready(function () {
    GenerateCode();
    $('#tblClients').DataTable({ responsive: true });
    LoadGridData();
    handleStaff();
});

$(document).on('click', '.btn-edit', function () {
    var uid = $(this).attr('id');
    var data = new FormData();
    data.append("UID", uid);
    $.ajax({
        type: "POST",
        cache: false,
        url: "../ClientManagement/Edit",
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {
            if (Rdata != 'error') {
                var obj = JSON.parse(Rdata);

                $('#UID').val(obj.UID);
                $('#Code').val(obj.Code);
                $('#Name').val(obj.Name);
                $('#ContactNo').val(obj.ContactNo);
                $('#Email').val(obj.Email);
                $('#Address').val(obj.Address);
                $('#btn-save').html("<i class='fa fa-save'></i> Update");
                IsEditMode = true;
                if (obj.IsActive) {
                    $("#IsActive").iCheck('check');
                }
                else {
                    $("#IsActive").iCheck('uncheck');
                }
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

$("#IsActive").on('ifChecked', function (event) {
    $(this).closest("input").attr('value', true);
});
$("#IsActive").on('ifUnchecked', function (event) {
    $(this).closest("input").attr('value', false);
});

var GenerateCode = function () {

    $.ajax({
        type: "POST",
        cache: false,
        url: "../ClientManagement/GenerateCode",
        processData: false,
        contentType: false,
        success: function (data) {
            $('#Code').val(data);
            $('#Code').attr('disabled', true);
        }
    });
}

var handleStaff = function () {
    $('.frmAddClients').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "",
        rules: {
            Code: {
                required: true,
                maxlength: 6
            },
            Name: {
                required: true,
                maxlength: 50
            },
            ContactNo: {
                required: true,
                maxlength: 12
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
            //alert('Called');
            $('#btn-save').attr('disabled', 'true');
            $(".frmAddClients :disabled").removeAttr('disabled');
            if (!IsEditMode) {
                $.post(
                    "../ClientManagement/AddClient",
                    $(".frmAddClients").serialize(),
                    function (value) {
                        if (value == 'exist') {
                            swal(
                             'Warning',
                             'Client Name Already Exist!',
                             'warning'
                           )
                            return;
                        }
                        if (value != 'error') {
                            swal(
                              'Success',
                              'Client Saved Successfully!',
                              'success'
                            )
                            Reset();
                            $('#btn-save').removeAttr('disabled');
                            $('#tblClients').DataTable().destroy();

                            obj = JSON.parse(value);

                            html += '';
                            var html = '<tr>';

                            html += '<td class="hidden">' + obj.UID + '</td>';

                            if (obj.Name != null) {
                                html += '<td>' + obj.Name + '</td>';
                            }
                            else {
                                html += '<td>-</td>';
                            }

                            html += '<td>' + obj.ContactNo + '</td>';

                            if (obj.Email != null) {
                                html += '<td>' + obj.Email + '</td>';
                            }
                            else {
                                html += '<td>-</td>';
                            }

                            if (obj.Address != null) {
                                html += '<td>' + obj.Address + '</td>';
                            }
                            else {
                                html += '<td>-</td>';
                            }

                            //html += '<td>' + obj.IsActive + '</td>';
                            if (obj.IsActive) {
                                console.log(obj.IsActive);
                                html += '<td><span class="label label-primary pull-right" style="width: 100px;">' + 'Active' + '</span></td>';
                            }
                            else if (!obj.IsActive) {
                                html += '<td><span class="label label-danger pull-right"  style="width: 100px;">' + 'In Active' + '</span></td>';
                            }

                            html += '<td>';
                            html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                            html += '<i class="fa fa-edit"></i>';
                            html += ' Edit';
                            html += ' </button>';
                            html += ' </td>';

                            html += ' <td>';
                            html += '<a href="../ProductAssignmentManagement/Index/?UID=' + obj.UID + '" class="btn btn-info btn-block btn-xs ">';
                            html += '<i class="fa fa-users"></i>';
                            html += ' Rights';
                            html += ' </a>';
                            html += ' </td>';

                            html += '</tr>'

                            $("#tblbody").append(html);
                            $('#tblClients').DataTable().draw();
                        }
                        else {
                            swal("Error", "Data Not Saved. Please Refresh & Try Again", "error")
                            $('#btn-save').removeAttr('disabled');
                        }
                    },
                    "text"
                );
            }
            else {
                $.post(
                "../ClientManagement/EditClient",
                $(".frmAddClients").serialize(),
                function (value) {
                    if (status == 'exist') {
                        swal(
                              'Warning',
                              'Client Name Already Exist!',
                              'warning'
                            )
                    }
                    if (value != 'error') {
                        swal(
                              'Success',
                              'Client Updated Successfully!',
                              'success'
                            )
                        Reset();
                        $('#btn-save').removeAttr('disabled');
                        var data = JSON.parse(value);
                        $('#tblClients').DataTable().destroy();

                        $('#tblClients tbody tr').each(function (i, obj) {
                            var id = $(this).closest('tr').find('td:first-child').text();
                            if (id == data.UID) {
                                if (data.Name != null) {
                                    $(this).closest('tr').find('td:nth-child(2)').text(data.Name);
                                }
                                else {
                                    $(this).closest('tr').find('td:nth-child(2)').text("-");
                                }

                                if (data.ContactNo != null) {
                                    $(this).closest('tr').find('td:nth-child(3)').text(data.ContactNo);
                                }
                                else {
                                    $(this).closest('tr').find('td:nth-child(3)').text("-");
                                }

                                if (data.Email != null) {
                                    $(this).closest('tr').find('td:nth-child(4)').text(data.Email);
                                }
                                else {
                                    $(this).closest('tr').find('td:nth-child(4)').text("-");
                                }

                                if (data.Address != null) {
                                    $(this).closest('tr').find('td:nth-child(5)').text(data.Address);
                                }
                                else {
                                    $(this).closest('tr').find('td:nth-child(5)').text("-");
                                }

                                //$(this).closest('tr').find('td:nth-child(6)').text(data.IsActive);
                                if (data.IsActive) {
                                    $(this).closest('tr').find('td:nth-child(6)').html('<span class="label label-primary pull-right" style="width: 100px;">' + 'Active' + '</span>');
                                }
                                else if (!data.IsActive) {
                                    $(this).closest('tr').find('td:nth-child(6)').html('<span class="label label-danger pull-right"  style="width: 100px;">' + 'In Active' + '</span>');
                                }
                            }
                        });

                        $('#tblClients').DataTable().draw();
                    }
                    else {
                        swal("Error", "Data not updated!!", "error")
                        $('#btn-save').removeAttr('disabled');
                    }
                },
                "text"
            );
            }
            return false;

        }

    });

    $('.frmAddClients').keypress(function (e) {
        if (e.which == 13) {
            var CellNo = $("#ContactNo").val();
            if (CellNo.length > 0) {
                if (!CellNumberValidator(CellNo)) {
                    swal("Please provide valid Cell #.");
                    return;
                }
            }

            if ($('.frmAddClients').validate().form()) {
                $('.frmAddClients').submit();
            }
            return false;
        }
    });
    jQuery('#btn-save').click(function () {
        var CellNo = $("#ContactNo").val();
        if (CellNo.length > 0) {
            if (!CellNumberValidator(CellNo)) {
                swal("Please provide valid Cell #.");
                return;
            }
        }
        if ($('.frmAddClients').validate().form()) {
            $('.frmAddClients').submit();
        }
    });

}

var LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../ClientManagement/LoadGrid",
        processData: false,
        contentType: false,
        success: function (data) {
            //alert(data);
            data = JSON.parse(data);
            $('#tblClients').DataTable().destroy();
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

                if (obj.ContactNo != null) {
                    html += '<td>' + obj.ContactNo + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Email != null) {
                    html += '<td>' + obj.Email + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Address != null) {
                    html += '<td>' + obj.Address + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                //html += '<td>' + obj.IsActive + '</td>';
                if (obj.IsActive) {
                    console.log(obj.IsActive);
                    html += '<td><span class="label label-primary pull-right" style="width: 100px;">' + 'Active' + '</span></td>';
                }
                else if (!obj.IsActive) {
                    html += '<td><span class="label label-danger pull-right"  style="width: 100px;">' + 'In Active' + '</span></td>';
                }

                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                html += '<i class="fa fa-edit"></i>';
                html += ' Edit';
                html += ' </button>';
                html += ' </td>';

                html += ' <td>';
                html += '<a href="../ProductAssignmentManagement/Index/?UID=' + obj.UID + '" class="btn btn-info btn-block btn-xs ">';
                html += '<i class="fa fa-users"></i>';
                html += ' Rights';
                html += ' </a>';
                html += ' </td>';

                html += '</tr>'
            }
            $("#tblbody").append(html);
            $('#tblClients').DataTable().draw();
        }
    });
}

function Reset() {
    IsEditMode = false;
    GenerateCode();
    $('#Name').val('');
    $('#ContactNo').val('');
    $('#Email').val('');
    $('#Address').val('');
    $('#btn-save').html("<i class='fa fa-save'></i> Save");
    $("#IsActive").iCheck('uncheck');
}

$('#btn-refresh').click(function () {
    Reset();
});

// For number validation
function CellNumberValidator(CellNo) {
    var phoneno = /^[9]{1}[2]{1}[0-9]{10}$/;
    if (CellNo.match(phoneno)) {
        return true;
    }
    else {
        return false;
    }
}