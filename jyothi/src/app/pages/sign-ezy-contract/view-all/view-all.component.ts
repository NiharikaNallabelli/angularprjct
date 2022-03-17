import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ToastrService } from 'ngx-toastr';
import { bookingUrls } from 'src/api-urls';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.scss']
})
export class ViewAllComponent implements OnInit {

  public config: PerfectScrollbarConfigInterface = {};
  constructor(private http: HttpClient, private toaster: ToastrService, private activatedRoute: ActivatedRoute) { }

  pdfData;
  eachPdf;
  contractDetails;
  name;
  agreements:any = [];
  selectedIndex;
  domain = environment.bookingDomain
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.contractDetails = res.id;
      this.name = res.name;
    });
    this.getContractDetails();
  }


  getContractDetails() {
    let filters = []
    // filters.push(["Agreements", "parent", "=", `${this.contractDetails}`])
    this.http.get(bookingUrls.contracts + `/${this.contractDetails}`, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
      }
    }).subscribe((res: any) => {
      if (res) {
        console.log(res.data)
        let data = res.data.agreement;
        this.agreements = res.data.agreement
        let pdf = data.filter((item: any) => {
          if (item.name === this.name) {
            return item
          }
        })
        this.pdfData = pdf.length ? pdf[0] : [];
      }
    }, (error) => {
      this.toaster.error(error.error._server_messages)
    })
  }

  eachItem(item, index) {
    this.eachPdf = item.agreement;
    this.selectedIndex = index;
  }



  sendEmail() {
    let obj = {
      name: "department_name",
      agreement: ["/files/508356.pdf", "/files/508356.pdf"]
    }

    this.http.post(bookingUrls.sendEmail, obj).subscribe((res: any) => {
      console.log(res)
    })
  }


  back(){
    window.history.back()
  }








}
