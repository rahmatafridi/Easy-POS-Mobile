<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Barcode.aspx.cs" Inherits="WebixoftBoutiqueProduction.ASPX_Pages.Barcode" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script>
        function printpage() {
            var p = getParameterByName('IsPrint');
            console.log(p);
            if (p == 0) {

            } else {
                window.print(true)                
                setTimeout(function () { window.close(); }, 1);
            }

        }

        function cl() {
            window.close()
        }

        // Getting Value From Query String By Param Name
        function getParameterByName(name) {
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        }

    </script>
    <style>
        .format {
            /*margin-top: 5px;
            margin-left: 10px;
            width: 105px;
            height: 90px;*/
            /*border: 1px solid;*/
        }
        #lblDescription {
            font-size: 12px;
            text-align:center;
            font-family:Candara;
        }
        #lblArticle {
            font-size: 10px;
            text-align:center;
        }
        #lblSize {
            font-size: 10px;
        }
        #lblColor {
            font-size: 10px;
        }
        .lefttd {
        width: 50%;
        text-align: left;
        font-family:Candara;
        } 
        .righttd {
        width: 50%;
        text-align: right;
        font-family:Candara;
        }

        #lblItem {
        font-size: small;
        margin-left: 15px;
        }
        #lblCategory {
        font-size: small;
        margin-left: 15px;
        }
    </style>


</head>
<body onload="printpage();">
    <form id="form1" runat="server">
        <div class="format">
            <input type="hidden" id="barcode" runat="server" />
            
            <table>
                
                <tr>
                   
                </tr>
                <tr>
                     <td>
                        <img src="../Images/logo2.png" style="width:58px;"/>
                    </td>
                   
                    <td >
                        <div id="barcodeTarget" class="barcodeTarget pull-right" style="margin-left:5px;"></div>
                        <div id="lblItem" runat="server"></div>
                        <div id="lblCategory" runat="server"></div>
                      
                    </td>
                    
                </tr>
  
            </table>   
            <table>
               <tr>
                   <td>
                        <p id="lbladdrss" style="margin-top:-6px; font-size:12px;">Khayam Town Road H-13 Near<br /> &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;Sain Mirchu Darbar </p>
                   </td>
               </tr>
            </table>                     
            
            
        </div>
    </form> 
       
    
    <link href="../Plugins/BarcodeGenerator/jquerysctipttop.css" rel="stylesheet" />
    <script src="../Plugins/BarcodeGenerator/jquery-latest.min.js"></script>    
    <script src="../Plugins/BarcodeGenerator/jquery-barcode.min.js"></script>
    <script>
        $(document).ready(function () {
            generateBarcode();
        });

        function generateBarcode() {

            var value = $("#barcode").val();
            var btype = "code39";
            var renderer = "css";
            var quietZone = true;

            var settings = {
                output: renderer,
                bgColor: "#FFFFFF",
                color: "#000000",
                barWidth: "1",
                barHeight: "22",
                moduleSize: "5",
                posX: "10",
                posY: "20",
                addQuietZone: "1"
            };

            value = { code: value, rect: true };
            $("#barcodeTarget").html("").show().barcode(value, btype, settings);
        }
    </script>


</body>
</html>
