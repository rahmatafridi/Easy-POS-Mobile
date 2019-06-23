
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
        var v = $(selected).val();
        $("#box2View option[value='" + v + "']").remove();
    });
});

//Save Changes..

$('#btn-save').click(function () {
    //hidebtn('#btn-save');
    $('#btn-save').attr('disabled', 'true');
    var UID = $('#UserID').val();

    var list = [];

    $('#box2View option').each(function () {
        var v = $(this).val();
        list.push(v);
    });

    $.ajax({
        type: "POST",
        cache: false,
        url: "../../UserRights/Save",
        data: {
            sel: list,
            UserID: UID
        },
        traditional: true,
        success: function (data) {
            if (data != '' && data != null) {
                if (data != 'error' && data != 'Error') {
                    $('#btn-save').removeAttr('disabled');
                    swal({
                        title: 'Success',
                        text: 'Rights Assigned to Successfully!',
                        timer: 2000
                    }).then(
                    function () {
                        window.location.href = "/UserManagement/Index";
                    },
                   // handling the promise rejection
                   function (dismiss) {
                       if (dismiss === 'timer') {
                           window.location.href = "/UserManagement/Index";
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

