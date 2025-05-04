import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorMessage } from '../../model';
import { ErrorMessageService } from '../../service/error-message.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'message', 'timestamp'];
  dataSource: ErrorMessage[] = [];

  page = 0;
  pageSize = 10;
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private errorService: ErrorMessageService) {}

  ngOnInit(): void {
    this.loadErrors(this.page, this.pageSize);
  }

  loadErrors(page: number, size: number): void {
    this.errorService.getErrors(page, size).subscribe(data => {
      this.dataSource = data.content;
      this.totalElements = data.totalElements;
    });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadErrors(this.page, this.pageSize);
  }
}
