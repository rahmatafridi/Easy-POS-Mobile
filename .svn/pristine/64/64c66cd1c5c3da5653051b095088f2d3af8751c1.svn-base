
var IsEditMode = false;
$(document).ready(function () {
    $('#tblVendor').DataTable();
    //handleStaff();
    LoadGridPayments();
    //Reset();

});

$(".DigitOnly").keypress(function (e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    // Allow non-printable keys
    if (!charCode || charCode == 8 /* Backspace */) {
        return;
    }

    var typedChar = String.fromCharCode(charCode);

    // Allow numeric characters
    if (/\d/.test(typedChar)) {
        return;
    }

    // Allow the minus sign (-) if the user enters it first
    //if (typedChar == "-" && this.value == "") {
    //    return;
    //}

    // In all other cases, suppress the event
    return false;
});

$("#IsActive").on('ifChecked', function (event) {
    $(this).closest("input").attr('value', true);
});
$("#IsActive").on('ifUnchecked', function (event) {
    $(this).closest("input").attr('value', false);
});

//handle stuff
var handleStaff = function () {
    $('.frmAddItem').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "",
        rules: {
            Name: {
                required: true,
                maxlength: 50,
            },
      CategoryId: {
                required: true
                 },
      UomId: {
             required: true
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
            $(".frmAddItem :disabled").removeAttr('disabled');
            if (!IsEditMode) {
                $.post("../ItemManagement/AddItem",
                    $(".frmAddItem").serialize(),
                    function (value) {
                        if (value != 'error') {
                            if (value == 'SESSION EXPIRED') {
                                window.location = '../Authentication/Login';
                            }
                            else if (value == 'exist')
                            {
                                swal("warning","Item name already exist! ","warning")
                                Reset();
                                return;
                            }
                            else {
                                swal(
                                  'Success',
                                  'Item Saved Successfully!',
                                  'success'
                                )

                                Reset();

                                $('#tblVendor').DataTable().destroy();
                                obj = JSON.parse(value);
                                obj = obj[0];
                                $('#btn-save').removeAttr('disabled');
                                 //alert(obj);
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
                                if (obj.Comment != null) {
                                    html += '<td>' + obj.Comment + '</td>';
                                }
                                else {
                                    html += '<td>-</td>';
                                }

                                html += '<td>' + obj.Status + '</td>';
                                html += '<td>';
                                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                                html += '<i class="fa fa-edit"></i>';
                                html += ' Edit';
                                html += ' </button></td>';

                                html += '</tr>'

                                $("#tbody").append(html);
                                $('#tblVendor').DataTable().draw();
                            }
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
                $.post( "../ItemManagement/EditItem",
                $(".frmAddItem").serialize(),
                function (value) {
                    if (value != 'error') {
                        
                        if (value == 'SESSION EXPIRED') {
                            window.location = '../Authentication/Login';
                        }
                        
                        else if (value == 'exist') {
                            swal("warning", "Item name already exist! ", "warning")
                            Reset();
                            return;
                        }
                        else if (value == 'assigned') {
                            swal("error", "Cant Change Assigned Item! ", "error")
                            Reset();
                            return;
                        }
                        else {
                                swal(
                                  'Success',
                                  'Item Updated Successfully!',
                                  'success'
                                )
                            Reset();
                            $('#btn-save').removeAttr('disabled');
                            var data = JSON.parse(value);
                            data = data[0];
                            //alert(data);
                            $('#tblVendor').DataTable().destroy();

                            $('#tblVendor tbody tr').each(function (i, obj) {
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
                                    if (data.CategoryName != null) {
                                        $(this).closest('tr').find('td:nth-child(4)').text(data.CategoryName);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(4)').text("-");
                                    }

                                    if (data.SubCategoryName != null) {
                                        $(this).closest('tr').find('td:nth-child(5)').text(data.SubCategoryName);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(5)').text("-");
                                    }
                                    
                                    if (data.UomName != null) {
                                        $(this).closest('tr').find('td:nth-child(6)').text(data.UomName);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(6)').text("-");
                                    }
                                    if (data.Comment != null) {
                                        $(this).closest('tr').find('td:nth-child(7)').text(data.Comment);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(7)').text("-");
                                    }

                                    $(this).closest('tr').find('td:nth-child(8)').text(data.Status);

                                }
                            });

                            $('#tblVendor').DataTable().draw();
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
            return false;

        }

    });
    $('.frmAddItem').keypress(function (e) {
        if (e.which == 13) {
           
            if ($('.frmAddItem').validate().form()) {
                $('.frmAddItem').submit();
            }
            return false;
        }
    });
    jQuery('#btn-save').click(function () {
        if ($('.frmAddItem').validate().form())
        {
            $('.frmAddItem').submit();
        }
    });
}

//load grid
var LoadGridPayments = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../VendorManagement/LoadGridPayments",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            $('#tblVendor').DataTable().destroy();
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


                if (obj.Contact != null) {
                    html += '<td>' + obj.Contact + '</td>';
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
               
                if (obj.Balance != null) {
                    html += '<td>' + obj.Balance + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
               
                html += '<td>';
                if (obj.IsActive) {

                    html += '<p  class="label label-success ">Active</p>';
                }
                else {
                    html += '<p  class="label label-danger ">InActive</p>';


                }
                html += '</td>';

                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-primary btn-block btn-xs btn-pay">';
                html += '<i class="fa fa-edit"></i>';
                html += ' Pay';
                html += ' </button></td>';             
                html += '</tr>'
            }
            $("#tbody").append(html);
            $('#tblVendor').DataTable().draw();
        }
    });
}

//reset values
var Reset = function () {
    IsEditMode = false;
    
    $('#Name').val('');
   
}

$(document).on('click', '.btn-pay', function () {
    var uid = $(this).attr('id');
    var data = new FormData();
    data.append("UID", uid);
    $.ajax({
        type: "POST",
        cache: false,
        url: "../VendorManagement/LoadVendorByUID",
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {
            if (Rdata != 'error') {
                var obj = JSON.parse(Rdata);
                $('#UID').val(obj.UID);

                $('#Pay').val('');
                $('#Name').removeAttr('disabled');
                $('#Contact').removeAttr('disabled');
                $('#Balance').removeAttr('disabled');

                $('#Name').val(obj.Name);
                $('#Contact').val(obj.Contact);
                $('#Balance').val(obj.Balance);

                $('#Name').attr('disabled', true);
                $('#Contact').attr('disabled', true);
                $('#Balance').attr('disabled', true);

                $('#myModal').modal('show');

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



$('#btnSave').on('click', function () {
   
    if ($('#Pay').val() == "" || $('#Pay').val() <1) {
        swal("warning", " Please Enter Rupees", "warning");
        return;
    }

    var p = parseInt($('#Pay').val());
    var b = parseInt($('#Balance').val());
    if ( p > -b ) {
        swal("warning", " You Can't pay more than balance", "warning");
        return;
    }

    var uid = $('#UID').val();
    var data = new FormData();
    data.append("UID", uid);
    data.append("totalPay", p);
    data.append("Comment", $('#Comment').val());
    $.ajax({
        type: "POST",
        cache: false,
        url: "../VendorManagement/PayToVendor",
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {
            if (Rdata != '') {

                var data = JSON.parse(Rdata);
                $('#tblVendor').DataTable().destroy();

                $('#tblVendor tbody tr').each(function (i, obj) {
                    var id = $(this).closest('tr').find('td:first-child').text();
                    if (id == data.UID) {
                        if (data.Balance != null) {
                            $(this).closest('tr').find('td:nth-child(6)').text(data.Balance);
                        }
                        else {
                            $(this).closest('tr').find('td:nth-child(6)').text("-");
                        }

                    }
                });

                $('#tblVendor').DataTable().draw();


                swal("success", " Payment Successfully", "success");
                $('#myModal').modal('hide');

                var url = '../ASPXPages/VendorPaymentReceipt.aspx?UID=' + data.UID + '&IsPrint=1&VpId='+data.VpId;
                openNewWin(url);

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

function openNewWin(url) {
    var x = window.open(url, '_blank', 'width=560,height=600,toolbar=1');
    x.focus();
}