import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { bookingUrls } from 'src/api-urls';

@Component({
  selector: 'app-activitylog',
  templateUrl: './activitylog.component.html',
  styleUrls: ['./activitylog.component.scss']
})
export class ActivitylogComponent implements OnInit {
  activityLogs = [];
  activeLog;
  invoiceNumber;
  docInfo;
  docName = 'Invoices';
  constructor(public activeModal: NgbActiveModal, private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(bookingUrls.resource + `/DocType/` + this.docName).pipe(switchMap((res: any) => {
      return this.http.get(bookingUrls.resource + '/Version', {
        params: {
          filters: [JSON.stringify([['docname', '=', this.invoiceNumber]])],
          fields: JSON.stringify(['data', 'name', 'creation', 'modified_by']),
          order_by: `${'creation desc'}`,
        }
      }).pipe(map((response: any) => {
        res.data.dataFields = res.data.fields.reduce((prev, nxt) => {
          prev[nxt.fieldname] = nxt.label;
          return prev;
        }, {});
        return (response.data as any[]).map((each) => {
          each.data = JSON.parse(each.data);
          each.data = Object.keys(each.data).reduce((prev, key) => {
            if (each.data[key] && Array.isArray(each.data[key]) && each.data[key].length) {
              prev[key] = each.data[key].map((cr: string[]) => {
                if (cr.length == 3) {
                  cr[0] = res.data.dataFields[cr[0]] || cr[0];
                }
                return cr;
              });
            } else {
              prev[key] = each.data[key];
            }
            return prev;
          }, {});
          return each;
        });
      }))
    })).subscribe((res) => {
      this.activityLogs = res;
    });
  }
  onLogClick(item) {
    this.activeLog = item;
    (document.querySelector('.modal-dialog') as any).style.maxWidth = "100%";
    (document.querySelector('.modal-dialog') as any).style.width = "90%";
  }

}
