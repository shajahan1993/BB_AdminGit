import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PropertyServiceService } from "../property-service.service";
import { SuccessComponent } from "../success/success.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { DatePipe } from "@angular/common";
import * as XLSX from "xlsx";
import { throwError } from "rxjs";
// import { FileToUpload } from "./file-to-upload";
// import { FileUploadService } from "./file-upload.service";
// import { FileToUpload } from "./file-to-upload";

export interface DialogData {
  // imgPath: string;

  title: string;
  fileName: string;
  divType: string;
  school_name: string;
  school_address: string;
  school_state: string;
  school_ZipCode: string;
  school_id: any;
  admin_id: any;
  admin_school_id: any;
  admin_name: string;
  admin_username: string;
  admin_email: string;
  admin_password: string;
  //User fields
  email: any;
  schoolId: any;
  userSchoolName: any;
  userTypeId: any;
  name: any;
  userPhone: any;
  parentId: any;
  grade: any;
  parentPhone1: any;
  parentPhone2: any;
  driverPhone: any;
  schoolPhone: any;
  gender: any;
  address: any;
  zipCode: any;
  city: any;
  state: any;
  busRoute: any;
  password: any;

  isSocialUser: any;
  socialMediaId: any;
  fbCyber: any;
  instaCyber: any;
  snapShotCyber: any;

  //incident
  id: any;
  age: any;
  userId: any;
  bullyName: any;
  incidentPlace: any;
  isBullyClassmate: any;
  bullyGender: any;
  noOfDaysBullied: any;
  bullyType: any;
  bullyDescription: any;
  videoURL: any;
  bullyStatus: any;

  //teachers table
  teacher_name: any;

  //Drivers table
  driver_id: any;

  //Report Form
  fileURL: any;
  latitude: any;
  langitude: any;
  type: any;
  // sub_ser_id: any;

  //Excel Upload
}

@Component({
  selector: "app-dialog-modal",
  templateUrl: "./dialog-modal.component.html",
  styleUrls: ["./dialog-modal.component.css"],
})
export class DialogModalComponent implements OnInit {
  allSchoolList=[];
  schoolList = [];
  searchSchoolId:any;
  adminSchoolList = [];
  userTypeList = [];
  busRouteList = [];
  stateId: any;
  stateList: any;
  excel_file: any;
  fileName: string = "";
  fileSize: number = 0;
  fileType: string = "";
  tabledata: any;
  columnArray = [];
  title: string;
  divType: string;
  type: boolean;
  showSuccess: boolean;
  category_name1: string;
  isSuperAdmin: boolean = false;
  adminSchoolId: any;
  isSocialUser = "";
  selectedValue: any = [];
  selectedState: any;
  selectedSchool: any;
  selectedGenderValue: any;
  selectedBullyGender: any;
  selectedBullyClass: any;
  selectedBullyStatus: any;
  showFields: boolean = false;
  repAddress: any;
  userTypeId: any;
  userIds: any;
  editSchoolId: any;
  // adminSchoolId:any;
  teacherSchool:any;
  schoolId: any;
  adminSchoolid=[];
  userInfo = JSON.parse(localStorage.getItem("UserInfo"));
  busRoute: any;
  parentId: any;
  fileUrl: any;
  fileformat: any;
  zipCodesrch: any;
  userEditBusRoute: any;
  editUserZipCode: any;
//variables for input validation
  validEmail="";
  validPassword="";
  validUName="";
  validState="";
  validSchool=""
  validGender="";
  validGrade="";
  validUPhone="";
  validPPhone1="";
  validAdminId="";
  validAName="";
  validAPassword="";
  validSName="";
  validSAddress="";
  validSState="";
  validSZipCode="";
  validTSchool="";
  validTUName="";
  validTGrade="";
  validBRoute="";
  validBDId="";
  validBDSchool="";
  dropSchoolName:any;
//  config = {
//             displayKey:"description", //if objects array passed which key to be displayed defaults to description
//             search:true, //true/false for the search functionlity defaults to false,
//             height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
//             placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
//             customComparator: ()=>{} ,// a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
//             limitTo: 0, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
//             moreText: 'more' ,// text to be displayed whenmore than one items are selected like Option 1 + 5 more
//             noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
//             searchPlaceholder:'Search' ,// label thats displayed in search input,
//             searchOnKey: 'name', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
//             }


  constructor(
    public dialogRef: MatDialogRef<DialogModalComponent>,
    private router: Router,
    private formBuilder: FormBuilder,
    public alertDialog: MatDialog,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
    private property: PropertyServiceService
  ) {}

