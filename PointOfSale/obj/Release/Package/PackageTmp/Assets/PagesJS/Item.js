﻿
var IsEditMode = false;
$(document).ready(function () {
    $('#tblItem').DataTable();
    CodeGenerate();
    handleStaff();
    LoadGridData();
    LoadCategories();
    LoadColor();
    LoadUom();
    LoadBarcode();
    LoadSizeDefault();
    LoadSubcategoryDefault();
    Reset();

});

//GenerateCode
var CodeGenerate = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../ItemManagement/CodeGenerate",
        processData: false,
        contentType: false,
        success: function (data) {
            $('#Code').removeAttr('disabled');
            $('#Code').val(data);
            $('#Code').attr('disabled', true);
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
            $('#Barcode').removeAttr('disabled');
            $('#Barcode').val(data);
            $('#Barcode').attr('disabled', true);
        }
    });

}


var LoadCategories = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../ItemManagement/LoadCategories",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);

            var $el = $('#CategoryId');
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="">' + "Select Category" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="">' + "Select Category" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}
var LoadUom = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../ItemManagement/LoadUom",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);

            var $el = $('#UomId');
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="">' + "Select Unit" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="">' + "Select Unit" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}
var LoadColor = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../ItemManagement/LoadColor",
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
                $el.append('<option value="">' + "Select Color" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}



