import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent, ModalController, PopoverController,ItemReorderEventDetail  } from '@ionic/angular';
import { IngresoOrdenCompletaPage } from 'src/app/pages/ingreso-orden-completa/ingreso-orden-completa.page';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { HelperService } from 'src/app/servicios/helpers/helper.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { FuncionesComunesIntra } from 'src/app/utils/funciones-comunes-intra';

@Component({
  selector: 'app-orden-completa-turnos',
  templateUrl: './orden-completa-turnos.page.html',
  styleUrls: ['./orden-completa-turnos.page.scss'],
})
export class OrdenCompletaTurnosPage implements OnInit {
  pacienteSeleccionado_orden;
  list_orden:any=[];
  list_turnos:any[];
  items = [];
  initialItems = 5;
  slicedList = this.list_orden.slice(0, this.initialItems);
  itemsToShow = 5;
  cod_pac:any;
  lista_resultados_pacientes: any;
  public codigo_paciente=""; 
  public bandera_turnos_ordenes=false;
  public heigth_grid=52;
  // public minimo_grid=100;


  constructor(
    private varGlobal: VariablesGlobalesService,
    private queryservice:QueryService,
    private alertController:AlertController,
    private modalController:ModalController,
    private toastservice:ToastService,
    private helper:HelperService,
    private popoverController:PopoverController,
    private loadingservice: LoadingService,
    private funcionesComunes: FuncionesComunesIntra,
    private modalcontroller: ModalController,
    private router:Router    
    
  ) { }

  ngOnInit() {
    // this.cod_pac=this.varGlobal.getPaciente_orden_entrada_turnos();
    this.cod_pac=327;
    // this.codigo_paciente=this.varGlobal.getPaciente_orden_entrada_turnos();
    this.codigo_paciente="327";

    // console.log('Orden Completa: ',this.pacienteSeleccionado_orden.cod_pac);
    this.getOrdenxInidiviual(this.cod_pac);
    this.getTurnosbyCodPac(this.cod_pac);
    console.log('Cod_pac verificar: ',this.cod_pac);
    this.buscarPaciente();  
  }
  


  buscarPaciente(){         
    this.queryservice.SearchPacienteDynamic(
    {cedula:"",codigo:this.codigo_paciente,nombre:"",apellido:"",nombre_completo:""}
    ).then((r:any)=>{
      console.log("Por favor revisa el resutadi esperado",r);
      let data=r.data.searchPacienteDynamic
         console.log("Dataaaaaaaaa: ",data);
      if(data.length>0){
        this.lista_resultados_pacientes=data[0];
        
        console.log('this.resultadosFiltrados-longitudss: ',this.lista_resultados_pacientes);           
    }});
  }

  getTurnosbyCodPac(cod_pac){
    this.queryservice.getTurnosbyCodPac(cod_pac).then((r:any)=>{
      console.log("getTurnosbyCodPac verifica: ",r);
    this.list_turnos=r.data.getTurnosbyCodPac;
    console.log('this.list_turnosthis.list_turnos: ',this.list_turnos);
    if(this.list_turnos.length===0){
      this.bandera_turnos_ordenes=true;
      this.heigth_grid=100;
    }
    console.log('getTurnosbyCodPac getOrdenbyPac: ',this.list_turnos);
    })
  }

getOrdenxInidiviual(cod_pac){
    this.queryservice.getOrdenbyCodPac(cod_pac).then((r:any)=>{
      console.log("orden por paciente verifica: ",r);
    this.list_orden=r.data.getOrdenbyCodPac;
    console.log('list_orden getOrdenbyPac: ',this.list_orden);
    })
  }
getRowColor(index: number): string {
  return index % 2 === 0 ? 'even-row' : 'odd-row';
}
getRowColor_turnos(index: number): string {
  return index % 2 === 0 ? 'even-row_t' : 'odd-row_t';
}
btn_close(){
  this.router.navigate(['/responsive-listado-ingreso-de-usuarios']);
}

btn_enviar_orden(lista_resultados_pacientes){
console.log('aqui esta enviar orden: ',lista_resultados_pacientes);
this.varGlobal.setPaciente_orden_nueva_orden(this.lista_resultados_pacientes);
this.varGlobal.setOrden_pac_view(null);
this.router.navigate(['/ingreso-orden-completa']);        
// window.history.back();           
}


async presentAlertSeleccionOrden(orden) {
  console.log('Ordennn: ',orden);
  const alert = await this.alertController.create({
    header: ' Deseas seleccionar ',
    // subHeader: 'Paciente',
    message: `La Orden Nro. #`+orden.nro_ord,
    cssClass: 'ion-text-center', 
    buttons: [
      {
        text: 'No',
        role: 'Cancelar',
        cssClass: 'secondary',
        handler: () => {
          console.log('No clicked');
        }
      },
      {
        text: 'Sí',
        handler: () => {                    
          this.varGlobal.setOrden_pac_view(orden);
          console.log('ordenes en si: ',orden);
          this.router.navigate(['/ingreso-orden-completa', { orden: orden }]);                   
                    
        }
      }
    ]
  });
  await alert.present();
}

handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {  
  console.log('Before complete', this.items);
  this.items = ev.detail.complete(this.items);  
  console.log('After complete', this.items);
}

trackItems(index: number, itemNumber: number) {
  return itemNumber;
}
}