  editForm: FormGroup;
  saveForm: FormGroup;
  adminSaveForm: FormGroup;
  adminEditForm: FormGroup;
  saveUserForm: FormGroup;
  editUserForm: FormGroup;
  editIncident: FormGroup;
  saveTeacherForm: FormGroup;
  editTeacherForm: FormGroup;
  saveBusRouteForm: FormGroup;
  editBusRouteForm: FormGroup;
  saveReportForm: FormGroup;
  editReportForm: FormGroup;
  excelUploadForm: FormGroup;
  ebbFileForm: FormGroup;
  url = this.property.uri;

  ngOnInit() {
    // this.getAllSchools();
    this.getAllUserTypes();
    this.getAllBusRoute();

    this.stateList = localStorage.getItem("States");
    this.stateList = JSON.parse(this.stateList);
      // console.log("AdminState",this.stateList);
    // let stateArray:any;
    // stateArray= localStorage.getItem("States");
    // stateArray = JSON.parse(stateArray);

    // if (this.userInfo.schoolid === 0) {
    //   this.isSuperAdmin = true;

    // this.stateList = localStorage.getItem("States");
    // this.stateList = JSON.parse(this.stateList);

    // }else{
    //   this.isSuperAdmin = false;
    //  for(let i=0;i<stateArray.length;i++){
    //   if(this.userInfo.stateId === stateArray[i].id){
    //     this.stateList=stateArray[i];
    //     console.log("AdminState",this.stateList);
    //   }
    // }
    // }


    this.schoolList=[{'id':'','SchoolName':''}];
    this.selectedBullyStatus = this.data.bullyStatus;
    this.title = this.data.title;
    this.divType = this.data.divType;
    this.fileUrl = this.data.fileURL;
    this.fileformat = this.data.type;
    this.fileName = this.data.fileName;
    this.adminSchoolId = this.data.admin_school_id;
    console.log("TYPe",this.fileformat);
    console.log("ADMinID",this.adminSchoolId)
    if(this.adminSchoolId !== ""&& this.adminSchoolId !== undefined){
      this.getSchoolById(this.adminSchoolId);
    }
    // console.log("adminSchoolId", this.adminSchoolId);
    this.schoolId = this.data.school_id;
    this.teacherSchool=this.data.school_id;
    if(this.teacherSchool !==""&&this.teacherSchool !==undefined){
      this.getSchoolById(this.teacherSchool)
    }
    console.log("teacherSchool",this.teacherSchool);
    this.parentId = this.data.parentId;
    // if (this.data.schoolId !== "") {
    this.userIds = this.data.userTypeId;
    this.editSchoolId = this.data.schoolId;
    if(this.editSchoolId !=="" && this.editSchoolId !== undefined){
      this.getSchoolById(this.editSchoolId)
    }
    this.userTypeId = this.data.userTypeId;
    this.userEditBusRoute = this.data.busRoute;
    this.editUserZipCode = this.data.zipCode;
    console.log("EDITSchool",this.data.schoolId);
    // this.userIds = this.data.userTypeId;
    // console.log("userIds", this.userEditBusRoute);
    this.selectedBullyClass = this.data.isBullyClassmate;
    this.selectedBullyGender = this.data.bullyGender;
    // console.log("BullyGender", this.selectedBullyGender);
    // Valid Form Fields
    this.validEmail = this.data.email;
    this.validUName = this.data.name;
    this.validSchool = this.data.schoolId;
    this.validState = this.data.state;
    this.validGrade = this.data.grade;
    this.validGender = this.data.gender;
    this.validUPhone = this.data.userPhone;
    this.validPPhone1 = this.data.parentPhone1;
    this.validAdminId = this.data.admin_id;
    this.validAName = this.data.admin_username;
    this.validAPassword = this.data.admin_password;
    this.validTUName = this.data.teacher_name;
    this.validTSchool = this.data.school_id;
    this.validTGrade = this.data.grade;
    this.validSName = this.data.school_name;
    this.validSAddress = this.data.school_address;
    this.validSState = this.data.school_state;
    this.validSZipCode = this.data.zipCode
    this.validBRoute = this.data.busRoute;
    this.validBDId = this.data.driver_id;
    this.validBDSchool = this.data.school_id;
    // end ///

    this.selectedValue = this.data.school_state;
    this.selectedState = this.data.state;
    this.selectedGenderValue = this.data.gender;
    this.repAddress = this.data.address;
    console.log("selectedValue", this.selectedState);
    if (this.userInfo.schoolid === 0) {
      this.isSuperAdmin = true;
      // console.log("SDF", this.isSuperAdmin);
    }else{
      this.isSuperAdmin = false;
      this.getSchoolById(this.userInfo.schoolid)
    }

    if (
      // (this.data.zipCode !== "" ||
      //   this.data.zipCode !== undefined ||
      //   this.data.zipCode !== null) &&
      (this.data.state !== "" ||
        this.data.state !== undefined ||
        this.data.state !== null)
    ) {
      this.zipCodesrch = this.data.zipCode;
      this.getSchoolByStateZip();
    }
    this.editForm = this.formBuilder.group({
      school_name: [this.data.school_name],
      school_address: [this.data.school_address],
      school_state: [this.data.school_state],
      school_ZipCode: [this.data.zipCode],
      // this.selectedValue= [this.data.school_state],
    });

    this.saveForm = this.formBuilder.group({
      school_name: [""],
      school_address: [],
      school_id: [],
      school_state: [],
      school_ZipCode: [],
    });
    // this.ebbFileForm = this.formBuilder.group({});
    this.adminSaveForm = this.formBuilder.group({
      admin_school_id: [],
      admin_name: [""],
      admin_username: [],
      admin_email: [],
      admin_password: [],
      admin_zipCode:[]
    });

    this.adminEditForm = this.formBuilder.group({
      admin_school_id: [this.data.admin_school_id],
      // admin_name: [""],
      admin_username: [this.data.admin_username],
      // admin_email: [],
      admin_password: [this.data.admin_password],
      admin_id: [this.data.admin_id],
      admin_zipCode:[]
    });

    this.saveUserForm = this.formBuilder.group({
      email: [],
      schoolId: [],
      userTypeId: [],
      name: [],
      userPhone: [],
      parentId: [],
      password: [],
      grade: [],
      parentPhone1: [],
      parentPhone2: [],
      driverPhone: [],
      schoolPhone: [],
      gender: [],
      address: [],
      zipCode: [],
      city: [],
      state: [],
      busRoute: [],
      isSocialUser: [],
      socialMediaId: [],
      fbCyber: [],
      instaCyber: [],
      snapShotCyber: [],
      // gender: new FormControl('', Validators.required)
    });

    this.editUserForm = this.formBuilder.group({
      id: [this.data.id],
      email: [this.data.email],
      schoolId: [this.data.schoolId],
      userTypeId: [this.data.userTypeId],
      name: [this.data.name],
      userPhone: [this.data.userPhone],
      parentId: [this.data.parentId],
      grade: [this.data.grade],
      parentPhone1: [this.data.parentPhone1],
      parentPhone2: [this.data.parentPhone2],
      driverPhone: [this.data.driverPhone],
      schoolPhone: [this.data.schoolPhone],
      gender: [this.data.gender],
      address: [this.data.address],
      zipCode: [this.data.zipCode],
      city: [this.data.city],
      // state: [this.data.state],
      busRoute: [this.data.busRoute],
    });
    this.editIncident = this.formBuilder.group({
      id: [this.data.id],
      userId: [this.data.userId],
      name: [this.data.name],
      grade: [this.data.grade],
      schoolId: [this.data.schoolId],
      age: [this.data.age],
      gender: [this.data.gender],
      bullyName: [this.data.bullyName],
      incidentPlace: [this.data.incidentPlace],
      isBullyClassmate: [this.data.isBullyClassmate],
      bullyGender: [this.data.bullyGender],
      noOfDaysBullied: [this.data.noOfDaysBullied],
      bullyType: [this.data.bullyType],
      bullyDescription: [this.data.bullyDescription],
      videoURL: [this.data.videoURL],
      bullyStatus: [this.data.bullyStatus],
    });
    this.saveTeacherForm = this.formBuilder.group({
      teacher_name: [],
      school_id: [],
      grade: [],
      teacher_zipCode:[]
    });

    this.excelUploadForm = this.formBuilder.group({
      excel_file: [],
    });

    this.editTeacherForm = this.formBuilder.group({
      id: [this.data.id],
      teacher_name: [this.data.teacher_name],
      school_id: [this.data.school_id],
      grade: [this.data.grade],
    });

    this.saveBusRouteForm = this.formBuilder.group({
      busRoute: [],
      driver_id: [],
      school_id: [],
      bus_zipCode:[]
    });

    this.editBusRouteForm = this.formBuilder.group({
      id: [this.data.id],
      busRoute: [this.data.busRoute],
      driver_id: [this.data.driver_id],
      school_id: [this.data.school_id],
      bus_zipCode:[]
    });

    this.saveReportForm = this.formBuilder.group({
      userId: [],
      school_id: [],
      fileURL: [],
      latitude: [],
      langitude: [],
    });

    this.editReportForm = this.formBuilder.group({
      id: [this.data.id],
      userId: [this.data.userId],
      school_id: [this.data.school_id],
      fileURL: [this.data.fileURL],
      latitude: [this.data.latitude],
      langitude: [this.data.langitude],
    });
  }

