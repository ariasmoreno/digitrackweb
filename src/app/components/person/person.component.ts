import { Page } from './../../interfaces/Page';
import { Person } from './../../interfaces/Person';
import { PersonService } from './../../services/person.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
declare var $: any;

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  transaccionIsNew = true;
  idPerson: number = 0;
  ROW_NUMBER: number;
  dialogTittle = 'New';
  persons: Person[] = [];
  page: Page;
  dataSource: MatTableDataSource<Person>;
  displayedColumns = ['name', 'description', 'birthDate', 'sex', 'cpf', 'registrationDate', 'updateDate', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  currentPage: number = 0;
  currentSize: number = 10;
  constructor(public Service: PersonService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.persons);
    this.dataSource.paginator = this.paginator;
    this.LoadData();
  }

  LoadData() {
    this.Service.getAll(this.currentPage, this.currentSize).subscribe(result => {
      this.page = result;
      this.dataSource = new MatTableDataSource(result.content);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "We could not load your data, Server connection error"
      })
    });
  }

  Save() {

    if (this.transaccionIsNew) {
      this.Service.set().subscribe(result => {
        this.LoadData();
        this.clearForm();
        this.ok("Saved");
      }, (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Server connection error"
        })
      });
    } else {
      this.Service.update(this.idPerson).subscribe(result => {
        this.LoadData();
        this.clearForm();
        this.ok("Updated");
      }, (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Server connection error"
        })
      });
    }
  }

  delete() {
    this.Service.delete(this.idPerson).subscribe(result => {
      console.log(this.currentPage * this.currentSize);
      console.log(this.page.totalPages - 1);
      if (this.currentPage * this.currentSize === this.page.totalElements - 1) {
        this.currentPage--;
      }
      this.LoadData();
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Server connection error"
      })
    });
  }

  existCpf() {
    this.Service.existCpf(this.transaccionIsNew, this.idPerson).subscribe(result => {
      if (result) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Cpf already exists!'
        })
      } else {
        this.Save();
      }
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Server connection error"
      })
    });
  }

  setNewData() {
    this.transaccionIsNew = true;
  }

  setDeleteData() {
    this.transaccionIsNew = false;
    var person = this.dataSource.filteredData[this.ROW_NUMBER];
    this.idPerson = person.id;
  }

  setUpdateData() {
    this.transaccionIsNew = false;
    var person = this.dataSource.filteredData[this.ROW_NUMBER];
    this.idPerson = person.id;
    this.Service.form.patchValue(
      {
        name: person.name,
        lastName: person.lastName,
        cpf: person.cpf,
        birthDate: person.birthDate,
        email: person.email,
        phone: person.phone,
        sex: person.sex,
        description: person.description,
        registrationDate: person.registrationDate,
        updateDate: Date.now()
      });
  }

  filter() {
    $('#FilterDialog').modal("hide");
    this.LoadData();
  }

  clearFilters() {
    this.Service.filterForm.reset();
    this.LoadData();
  }

  clearForm() {
    this.Service.clearForm();
    this.transaccionIsNew = true;
    $('#modalForm').modal("hide");
  }

  onPaginateChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.currentSize = event.pageSize;
    console.log(event);
    this.LoadData();
  }

  ok(value) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: value + ' successfully'
    })
  }

}
