import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
// import { Properties } from '../../properties';
import { LocationStrategy } from "@angular/common";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../property-service.service";
import { Router } from "@angular/router";
import { SuccessComponent } from '../success/success.component';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token",
    Accept: "*/*",
  }),
};

@Component({
  selector: "app-schools",
  templateUrl: "./schools.component.html",
  styleUrls: ["./schools.component.css"],
})
export class SchoolsComponent implements OnInit {
  //Pagination
  data: Array<any>;
  totalRecords: Number;
  page: Number = 1;
  itemPerPage = 500;
  //Search
  searchText: any;
  selectedState = null;
  selectedZipCode = null;
  stateItems = [];
  zipCodeItem = [];
  visibleClear:boolean = false;
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private property: PropertyServiceService,
    private location: LocationStrategy,
    public alertDialog: MatDialog,
    private router: Router,
    private cookieService: CookieService
  ) {
    //Pagination
    this.data = new Array<any>();

    let scope = this;
    dialog.afterAllClosed.subscribe((res) => {
      // if (this.userInfo.schoolid === 0) {
      //   this.getAllSchools();
      // } else {
      //   this.getSchoolById();
      // }
      this.ngOnInit();
    });
  }

  userInfo = JSON.parse(localStorage.getItem("UserInfo"));

  // url = this.property.url;
  // uri: string = "https://54.215.34.67:5001/bully-buddy/school/get_all_school";
  uri = this.property.uri;
  dataList: any = [];
  imgList: any;
  structImgList: any;
  totalPages:any;
  structCatList: any;
  showSuperAdmin: boolean = false;
  orderFlag: boolean = false;
  showNoRecord: boolean = false;
  localschoolRec:any=[];
  // imgPath = this.property.url;
  stateList: any = [];
  searchWord:any;
  getCookies: string = this.cookieService.get("LoginStatus");
  ngOnInit() {
    // console.log(this.userInfo);
    this.getAllState();
    console.log("COOKIE", this.getCookies);
    if (this.getCookies !== "login") {
      localStorage.removeItem("userInfo");
      this.router.navigateByUrl("/login");
    }
    if (this.userInfo === null || this.userInfo === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      this.router.navigateByUrl("/login");
    }
    this.preventBackButton();
    if (this.userInfo.schoolid === 0) {
      this.showSuperAdmin = true;
        //  console.log("this.searchText",this.searchText);
        if(this.searchText === "" || this.searchText === undefined)
            {
              // alert("hiii")
              // console.log("this.searchTextt",this.searchText);
              this.getAllSchools();
            }else{
                // console.log("this.searchText Hit")
                this.searchWord = this.searchText;
                this.schoolSearch(this.searchText)
    }

    } else {
      this.getSchoolById();
    }
    // this.order();
  }
  preventBackButton() {
    history.pushState(null, null, location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }
   pageChanged(event) {

    console.log("pagination", event);
    console.log("SelectedPAgeState",this.selectedState)
    console.log("SelectedPAgesearchText",this.searchText)
     if(event!==""){
        this.page = event;
        if(event > this.totalPages){
            this.page = 1
      }
    if((this.selectedState === null || this.selectedState === "") && (this.searchText === ""||this.searchText === undefined)){
      // alert("PageCHange")
        this.getAllSchools();
    }

     }

  }
  setPage(eve){
    console.log("PageSizeCHange",eve)
  }

  getAllSchools() {
    // this.totalRecords = 0;
    let page = this.page.toString();
    let pageNo: number = +page;
    pageNo = pageNo - 1;
    console.log("Page", pageNo);
// let formObj={
//   pageno:pageNo
// }
    return new Promise((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/school/get_all_school"+ "?pageno=" + pageNo, "")
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result.content;
            this.totalRecords = res.result.totalElements;
            this.totalPages = res.result.totalPages;
            // console.log("TOTOAL", this.totalRecords);
            // console.log("SchoolResult",res.result)
            if (this.totalRecords === 0) {
              this.showNoRecord = true;
            }else{
              this.showNoRecord = false;
            }


          } else {
            alert(res.message + " : " + res.result);
            this.showNoRecord = true;
          }
          resolve();
          // this.getZipCode();
        });

    });

  }
  getSchoolById() {
    let arrLen: any = [];
    let formObj = {
      id: this.userInfo.schoolid,
    };
    return new Promise((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/school/get_school_by_id", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            // this.dataList.push(res.result);
            // this.dataList.push(this.dataList);
            // console.log("schoolreslt",res.result);
            arrLen.push(res.result);
            // console.log("RESsss", arrLen);
            if (arrLen.length === 1) {
              this.dataList = [];
              this.dataList.push(res.result);
              this.data = res.result;
              this.totalRecords = res.result.length;
              this.getAllState();
            } else {
              this.dataList = res.result;
              this.data = res.result;
              this.totalRecords = res.result.length;
              this.getAllState();
            }
            // console.log("DATALIST", this.dataList);
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
    });
  }


  zipCodeFilter(eve) {
    console.log("ZipCode", eve);

    this.searchText = eve;
  }

