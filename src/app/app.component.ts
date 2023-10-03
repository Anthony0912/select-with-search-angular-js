import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { actividadesEconomicas } from './data';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActividadesEconomicas } from './interfaces/actividades-economicas.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'select-with-search';

  @HostListener('click', ['$event'])
  public disabledListDesktop(event: MouseEvent) {
    const elemento = (event.target as Element).id;

    if (elemento !== 'searchInputid') {
      this.onBlur();
    }
  }

  protected readonly actividadesEconomicas: ActividadesEconomicas[] =
    actividadesEconomicas();
  public filtrarActividadesEconomicas: ActividadesEconomicas[] = [];
  public className: string = 'disabled-list';

  private _subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filtrarActividadesEconomicas = this.actividadesEconomicas;

    this._subscription = this.inputSearch.valueChanges.subscribe((value) => {
      this._filtro(value);
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  form: FormGroup = this.fb.group({
    selectedActivityIds: [],
    inputSearch: [],
  });

  private _filtro(value: string) {
    const searchString = value.toLowerCase();
    if (!searchString) {
      this.filtrarActividadesEconomicas = this.actividadesEconomicas.slice();
      return;
    } else {
      this.filtrarActividadesEconomicas = this.actividadesEconomicas.filter(
        (activ) => activ.descripcion.toLowerCase().indexOf(searchString) > -1
      );
    }
  }

  public selectedOption(actividad: ActividadesEconomicas): void {
    this.className = 'disabled-list';
    this.selectedActivityIds.setValue(actividad.codigoActividadEconomica);
    this.inputSearch.setValue(actividad.descripcion);
  }

  public onFocus(): void {
    this.className = 'enabled-list';
  }
  public onBlur(): void {
    this.className = 'disabled-list';
  }

  public get activeIconSelect(): string {
    const { value } = this.inputSearch;
    if (value !== null && value !== undefined && value !== '') {
      return 'icon-select-disabled';
    }
    return '';
  }

  public get selectedActivityIds(): AbstractControl {
    return this.form.get('selectedActivityIds')!;
  }

  public get inputSearch(): AbstractControl {
    return this.form.get('inputSearch')!;
  }
}
