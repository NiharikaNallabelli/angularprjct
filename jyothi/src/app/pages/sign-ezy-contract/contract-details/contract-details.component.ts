import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { bookingUrls } from 'src/api-urls';
import { environment } from 'src/environments/environment';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import * as JSZipUtils from 'jszip-utils'
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.scss']
})
export class ContractDetailsComponent implements OnInit {

  step1 = true;
  step2 = false;
  api = environment.bookingDomain;
  attachmentsType = "All"
  uploadedFiles = [];
  contractDetails;
  contractData;
  agreements = [];
  invoices = [];
  supportedDocuments = [];
  selectedAttachments: any = [];
  mailInfo: any = {};
  individaulMail;
  isChecked;
  mailInfoIndividual: any = {};
  getRequests = [];
  constructor(private activatedRoute: ActivatedRoute, private modal: NgbModal, private http: HttpClient, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.contractDetails = res.id;
    });
    this.getContractDetails();
  }


  sendEmail(emailSend) {
    this.selectedAttachments = [],
      this.mailInfo = {}
    this.modal.open(emailSend, {
      size: 'lg',
      centered: true
    })
  }

  next() {
    this.step2 = true
    this.step1 = false;
    console.log(this.selectedAttachments)
  }

  prev() {
    this.step2 = false
    this.step1 = true;
  }


  private async uploadFile(file, type) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_private', '0');
    formData.append('folder', 'Home');
    formData.append('doctype', 'Contracts');
    formData.append('fieldname', 'document');
    return this.http.post(bookingUrls.uploadFile, formData).toPromise().then((res: any) => this.uploadedFiles.push({ agreement: res?.message?.file_url, attachment_type: `${type}` }));
  }

  async fileUpload(e, type) {
    console.log(type)
    if (e.target) {
      let files = e.target.files

      for (var i = 0; i < files.length; i++) {
        let myfile = files[i].name
        var ext = myfile.split('.').pop()
        console.log(files[i].name)
        if (ext == 'pdf' || ext == 'jpg' || ext == 'jpeg' || ext == 'png') {
          await this.uploadFile(files[i], type);
          await this.save(this.uploadedFiles)
          // this.loader = true;
        } else {
          window.alert('Only pdf,jpg,jpeg files allowed')
        }

        // this.myFiles.push(files[i]);

      }


      


      // this.file = e.target.files

      //  this.uploadFile(this.file)
    }
  }

  save(files: any) {
    let data = JSON.parse(JSON.stringify(files))
    this.http.put(bookingUrls.documentContracts + `/${this.contractDetails}`, {
      agreement: data,
      name: this.contractDetails
    }).subscribe((res: any) => {
      if (res.message.data) {
        this.getContractDetails()
        this.toaster.success('saved');
        this.uploadedFiles = [];
      }
    }, (error) => {
      this.toaster.error(error.error._server_messages)
    })
  }


  getContractDetails() {
    this.http.get(bookingUrls.contracts + `/${this.contractDetails}`).subscribe((res: any) => {
      if (res) {
        console.log(res.data)
        this.contractData = res.data;
        let files = this.contractData.agreement;
        files.isChecked = true;
        this.agreements = files.filter((item: any) => {
          if (item.attachment_type === 'Agreements') {
            return item
          }
        });

        this.invoices = files.filter((item: any) => {
          if (item.attachment_type === 'Invoices') {
            return item
          }
        });

        this.supportedDocuments = files.filter((item: any) => {
          if (item.attachment_type === 'Supported Documents') {
            return item
          }
        });

      }
    }, (error) => {
      this.toaster.error(error.error._server_messages)
    })
  }


  setCheckbox(event: any, value: any) {
    if (event.target.checked)
      this.selectedAttachments.push(value.agreement);
    else {
      this.selectedAttachments = this.selectedAttachments.filter((val) => val != value.agreement);
    }

    console.log(this.selectedAttachments);
  }

  mailSend() {
    let obj = {
      name: this.contractDetails,
      doctype: "Contracts",
      message: this.mailInfo.message,
      subject: this.mailInfo.subject,
      agreement: this.selectedAttachments
    }
    this.http.post(bookingUrls.sendEmail, obj).subscribe((res: any) => {
      if (res.message.success) {
        this.toaster.success(res.message.message)
        this.modal.dismissAll();
      } else {
        this.toaster.error('something went wrong')
      }
    }, (error) => {
      this.toaster.error(error.error._server_messages)
    })
  }

  sendMail(item, sendMailContent) {
    this.mailInfoIndividual = {}
    this.individaulMail = item.agreement
    this.modal.open(sendMailContent, {
      size: 'md',
      centered: true
    })
  }

  mailSent() {
    let obj = {
      name: this.contractDetails,
      doctype: "Contracts",
      message: this.mailInfoIndividual.message,
      subject: this.mailInfoIndividual.subject,
      agreement: this.individaulMail
    }
    this.http.post(bookingUrls.sendEmail, obj).subscribe((res: any) => {
      if (res.message.success) {
        this.toaster.success(res.message.message)
        this.modal.dismissAll();
      } else {
        this.toaster.error('something went wrong')
      }
    }, (error) => {
      this.toaster.error(error.error._server_messages)
    })
  }


  download(data: any) {
    let files = [];
    data.map((item: any) => {
      files.push(this.api + item?.agreement)
    })

    let zip = new JSZip();
    let count = 0;
    let name = 'asd' + ".zip";
    files.forEach(function (url) {
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          throw err;
        }
        var img = zip.folder("pdf");
        var filename = url.replace(/.*\//g, "");
        img.file(filename, data, { binary: true, createFolders: true });
        count++;
        if (count == files.length) {
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            FileSaver.saveAs(content, name);
          });
        }
      });
    });

  }




  downloadDoc(dataurl, filename) {
    FileSaver.saveAs(this.api + dataurl, filename);

  }



}