var LoadSubCategory = function (CatId) {
    $.ajax({
        type: "POST",
        cache: false,
        async: false,
        url: "../ItemManagement/LoadSubCategory?CatId=" + CatId,
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);

            var $el = $('#SubCategoryId');
            $el.empty();
            $el.chosen('destroy');
            if (sch.length > 0) {
                $el.append('<option value="">' + "Select Sub Category" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="">' + "Select Sub Category" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}

$("#CategoryId").on('change', function () {
    if ($("#CategoryId option:selected").text() == 'mobiles' || $("#CategoryId option:selected").text() == 'mobile' || $("#CategoryId option:selected").text() == 'Used Mobile' || $("#CategoryId option:selected").text() == 'Used mobile' || $("#CategoryId option:selected").text() == 'used mobile' || $("#CategoryId option:selected").text() == 'Mobile' || $("#CategoryId option:selected").text() == 'Mobiles') {
        $(".hideColor").hide();
    }
    else {
        $(".hideColor").show();
    }
    Populate_Chain_DropDown();
});

function Populate_Chain_DropDown() {
    var CatId = $('#CategoryId').val();
    LoadSubCategory(CatId);

}

//for startup value
var LoadSizeDefault = function () {
    $.ajax({
        type: "POST",
        cache: false,
        async: false,
        url: "../ItemManagement/LoadSize",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);

            var $el = $('#SizeId');
            $el.empty();
            $el.chosen('destroy');
            if (sch.length > 0) {
                $el.append('<option value="">' + "Select Size" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="">' + "Select Size" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}

var LoadSubcategoryDefault = function () {

    var $el = $("#SubCategoryId");
    $el.empty();

    $el.append('<option value="0">' + "Select Sub Category" + '</option>');

    $el.trigger("liszt:updated");
    $el.chosen();
}



//edit method
$(document).on('click', '.btn-edit', function () {
    var uid = $(this).attr('id');
    var data = new FormData();
    data.append("Id", uid);

    $.ajax({
        type: "POST",
        cache: false,
        url: "../ItemManagement/Edit",
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {
            if (Rdata != 'error') {
                var obj = JSON.parse(Rdata);                

                $('#UID').val(obj.UID);
                $('#Name').val(obj.Name);
                $('#CategoryId').val(obj.CategoryId).trigger("chosen:updated");
                Populate_Chain_DropDown();
                $('#SubCategoryId').val(obj.SubCategoryId).trigger("chosen:updated");
                $('#ColorId').val(obj.ColorId).trigger("chosen:updated");
                $('#SizeId').val(obj.SizeId).trigger("chosen:updated");
                $('#UomId').val(obj.UomId).trigger("chosen:updated");
                $('#Code').val(obj.Code);
                $('#CostPrice').val(obj.CostPrice);
                $('#SalePrice').val(obj.SalePrice);                
                $('#Description').val(obj.Description);
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
    $('.frmAddItem').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "",
        rules: {
            
            CategoryId: {
                required: true
            },
            UomId: {
                required: true
            },
            CostPrice: {
                required: true
            },
            SalePrice: {
                required: true
            }
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
                            else if (value == 'costgreaterthansale') {
                                swal("warning", "Please Enter Valid Cost & Sale Price, Cost Price cannot be greater than Sale Price", "warning")                                
                                return;
                            }
                            else if (value == 'exist') {
                                swal("warning", "Item name already exist! ", "warning")
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

                                $('#tblItem').DataTable().destroy();
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
                                if (obj.SubCategroyName != null) {
                                    html += '<td>' + obj.SubCategroyName + '</td>';
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

                                if (obj.Status) {
                                    html += '<td><span class="label label-success label-xs">Active</span></td>';
                                }
                                else {
                                    html += '<td><span class="label label-danger label-xs">In Active</span></td>';
                                }
                                html += '<td>';
                                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                                html += '<i class="fa fa-edit"></i>';
                                html += ' Edit';
                                html += ' </button></td>';

                                html += '</tr>'

                                $("#tbody").append(html);
                                $('#tblItem').DataTable().draw();
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
                $.post("../ItemManagement/EditItem",
                $(".frmAddItem").serialize(),
                function (value) {
                    if (value != 'error') {

                        if (value == 'SESSION EXPIRED') {
                            window.location = '../Authentication/Login';
                        }
                        else if (value == 'costgreaterthansale') {
                            swal("warning", "Please Enter Valid Cost & Sale Price, Cost Price cannot be greater than Sale Price", "warning");
                            $('#btn-save').removeAttr('disabled');
                            return;
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
                            $('#tblItem').DataTable().destroy();

                            $('#tblItem tbody tr').each(function (i, obj) {
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

                                    if (data.SubCategroyName != null) {
                                        $(this).closest('tr').find('td:nth-child(5)').text(data.CategoSubCategroyNameryName);
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

                                    if (data.Status) {
                                        //alert(data.IsActive);
                                        $(this).closest('tr').find('td:nth-child(8)').html('<td><span class="label label-success label-xs">Active</span></td>');
                                    }
                                    else {
                                        //alert(data.IsActive);
                                        $(this).closest('tr').find('td:nth-child(8)').html('<td><span class="label label-danger label-xs">In Active</span></td>');
                                    }
                                }
                            });

                            $('#tblItem').DataTable().draw();
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
        if ($('.frmAddItem').validate().form()) {
            $('.frmAddItem').submit();
        }
    });
}

//load grid
var LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../ItemManagement/LoadGrid",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            $('#tblItem').DataTable().destroy();
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


                if (obj.CategoryName != null) {
                    html += '<td>' + obj.CategoryName + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.SubCategroyName != null) {
                    html += '<td>' + obj.SubCategroyName + '</td>';
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

                if (obj.Status) {
                    html += '<td><span class="label label-success label-xs">Active</span></td>';
                }
                else {
                    html += '<td><span class="label label-danger label-xs">In Active</span></td>';
                }

                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                html += '<i class="fa fa-edit"></i>';
                html += ' Edit';
                html += ' </button></td>';
                html += '</tr>'
            }
            $("#tbody").append(html);
            $('#tblItem').DataTable().draw();
        }
    });
}

//reset values
var Reset = function () {
    IsEditMode = false;

    $('#Name').val('');
    $('#Description').val('');
    $('#Barcode').val('');
    $("#IsActive").iCheck('uncheck');
    $('#btn-save').html("<i class='fa fa-save'></i> Save");
    $('#CategoryId').val("").trigger("chosen:updated");
    $('#SubCategoryId').val("").trigger("chosen:updated");
    $('#ColorId').val("").trigger("chosen:updated");
    $('#SizeId').val("").trigger("chosen:updated");
    $('#UomId').val("").trigger("chosen:updated");
    $('#CostPrice').val('');
    $('#SalePrice').val('');
    LoadCategories();
    LoadColor();
    LoadUom();
    LoadBarcode();
    CodeGenerate();
    $('#BTypeId').val(1);
    $('#BTypeId').prop('disabled', false).trigger("chosen:updated");
    // $('#BtypeId').val("").trigger("chosen:updated");
}
$('#btn-refresh').click(function () {
    Reset();
});

$("#CostPrice").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && e.which != 46) {
        return false;
    }
});

$("#SalePrice").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && e.which != 46) {
        return false;
    }
});


