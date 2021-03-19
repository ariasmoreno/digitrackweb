import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomValidators } from 'ng2-validation';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private url = '/api/person';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    cpf: new FormControl('', [Validators.required, Validators.minLength(11), Validators.pattern('^[0-9]*[1-9][0-9]*$')]),
    birthDate: new FormControl('', [Validators.required, CustomValidators.maxDate(Date.now())]),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    phone: new FormControl(null, Validators.pattern('^[0-9]*[1-9][0-9]*$')),
    sex: new FormControl('', Validators.required),
    description: new FormControl(null),
    registrationDate: new FormControl(Date.now()),
    updateDate: new FormControl(null)
  });

  filterForm: FormGroup = new FormGroup({
    filterSex: new FormControl(null),
    filterBirthDate: new FormControl(null, [CustomValidators.maxDate(Date.now())])
  });

  clearForm() {
    this.form.reset();
    this.form.patchValue({
      registrationDate: Date.now()
    });
  }

  getAll(page: number, size: number): Observable<any> {
    this.loadingSubject.next(true);

    let params = new HttpParams();
    //Paging
    params = params.append('page', String(page));
    params = params.append('size', String(size));

    //Filters
    if (this.filterForm.value.filterSex !== null)
      params = params.append('sex', String(this.filterForm.value.filterSex));
    if (this.filterForm.value.filterBirthDate !== null) {
      var dateFormat = (moment(this.filterForm.value.filterBirthDate)).format('yyyy-MM-DD')
      params = params.append('birthDate', String(dateFormat));
    }

    return this.httpClient
      .get<any>(this.url,
        {
          params,
          headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
          })
        })
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  set() {
    this.loadingSubject.next(true);
    return this.httpClient
      .post<any>(this.url, this.form.value,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
          })
        })
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  update(id: number) {
    this.loadingSubject.next(true);
    this.form.patchValue({
      updateDate: Date.now()
    });
    return this.httpClient
      .put<any>(this.url + '/' + id, this.form.value,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
          })
        })
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  delete(id: number) {
    this.loadingSubject.next(true);
    return this.httpClient
      .delete<any>(
        this.url + '/' + id,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
          })
        })
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  existCpf(transaccionIsNew: boolean, id: number) {
    this.loadingSubject.next(true);

    let params = new HttpParams();
    params = params.append('cpf', String(this.form.value.cpf));
    if (!transaccionIsNew)
      params = params.append('id', String(id));

    return this.httpClient
      .get<any>(
        this.url + '/existCpf',
        {
          params,
          headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
          })
        })
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

}
