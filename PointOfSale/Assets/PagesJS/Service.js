
var IsEditMode = false;

$(document).ready(function () {
    GenerateCode();
    $('#tblServices').DataTable({ responsive: true });
    handleStaff();
    LoadGridData();
});

$(document).on('click', '.btn-edit', function () {
    var uid = $(this).attr('id');
    var data = new FormData();
    data.append("UID", uid);
    $.ajax({
        type: "POST",
        cache: false,
        url: "../ServiceManagement/Edit",
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
//GenerateCode
var GenerateCode = function () {

    $.ajax({
        type: "POST",
        cache: false,
        url: "../ServiceManagement/GenerateCode",
        processData: false,
        contentType: false,
        success: function (data) {
            $('#Code').val(data);
            $('#Code').attr('disabled', true);
        }
    });
}


var handleStaff = function () {
    $('.frmAddServices').validate({
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
            $('#btn-save').attr('disabled', 'true');
            $(".frmAddServices :disabled").removeAttr('disabled');
            if (!IsEditMode) {
                $.post(
                    "../ServiceManagement/AddService",
                    $(".frmAddServices").serialize(),
                    function (value) {
                        if (value == 'exist') {
                            swal(
                             'Warning',
                             'Service Name Already Exist!',
                             'warning'
                           )
                            return;
                        }
                        if (value != 'error') {
                            swal(
                              'Success',
                              'Service Saved Successfully!',
                              'success'
                            )
                            Reset();
                            $('#btn-save').removeAttr('disabled');
                            $('#tblServices').DataTable().destroy();

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

                            html += '<td>' + obj.IsActive + '</td>';

                            html += '<td>';
                            html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                            html += '<i class="fa fa-edit"></i>';
                            html += ' Edit';
                            html += ' </button>';
                            html += ' </td>';

                            html += '</tr>'

                            $("#tblbody").append(html);
                            $('#tblServices').DataTable().draw();
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
                "../ServiceManagement/EditService",
                $(".frmAddServices").serialize(),
                function (value) {
                    if (status == 'exist') {
                        swal(
                              'Warning',
                              'Service Name Already Exist!',
                              'warning'
                            )
                    }
                    if (value != 'error') {
                        swal(
                              'Success',
                              'Service Updated Successfully!',
                              'success'
                            )
                        Reset();
                        $('#btn-save').removeAttr('disabled');
                        var data = JSON.parse(value);
                        $('#tblServices').DataTable().destroy();

                        $('#tblServices tbody tr').each(function (i, obj) {
                            var id = $(this).closest('tr').find('td:first-child').text();
                            if (id == data.UID) {
                                if (data.Name != null) {
                                    $(this).closest('tr').find('td:nth-child(2)').text(data.Name);
                                }
                                else {
                                    $(this).closest('tr').find('td:nth-child(2)').text("-");
                                }
                                $(this).closest('tr').find('td:nth-child(3)').text(data.IsActive);
                            }
                        });

                        $('#tblServices').DataTable().draw();
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

    $('.frmAddServices').keypress(function (e) {
        if (e.which == 13) {           
            if ($('.frmAddServices').validate().form()) {
                $('.frmAddServices').submit();
            }
            return false;
        }
    });
    jQuery('#btn-save').click(function () {       
        if ($('.frmAddServices').validate().form()) {
            $('.frmAddServices').submit();
        }
    });

}
//Load Grid
var LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../ServiceManagement/LoadGrid",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            $('#tblServices').DataTable().destroy();
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

                html += '<td>' + obj.IsActive + '</td>';

                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                html += '<i class="fa fa-edit"></i>';
                html += ' Edit';
                html += ' </button>';
                html += ' </td>';

                html += '</tr>'
            }
            $("#tblbody").append(html);
            $('#tblServices').DataTable().draw();
        }
    });
}

function Reset() {
    IsEditMode = false;
    GenerateCode();
    $('#Name').val('');   
}

$('#btn-refresh').click(function () {
    Reset();
});