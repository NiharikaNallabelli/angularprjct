import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { bookingUrls } from 'src/api-urls';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {



  search = {
    vendor: '',
    department: '',
    filterDate: []
  }
  onFilterChange = new EventEmitter();
  dasboardData;
  view: any[] = [600, 400];
  width: number = 700;
  height: number = 300;
  fitContainer: boolean = false;


  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Sales';
  timeline = true;
  doughnut = true;
  colorScheme = {
    domain: ['#2164E8']
  };
  //pie
  showLabels = true;
  // data goes here
  public single = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.dashboardData();

  }



  dashboardData() {

    this.onFilterChange.pipe(debounceTime(300), switchMap((res) => {
      const filters = [];

      if (this.search.filterDate?.length) {
        filters.push(["Corporate Bookings", "creation", "Between", [`${moment(this.search.filterDate[0]).format('YYYY-MM-DD')}`, `${moment(this.search.filterDate[1]).format('YYYY-MM-DD')}`]])
      }

      // if (this.search.vendor) {
      //   filters.push(["select_vendor", "=", `${this.search.vendor}`])
      // }

      // if (this.search.department) {
      //   filters.push(["select_department", "=", `${this.search.department}`])
      // }

      return this.http.get(bookingUrls.getDashboard, {
        params: {
          limit_page_length: "None",
          fields: JSON.stringify(['*']),
          dashboard: "1",
          filters: JSON.stringify(filters),
          // order_by: ['`tabContracts`.`' + 'modified' + '` ' + 'desc' + ''],

        }
      })
    })).subscribe((res: any) => {
      if (res.message?.success) {
        this.dasboardData = res.message?.data;
        if (this.dasboardData?.departments_list?.length) {
          this.dasboardData?.departments_list.map((item: any) => {
            item.name = item.select_department,
            item.value = item.total_amount
          });
          this.single = this.dasboardData?.departments_list;
        }
      }
    });
    this.onFilterChange.emit('');
  }


}