  close() {
    this.dialogRef
      .close
      // this.router.navigateByUrl('/admin')
      ();
  }
  stateDropDown(eve) {
    this.stateId = eve;
  }

  userSchoolDropDown(eve) {
    this.schoolId = eve;
    this.editSchoolId = this.schoolId;
    this.validBDSchool = eve;
    this.validTSchool = eve;
    console.log("SelectSchool", this.schoolId);
  }

  saveSchool() {
    let school_name = this.saveForm.get("school_name").value;
    let school_address = this.saveForm.get("school_address").value;
    let stateId = this.saveForm.get("school_state").value;
    let zipCode = this.saveForm.get("school_ZipCode").value;
    let formObj = {
      schoolName: school_name,
      schoolAddress: school_address,
      stateId: stateId,
      zipCode: zipCode,
    };
    if (school_name != "" && school_name != undefined) {
      this.http
        .post(this.url + "bully-buddy/school/add_school", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "School Added Successfuly", type: true },
          });
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "School Adding Failed", type: false },
          });
          }
        });
    }
  }
  editSchool() {
    let school_name = this.editForm.get("school_name").value;
    let school_address = this.editForm.get("school_address").value;
    let zipCode = this.editForm.get("school_ZipCode").value;
    let formData = {
      id: this.data.school_id,
      schoolName: school_name,
      schoolAddress: school_address,
      stateId: this.selectedValue,
      zipCode: zipCode,
    };
    if (school_name != "" && school_name != undefined) {
      this.http
        .post(this.url + "bully-buddy/school/update_school", formData)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "School Update Successfuly", type: true },
          });
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "School Update Failed", type: false },
          });
          }
        });
    }
  }

  saveAdmin() {
    let school_id = this.adminSaveForm.get("admin_school_id").value;
    let admin_username = this.adminSaveForm.get("admin_username").value;
    let admin_password = this.adminSaveForm.get("admin_password").value;
    let formObj = {
      schoolid: this.schoolId,
      username: admin_username,
      password: admin_password,
    };
    if (admin_username !== "" && admin_username !== undefined) {
      this.http
        .post(this.url + "bully-buddy/admin/add_admin", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Admin Added Successfully", type: true },
          });
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Admin Adding Failed", type: false },
          });
          }
        });
    }
  }
  editAdmin() {
    let school_id = this.adminEditForm.get("admin_school_id").value;
    let admin_username = this.adminEditForm.get("admin_username").value;
    let admin_password = this.adminEditForm.get("admin_password").value;

    if (
      this.schoolId === "" ||
      this.schoolId === null ||
      this.schoolId === undefined
    ) {
      this.schoolId = this.adminSchoolId;
    }
    let formData = {
      id: this.data.admin_id,
      schoolid: this.schoolId,
      username: admin_username,
      password: admin_password,
    };
    if (admin_username != "" && admin_username != undefined) {
      this.http
        .post(this.url + "bully-buddy/admin/update_admin", formData)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Admin Update successfuly", type: true },
          });
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Admin Update Failed", type: false },
          });
          }
        });
    }
  }
  dayFilter(eve) {
    this.selectedValue = eve;
  }
  selectGender(eve) {
    this.selectedGenderValue = eve;
  }
  busRouteDropDown(eve) {
    // console.log("BUS", eve);
    this.busRoute = eve;
  }
  userTypeDropDown(eve) {
    console.log(eve);
    this.userTypeId = eve;
    if (
      this.userTypeId !== "" ||
      this.userTypeId !== undefined ||
      this.userTypeId !== null
    ) {
      this.showFields = true;
      this.saveUserForm;
    }
    // console.log("VAlidEmail",this.validPassword);
  }
  userStateDropDown(eve) {
    console.log("state", eve);
    // console.log("opt", opt);
    this.selectedState = eve;
    // &&(this.zipCodesrch !== undefined || this.zipCodesrch !== "")
    if (
      (this.selectedState !== undefined || this.selectedState !== "")
    ) {
      for(let i =0;i<this.stateList.length;i++){
        if(this.selectedState === this.stateList[i].statename){
            this.searchSchoolId = this.stateList[i].id
        }
      }
      console.log("searchSchoolId",this.searchSchoolId);
      // this.getSchoolByStateZip();
      // let formObj = {
      //   zipCode: this.zipCodesrch,
      // };
      // return new Promise((resolve, reject) => {
      //   this.http
      //     .post(
      //       this.url +
      //         "bully-buddy/school/get_school_by_statename_zipcode" +
      //         "?statename=" +
      //         this.selectedState,
      //       formObj
      //     )
      //     .subscribe((res: any) => {
      //       if (res.status == "200") {
      //         this.schoolList = res.result;
      //         console.log("SChpols", this.schoolList);
      //       } else {
      //         alert(res.message + " : " + res.result);
      //       }
      //       resolve();
      //     });
      // });
    }
  }

  searchSchool(eve) {
    // console.log("ZipCode", eve);
    this.zipCodesrch = eve;
    if (
      (eve !== "" || eve !== undefined) ||
      (this.selectedState !== "" || this.selectedState !== undefined)
    ) {
      // this.getSchoolByStateZip();
    }
    if(eve === "" || eve === undefined){
      this.zipCodesrch = null;
    }
  }

  getSchoolByStateZip() {
console.log("ZIP",this.zipCodesrch)
if(this.zipCodesrch===undefined||this.zipCodesrch===null){
  this.zipCodesrch="";
}
    let formObj = {
      zipCode: this.zipCodesrch,
    };
    let selectedState: any;
    console.log("DATASTATE", this.data.state);
    console.log("selectedSATE", this.selectedState);
    if (
      this.data.state !== "" ||
      this.data.state !== undefined ||
      this.data.state !== null
    ) {
      // alert("Hit");
      this.selectedState = this.selectedState;
    } else {
      this.selectedState = this.data.state;
    }

    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.url +
            "bully-buddy/school/get_school_by_statename_zipcode" +
            "?statename=" +
            this.selectedState,
          formObj
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.schoolList = res.result;
            this.allSchoolList = res.result;
            // console.log("SChpols", this.schoolList);
            if (this.schoolList.length === 1) {
              this.editSchoolId = this.schoolList[0].id;
            }
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
    });
  }
  saveUser() {
    // let school_name = this.saveForm.get("school_name").value;
    // let school_address = this.saveForm.get("school_address").value;

      //////  Validate the Fields ////

      this.validEmail = this.saveUserForm.get("email").value;
      this.validPassword = this.saveUserForm.get("password").value;
      this.validSchool = this.schoolId;
      this.validUName = this.saveUserForm.get("name").value;
      this.validUPhone = this.saveUserForm.get("userPhone").value;
      this.validState = this.selectedState;


    let parentPhone1;
    let busRoute;
    let email = this.saveUserForm.get("email").value;
    let password = this.saveUserForm.get("password").value;
    let schoolId = this.schoolId;
    let userTypeId = this.userTypeId;
    let name = this.saveUserForm.get("name").value;
    let userPhone = this.saveUserForm.get("userPhone").value;
    let parentId = this.saveUserForm.get("parentId").value;
    let grade = this.saveUserForm.get("grade").value;
    if (this.userTypeId !== "1") {
      parentPhone1 = "0";
      this.validPPhone1 = parentPhone1;
    } else {
      parentPhone1 = this.saveUserForm.get("parentPhone1").value;
      this.validPPhone1 = parentPhone1;
    }

    let parentPhone2 = this.saveUserForm.get("parentPhone2").value;
    let driverPhone = this.saveUserForm.get("driverPhone").value;
    let schoolPhone = this.saveUserForm.get("schoolPhone").value;
    let gender = this.selectedGenderValue;

    let address = this.saveUserForm.get("address").value;
    let zipCode = this.saveUserForm.get("zipCode").value;
    let city = this.saveUserForm.get("city").value;
    // let state = this.saveUserForm.get("state").value;
    let state = this.selectedState;
    if (this.userTypeId === 1 || this.userTypeId === 4) {
      busRoute = this.busRoute;
    } else {
      busRoute = null;
    }
    // let isSocialUser = this.saveUserForm.get("isSocialUser").value;
    let socialMediaId = this.saveUserForm.get("socialMediaId").value;
    let fbCyber = this.saveUserForm.get("fbCyber").value;
    let instaCyber = this.saveUserForm.get("instaCyber").value;
    let snapShotCyber = this.saveUserForm.get("snapShotCyber").value;

    let formObj = {
      email: email,
      password: password,
      schoolId: schoolId,
      userTypeId: userTypeId,
      name: name,
      userPhone: userPhone,
      parentId: null,
      grade: grade,
      parentPhone1: parentPhone1,
      parentPhone2: parentPhone2,
      driverPhone: driverPhone,
      schoolPhone: schoolPhone,
      gender: this.selectedGenderValue,
      address: address,
      zipCode: zipCode,
      city: city,
      state: this.selectedState,
      busRoute: busRoute,
      isSocialUser: 0,
      socialMediaId: "",
      fbCyber: "",
      instaCyber: "",
      snapShotCyber: "",
    };
console.log("gender",gender);
console.log("schoolId",schoolId);

// to show validation message

    if(email==''){

    }
    if(gender==undefined){
        alert("Please Enter gender.");
    }
   if(schoolId==null){
      alert("Please selecte State to add School in order to save.");
    }

    // End ///
console.log("SaveUSer",formObj);
    if ((name != "" && name != undefined)&&(gender=="M"||gender=="F")&&(schoolId!=null)) {
      this.http
        .post(this.url + "bully-buddy/user/add_user", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "User Added Successfuly", type: true },
          });
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "User Adding Failed", type: false },
          });
          }
        });
    }
  }
  editUser() {
    // let school_name = this.saveForm.get("school_name").value;
    // let school_address = this.saveForm.get("school_address").value;
    let id = this.data.id;
    let email = this.editUserForm.get("email").value;
    // let password = this.editUserForm.get("password").value;

    let schoolId = this.editSchoolId;
    let userTypeId = this.userTypeId;
    let name = this.editUserForm.get("name").value;
    let userPhone = this.editUserForm.get("userPhone").value;
    let parentId = this.editUserForm.get("parentId").value;
    let grade = this.editUserForm.get("grade").value;
    let parentPhone1 = this.editUserForm.get("parentPhone1").value;
    let parentPhone2 = this.editUserForm.get("parentPhone2").value;
    let driverPhone = this.editUserForm.get("driverPhone").value;
    let schoolPhone = this.editUserForm.get("schoolPhone").value;
    let gender =this.selectedGenderValue;
    let address = this.editUserForm.get("address").value;
    let zipCode = this.editUserForm.get("zipCode").value;
    let city = this.editUserForm.get("city").value;
    // let state = this.editUserForm.get("state").value;
    let busRoute = this.editUserForm.get("busRoute").value;

    let formObj = {
      id: id,
      email: email,
      // password: password,
      schoolId: schoolId,
      userTypeId: userTypeId,
      name: name,
      userPhone: userPhone,
      parentId: this.parentId,
      grade: grade,
      parentPhone1: parentPhone1,
      parentPhone2: parentPhone2,
      driverPhone: driverPhone,
      schoolPhone: schoolPhone,
      gender: this.selectedGenderValue,
      address: address,
      zipCode: zipCode,
      city: city,
      state: this.selectedState,
      busRoute: this.busRoute,
    };
    console.log("User", formObj);
    console.log("schoolId",schoolId);
    if(schoolId==null){
      alert("Please selecte State to add School in order to save.");
    }
    if(gender==undefined){
        alert("Please Enter gender.");
    }
    if ((name != "" && name != undefined)&&(gender=="M"||gender=="F")&&(schoolId!=null)) {
      this.http
        .post(this.url + "bully-buddy/user/update_user", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "User Update Successfully", type: true },
          });
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "User Update Failed", type: false },
          });
          }
        });
    }
  }
  selectBullyGender(eve) {
    this.selectedBullyGender = eve;
  }
  selectBullyClass(eve) {
    this.selectedBullyClass = eve;
  }
  selectBullyStatus(eve) {
    this.selectedBullyStatus = eve;
  }
  saveIncident() {
    // let school_name = this.saveForm.get("school_name").value;
    // let school_address = this.saveForm.get("school_address").value;

    let id = this.data.userId;
    let userId = this.editIncident.get("userId").value;
    let name = this.editIncident.get("name").value;
    let grade = this.editIncident.get("grade").value;
    let schoolId = this.schoolId;
    let age = this.editIncident.get("age").value;
    let gender = this.selectedGenderValue;
    let bullyName = this.editIncident.get("bullyName").value;
    let incidentPlace = this.editIncident.get("incidentPlace").value;
    let isBullyClassmate = this.selectedBullyClass;
    let bullyGender = this.selectedBullyGender;
    let noOfDaysBullied = this.editIncident.get("noOfDaysBullied").value;
    let bullyType = this.editIncident.get("bullyType").value;
    let bullyDescription = this.editIncident.get("bullyDescription").value;
    let videoURL = this.editIncident.get("videoURL").value;
    let bullyStatus = this.selectedBullyStatus;

    let formObj = {
      id: id,
      userId: userId,
      name: name,
      grade: grade,
      schoolId: schoolId,
      age: age,
      gender: gender,
      bullyName: bullyName,
      incidentPlace: incidentPlace,
      isBullyClassmate: isBullyClassmate,
      bullyGender: bullyGender,
      noOfDaysBullied: noOfDaysBullied,
      bullyType: bullyType,
      bullyDescription: bullyDescription,
      videoURL: videoURL,
      bullyStatus: bullyStatus,
    };
    if (name != "" && name != undefined) {
      this.http
        .post(this.url + "bully-buddy/incident/update_incident", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
          }
        });
    }
  }
  saveTeacher() {
    let teacher_name = this.saveTeacherForm.get("teacher_name").value;
    // let school_id = this.saveTeacherForm.get("school_id").value;
    let school_id = this.schoolId;
    let grade = this.saveTeacherForm.get("grade").value;
    let formObj = {
      teacherName: teacher_name,
      schoolId: school_id,
      grade: grade,
    };
    if ((teacher_name != "" && teacher_name != undefined) && (school_id != undefined && school_id != "" && school_id != null)) {
      this.http
        .post(this.url + "bully-buddy/teachers/add_teacher", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Teacher Added Successfully", type: true },
          });
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Teacher Adding Failed", type: false },
          });
          }
        });
    }
    else{
      alert("Kindly Select the School to save the Bus Route!")
    }
  }

  editTeacher() {
    let teacher_name = this.editTeacherForm.get("teacher_name").value;
    // let school_id = this.editTeacherForm.get("school_id").value;
    let school_id = this.schoolId;
    let grade = this.editTeacherForm.get("grade").value;
    let formObj = {
      id: this.data.id,
      teacherName: teacher_name,
      schoolId: school_id,
      grade: grade,
    };
    if ((teacher_name != "" && teacher_name != undefined )&& (school_id != undefined && school_id != "" && school_id != null)) {
      this.http
        .post(this.url + "bully-buddy/teachers/update_teacher", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Teacher Updated Successfully", type: true },
          });
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Teacher Update Failed", type: false },
          });
          }
        });
    }
    else{
      alert("Kindly Select the School to save the Bus Route!")
    }
  }

  saveBusRoute() {
    let busRoute = this.saveBusRouteForm.get("busRoute").value;
    let school_id = this.schoolId;
    let driver_id = this.saveBusRouteForm.get("driver_id").value;
    let formObj = {
      busRoute: busRoute,
      driverId: driver_id,
      schoolId: school_id,
    };
    // if(this.schoolId != undefined || this.schoolId != ""){
    //   alert("Kindly Select the School to save the Bus Route!")
    // }
    if ((busRoute != "" && busRoute != undefined)&& (school_id != undefined && school_id != "" && school_id != null)) {
      this.http
        .post(this.url + "bully-buddy/busroute/add_busroute", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "BusRoute Added Sucessfully", type: true },
          });
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "BusRoute Adding Failed", type: false },
          });
          }
        });
    }
    else{
      alert("Kindly Select the School to save the Bus Route!")
    }
  }

  editBusRoute() {
    let busRoute = this.editBusRouteForm.get("busRoute").value;
    let school_id = this.schoolId;
    let driver_id = this.editBusRouteForm.get("driver_id").value;
    let formObj = {
      id: this.data.id,
      busRoute: busRoute,
      driverId: driver_id,
      schoolId: school_id,
    };
    //  if(this.schoolId!== undefined || this.schoolId !== ""){
    //   alert("Kindly Select the School to save the Bus Route!")
    // }
    if ((busRoute != "" && busRoute != undefined) && (school_id != undefined && school_id != "" && school_id != null)) {
      this.http
        .post(this.url + "bully-buddy/busroute/update_busroute", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "BusRoute Updated Successfully", type: true },
          });
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "BusRoute Update Failed", type: false },
          });
          }
        });
    }
     else{
      alert("Kindly Select the School to save the Bus Route!")
    }
  }

  saveReport() {
    let userId = this.saveReportForm.get("userId").value;
    let school_id = this.schoolId;
    let fileURL = this.saveReportForm.get("fileURL").value;
    let latitude = this.saveReportForm.get("latitude").value;
    let langitude = this.saveReportForm.get("langitude").value;

    let formObj = {
      address: null,
      userId: userId,
      schoolId: school_id,
      fileURL: fileURL,
      latitude: latitude,
      langitude: langitude,
    };
    if (school_id != "" && school_id != undefined) {
      this.http
        .post(
          this.url + "bully-buddy/emergencyreport/add_emergencyreport",
          formObj
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Report Added Successfully ", type: true },
          });
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Report Adding Failed", type: false },
          });
          }
        });
    }
  }

  editReport() {
    let userId = this.editReportForm.get("userId").value;
    let school_id = this.schoolId;
    // let address= this.editReportForm.get("address").value;
    let fileURL = this.editReportForm.get("fileURL").value;
    let latitude = this.editReportForm.get("latitude").value;
    let langitude = this.editReportForm.get("langitude").value;

    let formObj = {
      id: this.data.id,
      address: this.repAddress,
      userId: userId,
      schoolId: school_id,
      fileURL: fileURL,
      latitude: latitude,
      langitude: langitude,
    };
    if (userId != "" && userId != undefined) {
      this.http
        .post(
          this.url + "bully-buddy/emergencyreport/update_emergencyreport",
          formObj
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
          }
        });
    }
  }

  onFileChange(event: any) {
    this.excel_file = event.target.files[0];
    console.log("Excel", this.excel_file);
  }
  saveExcel() {
    let formObj: FormData = new FormData();
    formObj.set("file", this.excel_file);
    formObj.set("filename", this.data.fileName);
    formObj.set("adminid", this.userInfo.schoolid);
    let message = "Uploaded the file successfully: " + this.excel_file.name;
    // console.log("Name", message);
    let url = "http://3.128.136.18:5001/api/excel/upload_excel";
    console.log("ExcelUpload", formObj);
    this.http.post(url, formObj).subscribe(
      (res: any) => {
        console.log("RESS", res);
        if (res.message == message) {
          this.close();
          this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Excel Uploaded", type: true },
          });
        }
      },
      (error) => {
        console.log("ERR", error);
        // if (error instanceof HttpErroResponse) {
        this.alertDialog.open(SuccessComponent, {
          width: "30%",
          data: { value: error.error.message, type: false },
        });
        // }
      }
    );
  }

  getAllSchools() {
    // this.totalRecords = 0;
    // this.page = 1;
    console.log("ALLSCHOOLLIST",this.allSchoolList.length)
    if(this.allSchoolList.length===0){

    return new Promise((resolve, reject) => {
      this.http
        .post(this.url + "bully-buddy/school/get_all_school", "")
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.allSchoolList = res.result;
            // this.adminSchoolList = res.result;
            // this.schoolList = res.result;
            console.log("SChpols", this.allSchoolList);
            // this.data = res.result;
            // this.totalRecords = res.result.length;
            // this.zipCodeItem.push(this.dataList.zipCode);
            // console.log("TOTOAL", this.totalRecords);
            // console.log("TOTOAL", this.dataList);
            // for (let i = 0; i < this.totalRecords; i++) {
            //   if (
            //     this.dataList[i].zipCode !== undefined ||
            //     this.dataList[i].zipCode !== "" ||
            //     this.dataList[i].zipCode !== null
            //   ) {
            //     if (this.zipCodeItem[i] !== this.dataList[i].zipCode) {
            //       this.zipCodeItem.push(this.dataList[i].zipCode);
            //     }
            //   }
            // }
            // console.log("zipCodeItem", this.zipCodeItem);
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
    });
  }
  }
  getAllUserTypes() {
    // let formObj = {
    //   schoolId: this.userInfo.schoolid,
    // };
    let length;
    let userType;
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "bully-buddy/usertype/get_all_usertype")
        .subscribe((res: any) => {
          if (res.status == "200") {
            length = res.result.length;
            userType = res.result;
            this.userTypeList = res.result;
            // for (let i = 0; i < length; i++) {
            //   if (userType[i].id !== 5) {
            // this.userTypeList.push(userType[i]);
            //   }
            // }
            console.log("USER", this.userTypeList);
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
    });
  }

  getAllBusRoute() {
    let formObj = {
      schoolId: this.userInfo.schoolid,
    };
    return new Promise((resolve, reject) => {
      this.http
        .post(this.url + "bully-buddy/busroute/get_all_busroute", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.busRouteList = res.result;
            // this.data = res.result;
            // this.totalRecords = res.result.length;
            console.log("BUS", this.busRouteList);
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
    });
  }
    // searchSchools(ev){
    //   console.log("SearchSchool",ev.term);

    // }

   getSchoolBySearch(school) {
     console.log("SearchSchool",school.term);
console.log("ZIP",this.zipCodesrch)
if(this.zipCodesrch===undefined||this.zipCodesrch===null||this.zipCodesrch===""){
  this.zipCodesrch=null;
}

    let selectedState: any;
    console.log("DATASTATE", this.data.state);
    console.log("selectedSATEs", this.selectedState);
    if (
      (this.selectedState !== undefined || this.selectedState !== "")
    ) {
      for(let i =0;i<this.stateList.length;i++){
        if(this.selectedState === this.stateList[i].statename){
            this.searchSchoolId = this.stateList[i].id
        }
      }
    }
    else{
      this.searchSchoolId = 0;
    }

 let formObj = {
      stateId: this.searchSchoolId,
      zipCode: this.zipCodesrch,
      schoolName: school.term
    };
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.url +
            "bully-buddy/school/get_school_auto",
          formObj
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.schoolList = res.result;
            this.allSchoolList = res.result;
            // console.log("SChpols", this.schoolList);
            if (this.schoolList.length === 1) {
              this.editSchoolId = this.schoolList[0].id;
            }
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
    });
  }
   getSchoolById(school) {
     console.log("SchoolIDD",school);
    let arrLen: any = [];
    let formObj = {
      id: school,
    };
    if(school !== ""||school!==0||school!==undefined){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.url + "bully-buddy/school/get_school_by_id", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            // this.dataList.push(res.result);
            // this.dataList.push(this.dataList);

              // this.schoolList.push(res.result);
              this.allSchoolList.push(res.result);
// console.log("schoolbyid",this.schoolList);
              this.dropSchoolName= this.allSchoolList[0].schoolName
              if(this.userInfo.schoolid !== 0){
              this.schoolId = this.allSchoolList[0].id;
            }
            // console.log("DATALIST", this.dataList);
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
    });
  }
  }
}