schoolSearch(eve){
  const arrLen: any = [];
    let searchWord = eve;
    this.searchText = eve;
    //  console.log("searchWord",this.searchWord);
    if(this.searchWord === "" || this.searchWord === undefined){
      this.searchText = eve;
    }
    else{
      this.searchText = this.searchWord;
    }
    // console.log("search Text",this.searchText)
    if (this.searchText === "") {
      // alert("hi");
      this.getAllSchools();
    }
     if(this.searchText !== undefined)
    {
    if (this.searchText !== "" && this.searchText.length > 1) {
      this.http
        .post(
          this.uri +
            "bully-buddy/school/search_school" +
            "?searchword=" +
            searchWord,
          ""
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            // console.log("searchUser", res.result);
            arrLen.push(res.result);
            this.dataList = res.result;
            this.totalRecords = res.result.length;
          }
          if(this.totalRecords === 0){
            this.showNoRecord =true;
          }
          else{
            this.showNoRecord = false
          }
        });
    }
  }
}

  stateFilter(eve) {
    // console.log("STAE", eve);
  if(eve !== ""){
   let formObj = {
      zipCode: "",
    };
     return new Promise((resolve, reject) => {
      this.http
        .post(
          this.uri +
            "bully-buddy/school/get_school_by_statename_zipcode" +
            "?statename=" +
            eve,
          formObj
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
             this.totalRecords = res.result.length;
            // console.log("SChpols", this.dataList);
            // if (this.schoolList.length === 1) {
            //   this.editSchoolId = this.schoolList[0].id;
            // }
             if (this.totalRecords === 0) {
              this.showNoRecord = true;
            }
            else{
              this.showNoRecord = false;
            }
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
    });
    this.searchText = eve;
  }
  else{
    this.page = 1;
    this.getAllSchools();
  }

  }
  getAllState() {
    // let formObj = {
    //   schoolId: this.userInfo.schoolid,
    // };
    return new Promise((resolve, reject) => {
      this.http
        .get(this.uri + "bully-buddy/state/get_all_state")
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.stateItems = res.result;
            this.stateList = JSON.stringify(res.result);
            localStorage.setItem("States", this.stateList);
            // console.log("STATE,", this.stateList);
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
    });
  }



  showClear(eve){
    if(eve !==""){
        this.visibleClear = true;
    }
    else{
      this.visibleClear = false;
      this.getAllSchools();
    }

  }

clearResult(){
  // alert("HIT");
  this.visibleClear = false;
  this.searchText="";
  this.searchWord="";
  this.getAllSchools();
}



  excelUpload() {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      // height: "100%",
      data: {
        title: "Upload School Excel",
        divType: "UploadExcel",
        fileName: "school",
      },
    });
  }
  addSchool() {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: { title: "Add School", divType: "addSchool" },
    });
  }
  editSchool(list) {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Edit School",
        divType: "editSchool",
        school_name: list.schoolName,
        school_id: list.id,
        school_address: list.schoolAddress,
        school_state: list.stateId,
        zipCode: list.zipCode,
      },
    });
  }

  deleteSchool(id) {
    var confirmResult = this.dialog.open(DeleteDialogComponent, {
      width: "20%",
      data: {
        title: "Delete School",
        message: "Are you want to delete this school!",
      },
    });
    confirmResult.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // let formObj = new FormData();
        // formObj.append("id", id);
        let formObj = {
          id: id,
        };
        this.http
          .post(this.uri + "bully-buddy/school/delete_school", formObj)
          .subscribe((res: any) => {
            if (res.status == "200") {
              this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "School Deleted", type: true },
          });
              // console.log("SeatchSchooltext",this.searchText);
              if(this.searchText === " "|| this.searchText === undefined){
                // alert("hi");
              this.getAllSchools();
              }
              else{
                this.schoolSearch(this.searchText);
              }
            }else{
                 this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "School Delete Failed", type: false },
          });
            }
          });
      }
    });
  }
  excelDownload() {
    let url = "http://3.128.136.18:5001/api/excel/download_school";
    this.http.get(url, { responseType: "blob" }).subscribe((data) => {
      console.log("BLOB", data);
      const blob = new Blob([data], {
        type: "application/vnd.ms.excel",
      });
      const file = new File([blob], "school" + ".xlsx", {
        type: "application/vnd.ms.excel",
      });
      saveAs(file);
    });
  }
  order() {
    if (!this.orderFlag) {
      this.dataList.sort((a, b) => {
        return b.id - a.id;
      });
    } else {
      this.dataList.sort((a, b) => {
        return a.id - b.id;
      });
    }
    this.orderFlag = !this.orderFlag;
  }

  doLogOut() {
    localStorage.removeItem("SuperAdmin");
    localStorage.removeItem("UserInfo");
    this.router.navigateByUrl("/login");
  }
}
