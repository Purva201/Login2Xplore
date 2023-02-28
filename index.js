/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//Input Fields: {Roll-No, Full-Name, Class, Birth-Date, Address, Enrollment-Date}
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stuDBName = "SCHOOL-DB";
var StuRelationName = "STUDENT-TABLE";
var connToken = "90932497|-31949274490261947|90949592";

$("#rollNo").focus();

function saveRecord(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj(){
    var rollno = $("#rollNo").val();
    var jsonStr = {
        id : rollno 
    };
    
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecord(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullName").val(record.name);
    $("#stu_class").val(record.stu_class);
    $("#birthData").val(record.birthdate);
    $("#address").val(record.address);
    $("#enrollmentDate").val(record.enrollmentdate);
}

function resetForm(){
    $("#rollNo").val('');
    $("#fullName").val('');
    $("#stu_class").val('');
    $("#birthDate").val('');
    $("#address").val('');
    $("#enrollmentDate").val('');
    $("#rollNo").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollNo").focus();
}

function validateData(){
    var rollno, fullname, stu_class, birthDate, address, enrollmentDate;
    rollno = $("#rollno").val();
    fullname = $("#fullName").val();
    stu_class = $("#stu_class").val();
    birthDate = $("#birthDate").val();
    address = $("#address").val();
    enrollmentDate = $("#enrollmentDate").val();
    
    if (rollno == ''){
        alert("Roll No is Missing");
        $("#rollNo").focus();
        return '';
    }
    
    if (fullname == ''){
        alert("Full Name is Missing");
        $("#fullname").focus();
        return '';
    }
    
    if (stu_class == ''){
        alert("Class is Missing");
        $("#stu_class").focus();
        return '';
    }
    
    if (birthDate == ''){
        alert("Birth Date is Missing");
        $("#birthDate").focus();
        return '';
    }
    
    if (address == ''){
        alert("Address is Missing");
        $("#address").focus();
        return '';
    }
    
    var jsonStrObj = {
        id : rollno,
        name : fullname,
        stu_class : stu_class,
        birthdate : birthDate,
        address : address
    };
    return JSON.stringify(jsonStrObj);
}

function getStu(){
    var rollnoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stuDBName, StuRelationName, rollnoJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.status == 400){
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullname").focus();
    
    }else if (resJsonObj.status == 200){
        $("#rollNo").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullname").focus();
    }  
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj == ''){
        return '';
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, stuDBName, StuRelationName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $("#rollno").focus();
}

function changeData(){
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stuDBName, StuRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    resetForm();
    $("#rollno").focus();
}