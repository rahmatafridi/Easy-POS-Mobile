
var IsEditMode = false;
$(document).ready(function(){
    $('#tblProducts').DataTable();
    GenerateCode();
    LoadServiceDDL();
    handleStaff();
    LoadGridData();
});

//GenerateCode
var GenerateCode = function () {

    $.ajax({
        type: "POST",
        cache: false,
        url: "../ProductManagement/GenerateCode",
        processData: false,
        contentType: false,
        success: function (data) {
            $('#Code').val(data);
            $('#Code').attr('disabled', true);
        }
    });
}
//edit method
$(document).on('click', '.btn-edit', function () {
    var uid = $(this).attr('id');
    var data = new FormData();
    data.append("UID", uid);
    $.ajax({
        type: "POST",
        cache: false,
        url: "../ProductManagement/Edit",
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {
            if (Rdata != 'error') {
                var obj = JSON.parse(Rdata);

                $('#UID').val(obj.UID);
                $('#Code').val(obj.Code);
                $('#Name').val(obj.Name);
                $('#ServiceId').val(obj.ServiceId).trigger("chosen:updated");
                $('#ServiceId').prop('disabled', 'true').trigger("chosen:updated");
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

//handle stuff
var handleStaff = function () {
    $('.frmAddProducts').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "",
        rules: {
            Name: {
                required: true,
                maxlength: 50
            },
           ProductName: {
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
            $(".frmAddProducts :disabled").removeAttr('disabled');
            if (!IsEditMode) {
                $.post(
                    "../ProductManagement/AddProduct",
                    $(".frmAddProducts").serialize(),
                    function (value) {
                        if (value == 'exist') {
                            swal(
                             'Warning',
                             'Product Name Already Exist!',
                             'warning'
                           )
                            return;
                        }
                        if (value != 'error') {
                            swal(
                              'Success',
                              'Product Saved Successfully!',
                              'success'
                            )
                            Reset();
                            $('#btn-save').removeAttr('disabled');
                            $('#tblUsers').DataTable().destroy();

                            obj = JSON.parse(value);
                            obj = obj[0];

                            html += '';
                            var html = '<tr>';

                            html += '<td class="hidden">' + obj.UID + '</td>';

                            if (obj.Name != null) {
                                html += '<td>' + obj.Name + '</td>';
                            }
                            else {
                                html += '<td>-</td>';
                            }

                            if (obj.ServiceId != null) {
                                html += '<td>' + obj.ServiceId + '</td>';
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
                            $('#tblProducts').DataTable().draw();
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
                "../ProductManagement/EditProduct",
                $(".frmAddProducts").serialize(),
                function (value) {
                    if (status == 'exist') {
                        swal(
                              'Warning',
                              'Product Name Already Exist!',
                              'warning'
                            )
                    }
                    if (value != 'error') {
                        swal(
                              'Success',
                              'Product Updated Successfully!',
                              'success'
                            )
                        Reset();
                        $('#btn-save').removeAttr('disabled');
                        var data = JSON.parse(value);
                        //console.log(data);
                        data = data[0];
                        $('#tblProducts').DataTable().destroy();


                        $('#tblProducts tbody tr').each(function (i, obj) {
                            var id = $(this).closest('tr').find('td:first-child').text();
                            if (id == data.UID) {
                                if (data.Name != null) {
                                    $(this).closest('tr').find('td:nth-child(2)').text(data.Name);
                                }
                                else {
                                    $(this).closest('tr').find('td:nth-child(2)').text("-");
                                }
                                if (data.ServiceName != null) {
                                    $(this).closest('tr').find('td:nth-child(3)').text(data.ServiceName);
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

                        $('#tblProducts').DataTable().draw();
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
    $('.frmAddProducts').keypress(function (e) {
        if (e.which == 13) {
            if ($('.frmAddProducts').validate().form()) {
                $('.frmAddProducts').submit();
            }
            return false;
        }
    });
    jQuery('#btn-save').click(function () {
        if ($('.frmAddProducts').validate().form()) {
            $('.frmAddProducts').submit();
        }
    });
}


//for loading Services
var LoadServiceDDL = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../ProductManagement/LoadServiceDDL",
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

//load grid
var LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../ProductManagement/LoadGrid",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            $('#tblProducts').DataTable().destroy();
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
                if (obj.ServiceName != null) {
                    html += '<td>' + obj.ServiceName + '</td>';
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
            $('#tblProducts').DataTable().draw();
        }
    });
}

//reset values
function Reset() {
    IsEditMode = false;
    GenerateCode();
    LoadServiceDDL();
    $('#Name').val('');
    $("#IsActive").iCheck('uncheck');
    $('#btn-save').html("<i class='fa fa-save'></i> Save");
    $('#ServiceId').val("").trigger("chosen:updated");
}
$('#btn-refresh').click(function () {
    Reset();
});

