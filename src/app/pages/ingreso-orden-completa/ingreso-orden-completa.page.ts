import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonAccordionGroup, IonItem, ModalController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CajaPage } from 'src/app/modals/orden/caja/caja.page';
import { ChequeoOrdenPage } from 'src/app/modals/orden/chequeo-orden/chequeo-orden.page';
import { FacturacionPage } from 'src/app/modals/orden/facturacion/facturacion.page';
import { GetAnalisisIndividualOrdenPage } from 'src/app/modals/orden/get-analisis-individual-orden/get-analisis-individual-orden.page';
import { IngresoFacturaPage } from 'src/app/modals/orden/ingreso-factura/ingreso-factura.page';
import { MuestrasPage } from 'src/app/modals/orden/muestras/muestras.page';
import { SearchMedicoPage } from 'src/app/modals/orden/search-medico/search-medico.page';

import { SearchPacientePage } from 'src/app/modals/orden/search-paciente/search-paciente.page';
import { PerfilesavaPage } from 'src/app/modals/perfilesava/perfilesava.page';
import { MenuordenPage } from 'src/app/popover/menuorden/menuorden.page';
import { PopoverPagoPage } from 'src/app/popover/popover-pago/popover-pago.page';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { HelperService } from 'src/app/servicios/helpers/helper.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { WebRestService } from 'src/app/servicios/intranet/web-rest.service';
import { PdfRenderService } from 'src/app/servicios/pdf/pdf-render.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { FuncionesComunesIntra } from 'src/app/utils/funciones-comunes-intra';
import { ConfiguracionPage } from 'src/app/modals/configuracion/configuracion.page';


@Component({
  selector: 'app-ingreso-orden-completa',
  templateUrl: './ingreso-orden-completa.page.html',
  styleUrls: ['./ingreso-orden-completa.page.scss'] 
})
export class IngresoOrdenCompletaPage implements OnInit {
  //@ViewChild('Orden')  orden_slides: IonSlides;
  @ViewChild('itemPac', { static: false, read: ElementRef }) item: ElementRef;
  @ViewChild('toolbar_header', { static: false, read: ElementRef }) toolbar: ElementRef;
  @ViewChild('referencia', { static: false, read: ElementRef }) referencia: ElementRef;
  @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;


  optEntrega = [
    { tipo: "mail", input: true, icon: "mail-outline", checked: false, tag: "Mail", value: "", tinput: "text" },
    { tipo: "dictar", input: true, icon: "call-outline", checked: false, tag: "Dictar", value: "", tinput: "text" },
    { tipo: "fisico", input: true, icon: "newspaper-outline", checked: false, tag: "Entregar Físico", value: "", tinput: "text" },
    { tipo: "copia", input: true, icon: "copy-outline", checked: false, tag: "Entregar Copia", value: "", tinput: "number" },
    { tipo: "pedidomed", input: true, icon: "hand-right-outline", checked: false, tag: "Entregar Pédido Médico", value: "", hidden: "true" }
  ];

  dataOrden: any = {
    cod_ori: null,
    cod_pac: null,
    cod_med: null,
    ca1_ord: null,
    ca2_ord: null,
    pre_ord: 0.00,
    dcto_ord: 0.00,
    val_ord: 0.00,
    sts_ord: "PE",
    sts_adm: "S",
    txt_ord: null,
    cod_ref: null,
    dcto_val: 0.00,
    stat_ord: 0,
    id_plan: null,
    cod_suc: 1,//Revisar como sacar el codigo sucursal
    cod_emp: null,
    fec_ent: null,
    tip_ord: 0,
    cod_pac2: null,
    fac_ter: 0,
    cod_uni: null,
    pwd_ord: null,
    exp_ord: 0,
    pet_adi: 0,
    FEC_ENT2: null,
    nro_ext: null,
    mst_ext: 0,
    obs_ext: null,
    tip_ped: null,
    cod_ped: null,
    des_ped: null,
    iess_tseg: null,
    iess_dx: null,
    iess_tben: null,
    iess_tder: null,
    iess_nder: null,
    iess_tcon: null,
    iess_dx2: null,
    iess_id: null,
    nro_aux: 1,
    iess_dep: null,
    mail_ent: 0,
    mail_ent_det: null,
    dicta_ent: 0,
    dicta_ent_det: null,
    envio_ent: 0,
    envio_ent_det: null,
    cod_med2: null,
    copia_ent: null,
    pedido_ent: null,
    exclusive_ent: 0,
    //grupo_ord: null,
    fec_ord: null,
    num_analisis: 0,
    num_muestras: 0,
    user_type: null,
    user_code: null


  };
  pago=[]
/*
  pago: any = {
    cod_cli: '',
    cod_ori: null,
    cod_suc: '',
    cod_tdp: null,
    doc_pag: null,
    fac_seg: null,
    fec_upd: null,
    first_user: null,
    ins_pag: null,
    last_user: null,
    nro_ord: null,
    obs_pag: null,
    res_pag: null,
    val_pag: ''
  }
*/

  aplicoAumento: boolean = false;
  planSelected: any;
  origen_lab: any = null;
  // dataOrden:any=[];
  hora_entrega = "00:00";
  fecha_actual = new Date();
  paciente: any;
  segment_value: String = "orden"
  segment_secondary_value: String = "pet"
  medico: any;
  inputMedico = "";
  inputPaciente = "";
  input_paciente_terceros = "";
  precioFinal: any = null;
  listAnalisis: any = [];
  listSeguro: any;
  listUnidad: any = [];
  listSearchAnalisis: any = [];
  analisisbuscar = ""
  hiddenlistSearchAnalisis = true;
  total_ord = "";
  options_select = {
    cssClass: 'alert_select',
  }
  analisis: any;
  listReferencia: any = []
  referencia_select: any
  unidad_select: any;
  listMuestras: any = []
  preguntasAnalisis: any = [];
  public mobile = false;

  fechaEntrega: any = {
    fecha1: '',
    fecha2: ''
  }

  flag_show_pac_div = false;
  observaciones_usuario = '';
  codigo_orden_completa: any;
  variableUsuario: any;
  json_data: any;
  tabla_Pagos: any[] = [];
  orden_view: any;
  flag_referencia: boolean = false;
  cod_orden = '';
  vector_cod_name_ori: any = {
    name: '',
    value: ''
  };
  descuento:any;
text1: string = "";
text2: string = "";
paciente_completo:any;
paciente_completo_bolean:boolean=false;
paciente_completo_bolean_eliminar:boolean=false;

numero_antes:number;
bandera_limpia_vector_caja=0
////bloquea la facturacion a tercero
public bloquearIonItem: boolean = true;
///variable hora_entrega_resultados;
hora_entrega_resultados: String = "00:00";
////variable fecha_entrega_resultados;
fecha_entrega_resultados:String;
orden:any=[];
paciente_desde_atras:any=[];
public numero_orden;
cod_paciente_editar;

constructor(
    private varGlobal: VariablesGlobalesService,
    private queryservice: QueryService,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastservice: ToastService,
    private helper: HelperService,
    private popoverController: PopoverController,
    private serviciosPdf: PdfRenderService,
    private webrestservice: WebRestService,
    private loadingservice: LoadingService,
    private funcionesComunes: FuncionesComunesIntra,
    private modalcontroller: ModalController,
    private route: ActivatedRoute  ) { }

  ngOnInit() {
    const paciente = history.state.paciente;
    this.varGlobal.getOrden_pac_view();
    this.varGlobal.getPaciente_orden_nueva_orden();
    this.paciente_desde_atras=this.varGlobal.getPaciente_orden_nueva_orden();
    console.log('this.paciente_desde_atras: ',this.paciente_desde_atras);


    this.orden=this.varGlobal.getOrden_pac_view();
    console.log('Bandera a verificar : ',this.orden);
    if (window.screen.width < 600 || window.innerWidth < 600) { // 768px portrait
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    window.onresize = () => {
      console.log('this.mobile', this.mobile);

      if (window.screen.width < 600 || window.innerWidth < 600) { // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    };
    window.onscroll=()=>{
      console.log("entre scroll");
    }
    this.getOrigen();
    this.getSeguro();
    this.getReferencia();
    this.getUnidad();
    const fecha_actualss: Date = new Date();
    const variable_fecha_datos_entrega: string = this.fecha_actual.toString();
    this.fecha_entrega_resultados=this.formatearFecha(variable_fecha_datos_entrega);

console.log('thisss--orden: ',this.orden);


    if(this.orden===null || this.orden===undefined || this.orden===''){
        // this.paciente=this.paciente_desde_atras;
        this.paciente=this.paciente_desde_atras;
        this.medico=null;
        this.numero_orden=0;
        console.log('this.paciente111" ',this.paciente);
      
    }else{
      this.numero_orden=this.orden.nro_ord;
      // this.paciente=this.paciente_desde_atras;
      this.paciente=327;
      console.log('Numero Orden: ',this.numero_orden);
      this.getOrdentoResultadosDynamic(this.numero_orden,"int");
    }     
    }

    getOrdentoResultadosDynamic(nro_orden,tipo){ 

      console.log('nro_orden: ',nro_orden+" tipo: ",tipo);
      let data:any={};
      data.nro_orden=nro_orden;
      data.tipo=tipo;
      this.queryservice.getOrdenResultadosSB(data).then((r:any)=>{
        console.log('resultado by Dinamic1: ',r);
        let result=r.data.getOrdentoResultadosDynamic[0]; 
        // if(result>0){
          console.log('Resultado de Dynamic2: ',result.cod_pac);
          this.cod_paciente_editar=result.cod_pac;
          // this.paciente=result;
          this.medico=result;
          console.log('this.medicomedico: ',this.medico);   
          this.getPaciente_cod_paciente_editar(this.cod_paciente_editar);

        // }else{
        //   console.log('No se encuentra resultados');
        // }
        
  
      }); 
    }

/////////get Paciente///////////////
////////////////////////////////////////
getPaciente_cod_paciente_editar(cod_paciente_editar) {
  
  this.queryservice.getPacientesbyCod(cod_paciente_editar).then((r: any) => {
    if (r.data.getPacientebyCod.cod_pac !== null) {
      this.paciente = r.data.getPacientebyCod;
      console.log('this.paciente*----> Verificar: ',this.paciente);
    }
    else {
      this.toastservice.presentToast({ message: "No se encuentra Paciente", position: "top", color: "warning", duration: 1500 });
    }
  })
}




  ionViewDidLoad() {
   console.log('ionViewDidLoad ServicePage');

   //
  }
  ChangeContentView() {
    console.log("entreeee");
    if (this.item) {
      // console.log('this.item.nativeElement',this.item.nativeElement);
      //console.log('this.item.nativeElement',this.item.nativeElement.getBoundingClientRect());
      //console.log('this.toolbar_header.nativeElement',this.toolbar.nativeElement);
      //console.log('this.toolbar_header.nativeElement',this.toolbar.nativeElement.getBoundingClientRect());
      //console.log('this.referencia.nativeElement',this.referencia.nativeElement);
      console.log('this.referencia.nativeElement', this.referencia.nativeElement.getBoundingClientRect().y);
      let y_position_div = this.referencia.nativeElement.getBoundingClientRect().y
      if (y_position_div <= 117) {
        this.flag_show_pac_div = true
      }
      else {
        this.flag_show_pac_div = false
      }


    }
  }

  async presentModalNewPaciente() {
    const modal = await this.modalController.create({
      component: SearchPacientePage,
      componentProps: { value: 123 },
      backdropDismiss: false
    });


    await modal.present();
    modal.onDidDismiss().then(r => {

      if (r.data) {
        this.paciente = r.data.paciente
        this.inputPaciente=this.paciente.id_pac;
        console.log('this.paciente: -Modal: ',this.inputPaciente);
      }
    })
  }

  


  async presentModalNewMedico() {
    const modal = await this.modalController.create({
      component: SearchMedicoPage,
      componentProps: { value: 123 },
      backdropDismiss: false
    });

    await modal.present();
    modal.onDidDismiss().then(r => {

      if (r.data) {
        this.medico = r.data.medico
        this.inputMedico=this.medico.cod_med;
        console.log('this.medico: ', this.inputMedico);
      }
    })
  }


  testMedico(){
    let data ={"nom_med":"aa","id_med":"aa","mail_med":"aa","esp_med":"aa","col_med":"aa","cel_med":"aa","telf_med":"aa","dir_med":"aa","obs_med":"aaa"}
    this.queryservice.insertMedicoLite(JSON.stringify(data)).then((r)=>{
      console.log("r",r);

    })
  }

  getOrigen() { 
  const origenNombre = localStorage.getItem('origen_nombre');
    console.log('origenNombre: ',origenNombre);
  if (origenNombre) {
    const origenLabInfo = JSON.parse(origenNombre);
    console.log('origenLabInfo: ',origenLabInfo);
    console.log('origenNombre.arreglo Veriicar: ',origenLabInfo.arreglo);
    this.origen_lab = origenLabInfo.name;
    this.cod_orden = origenLabInfo.value;
    if(origenLabInfo.arreglo===undefined){
      console.log('Aqui esta en un error esto es algo que es imporante para no borra');

    }else{
      origenLabInfo.arreglo.forEach(element => {      
        const varible_cod_ori=element.value.cod_ori;
          console.log('Elemento: Foreach ',element);
          console.log('varible_cod_ori: ',varible_cod_ori);
          console.log('origen_lab verifica 2 veces: ',this.origen_lab);
  
        if(this.cod_orden === varible_cod_ori ){
          this.hora_entrega_resultados=element.value.hora_ori
          console.log('hora_entrega_resultados: ',this.hora_entrega_resultados);        
        }
        
      });
      }
      } 
    }

  getSeguro() {
    this.queryservice.getListSeguro().then((r: any) => {
      console.log('planes', r);
      this.listSeguro = r.data.ListSeguro;
      if (this.varGlobal.getPlanDefault() != '') {
        let plan_temp = this.varGlobal.getPlanDefault(); console.log('plan_temp',plan_temp);
        for (let index = 0; index < this.listSeguro.length; index++) {
          const element = this.listSeguro[index];
          for (let index2 = 0; index2 < element.Plan.length; index2++) {
            const element2 = element.Plan[index2];
            if (element2.id_plan == plan_temp.id_plan) {
              this.planSelected = this.listSeguro[index].Plan[index2];
              return
            }
          }
        }
      }else{
        this.planSelected = this.listSeguro[0].Plan[0];
      }

      

    })
  }

  getReferencia() {
    this.queryservice.getListReferencia().then((r: any) => {
      console.log("referencia", r);
      let data = r.data.ListReferencia
      this.listReferencia = data;
    })
  }

  getUnidad() {
    this.queryservice.getListUnidad().then((r: any) => {
      console.log("unidad", r);
      this.listUnidad = r.data.ListUnidad

    })
  }
  checkPriority() {
    console.log("checck date", this.dataOrden.stat_ord);

    if (this.dataOrden.stat_ord == 1) {
      console.log("checck urgente");
      //      this.fechaEntrega.fecha1 = this.helper.soloFecha(new Date());
      //      console.log(this.fechaEntrega);

    }
  }


    getFormattedCurrentDate(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Months are zero-based
      const day = today.getDate();
  
      // Ensure leading zeros for months and days
      const formattedMonth = month < 10 ? `0${month}` : `${month}`;
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
  
      return `${year}-${formattedMonth}-${formattedDay}`;
    }
  

  async presentAlertOrigen() {
    
    const r = await this.queryservice.getListOrigen();
    let inputs = [];
    let cont = 0;
    let storage_origen_env;
    if (r && r.data && r.data.ListOrigen && r.data.ListOrigen.length > 0) {
      r.data.ListOrigen.forEach((origen) => {

        inputs.push({
          name: origen.des_ori,
          type: 'radio',
          label: origen.des_ori,
          value: origen,
          // value: origen.cod_ori,
          cont: cont
        });
        cont++;
      });

      const alert = await this.alertController.create({
        header: 'Seleccione un Origen !',
        inputs: inputs,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel: blah');
            }
          },
          {
            text: 'Seleccionar',
            handler: async (contador) => {
              this.getMostrarCodOrigenLab(inputs, contador);
            }
          }
        ]
      });
      await alert.present();
    } else {
      console.log('No se encontraron datos de Orígenes.');
    }
  }

  getMostrarCodOrigenLab(inputs, contador) {
  
    console.log('nombre de origen: ',contador.des_ori);
    console.log('id de origen: ',contador.cod_ori);
    console.log('Vector de origen verificar: ',inputs);
    this.cod_orden = contador.cod_ori;
    this.origen_lab = contador.des_ori;
    this.vector_cod_name_ori = {
      name: this.origen_lab,
      value: this.cod_orden,
      arreglo:inputs
    }


    inputs.forEach(element => {      
      const varible_cod_ori=element.value.cod_ori;
        console.log('Elemento: Foreach eeee',element);
        console.log('varible_cod_ori:eeee',varible_cod_ori);
        console.log('origen_lab verifica 2 veces: ',this.origen_lab);

      if(this.cod_orden === varible_cod_ori ){
        this.hora_entrega_resultados=element.value.hora_ori
      }
      console.log('varible_cod_ori2: ',this.hora_entrega_resultados);
      
    });

    console.log('this.vectocodigoname: ', this.vector_cod_name_ori);
    localStorage.setItem('origen_nombre', JSON.stringify(this.vector_cod_name_ori));
  }

  async presentModalSearchPaciente() {
    const modal = await this.modalController.create({
      component: SearchPacientePage,
      componentProps: { value: 123 },
      backdropDismiss: false
    });

    await modal.present();
    modal.onDidDismiss().then(r => {
      console.log(r);
      if (r.data) {
        this.paciente = r.data.paciente
      }
    })
  }

  getMedico() {
    console.log(" this.inputMedico", this.inputMedico);

    if (this.inputMedico === '') {
      let toastconf =
      {
        'message': 'Ingrese el codigo de Médico',
        'style': 'warning',
        'position': 'top'
      };
      this.toastservice.presentToast(toastconf);
      return
    }

  this.queryservice.getMedicosbyCod(this.inputMedico).then((r: any) => {
    console.log(r);
    if (r.data.getMedicobyCod != null) {
      this.medico = r.data.getMedicobyCod
      console.log('this.medico::: ',this.medico);
    }
    else {
      this.toastservice.presentToast({ message: "No se encuentra medico", position: "top", color: "warning", duration: 1500 })
    }
  })
}

  /////////get Paciente///////////////
  ////////////////////////////////////////
  getPaciente() {
    console.log(" this.inputPaciente", this.inputPaciente);
    if (this.inputPaciente === '') {
      let toastconf =
      {
        'message': 'Ingrese la Cédula del Paciente',
        'style': 'warning',
        'position': 'top'
      };
      this.toastservice.presentToast(toastconf);
      return
    }
    this.queryservice.getPacientesbyId(this.inputPaciente).then((r: any) => {
      console.log(r);
      if (r.data.getPaciente.id_pac !== null) {
        this.paciente = r.data.getPaciente;
        console.log('this.paciente*----> Verificar: ', this.paciente);
      }
      else {
        this.toastservice.presentToast({ message: "No se encuentra Paciente", position: "top", color: "warning", duration: 1500 });
      }
    })
  }

  //////////////////get Paciente_a_terceros///////////////////////////////////
  getPaciente_terceros() {
    console.log(" this.inputPaciente_terceros", this.input_paciente_terceros);
  
    if (this.input_paciente_terceros === '') {
      let toastconf =
      {
        'message': 'Ingrese la Cédula del Paciente',
        'style': 'warning',
        'position': 'top'
      };
      this.toastservice.presentToast(toastconf);
      return
    }

  const cedula_paciente_tercero=this.input_paciente_terceros.trim();

console.log('Const cedula_paciente_tercera: ',cedula_paciente_tercero);
    this.queryservice.getPacientesbyId(cedula_paciente_tercero)
  .then((r: any) => {
      console.log(r);
      if (r.data.getPaciente.id_pac !== null) {
        this.paciente_completo = r.data.getPaciente;
        console.log('this.paciente*----> Verificar: ',  this.paciente_completo);
        this.bloquearIonItem=true;
      this.paciente_completo_bolean_eliminar=false;
      this.paciente_completo_bolean=false;
      } else {
        this.toastservice.presentToast({ message: "No se encuentra Paciente", position: "top", color: "warning", duration: 1500 });
      }
    })
  .catch(error => {
    console.error("Error al obtener pacientes: ", error);
  });
  }





  ///////////////////////////////////////////
  ///////////////////////////////////////////
  searchAnalisisList() {
    console.log('entr seare');
    console.log('this.analisisbuscar', this.analisisbuscar);

    if (this.analisisbuscar == '' || this.analisisbuscar == null) {
      console.log("entre no hay dato");

    return
  }
  let data = this.queryservice.SearchAnalisxMstrs2(this.analisisbuscar);
  data.then((result: any) => {
    this.hiddenlistSearchAnalisis = false;
    console.log(result);
    let data = result.data.searchAnalisisMstrs2
    this.listSearchAnalisis = data;
    console.log('list', this.listSearchAnalisis);
console.log('Aqui aumenta el analisis debe en primera');
    if (this.listSearchAnalisis.length >= 10) {
      this.listSearchAnalisis.push({ 'mayor': true, 'message': 'Buscar mas ' })
    }
  });
  
}

  close_analisis() {
    setTimeout(() => {
      this.hiddenlistSearchAnalisis = true
    }, 500)

  }

selectAnalisis(item) {
  this.hiddenlistSearchAnalisis = true;
  console.log('Anmañsas', item)
  if (item.cod_ana) {
    console.log("entre if buscar");
    this.analisisbuscar = item.cod_ana;
    this.searchAnalisis()
  }
  if (item.mayor) {
  }
 if(this.tabla_Pagos.length>0){
  this.pago=[];
  this.bandera_limpia_vector_caja=1;
  this.toastservice.presentToast({ message: "Aumento un analisis tus pagos se volveran a recargar", position: "buttom", duration: "1500", color: "warning" });
 
}
console.log('Select Analisis: Verifiarrrrrr',item);
}

searchAnalisis() {
  const vector_fecha_entrega=[];
  if (this.planSelected == null || this.planSelected == undefined) {
    this.toastservice.presentToast({ message: "Debe seleccionar un tipo de plan", position: "top", duration: 1500, color: "warning" });
    return
  }
  let message;
  if (this.analisisbuscar == '' || this.analisisbuscar == null) {
    let toastconf =
    {
      message: "Analisis vacio",
      style: 'warning',
      position: 'top'
    };
    this.toastservice.presentToast(toastconf);
    return
  }
  let cod_ana = this.analisisbuscar;
  let repetido = false
  console.log("this.list", this.listAnalisis);

    this.listAnalisis.forEach(element => {

    if (element.cod_ana == cod_ana) {
      console.log('repetido');
      repetido = true
    }
  });
  if (repetido) {

    let toastconf =
    {
      message: "Análisis repetido",
      style: 'warning',
      position: 'top'
    };
    this.toastservice.presentToast(toastconf);
    this.analisisbuscar = ''
    return
  }



    let data = this.queryservice.SearchAnalisxMstrs(this.analisisbuscar);
    data.then(
      async (result: any) => {
        let data = result.data.AnalisisMstrsbyCod
        if (data.length > 0) {
          this.analisis = data[0];
          /*
          if (!this.orden_view) {
            */
          this.queryservice.getQuexAna({ cod_ana: this.analisis.cod_ana }).then((r: any) => {
            console.log('questions', r);
            let data_q: any = r.data.GetQuexAna;
            if (data_q.length > 0) {
              for (let index = 0; index < data_q.length; index++) {

                const element = data_q[index];
                element.des_ana = this.analisis.des_ana
                console.log('element questions', element);

                this.presentAlertQuestionsAna(element);
              }
            }

          })
          /*
        }
        */
          console.log("this.analisis", this.analisis);


          //estructura analisis---------------------------------------------------------------------
          this.analisis.aumento = false;
          this.analisis.dcto_val = 0.00;
          this.analisis.dcto_pet = 0.00;
          this.analisis.sts_pet = "PE";
          this.analisis.des_sts = "Pendiente";
          this.analisis.cant_pet = 1;
          if (this.analisis.dias_proceso) {
              let fechaCal: any = this.helper.calcDemora(this.analisis.demora, this.analisis.dias_proceso);
            console.log('fechaCal-----', fechaCal);
          
      



            this.analisis.fechaFinal = fechaCal;
            if (this.fechaEntrega.fecha1 == '') {
              console.log("entre fecha1 vacia");
              this.fechaEntrega.fecha1 = this.helper.soloFecha(fechaCal);
              // this.fechaEntrega.fecha1 = fechaCal.toISOString();
              console.log("entre fecha1 vacia", this.fechaEntrega.fecha1);
            } else {
              if (fechaCal > this.fechaEntrega.fecha1) {
                this.fechaEntrega.fecha1 = this.helper.soloFecha(fechaCal);
              }
            }



          
            this.analisis.fec_ent = this.analisis.fechaFinal;

            //   const lang = this.translate.getDefaultLang();

            var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

            this.analisis.fechaFinal = this.analisis.fechaFinal.toLocaleString(undefined, options);
          console.log('this.analisis.fechaFinal verificar: ',this.analisis.fechaFinal);

          } else {
            this.analisis.fechaFinal = ' ';
            this.analisis.fecha_ent = null;
          }
          this.listAnalisis.push(this.analisis);
        if (this.listAnalisis.length > 0) {
          const ultimoElemento = this.listAnalisis[this.listAnalisis.length - 1].fechaFinal;
          this.listAnalisis.forEach(element => {
            vector_fecha_entrega.push(new Date(this.formatearFecha(element.fechaFinal)));
          });
          const fechaMaxima = new Date(Math.max.apply(null, vector_fecha_entrega));          
          const fechaFinalDate = new Date(fechaMaxima);
          const fechaFinalFormateada = fechaFinalDate.toISOString().split('T')[0];
          this.fecha_entrega_resultados = fechaFinalFormateada;          
        } else {
          console.log('La lista está vacía.');
        }
          this.analisisbuscar = ""
        }
        else {
          let message;
          /*
          this.translate.get('message.notfoundg').subscribe((res: string) => {
            message = "Not found revisar";
          });
  */
          let toastconf =
          {
            'message': "Not found revisar",
            'style': 'warning',
            'position': 'top'
          };
          this.toastservice.presentToast((toastconf));
          return
        }
      }
      ,
      (error) => {
        let message;
        /*
        this.translate.get('message.servererror').subscribe((res: string) => {
          message = res;
        });
  */
        let toastconf =
        {
          //      'message': message + " " + error,
          'message': "error revisar " + error,
          'style': 'warning',
          'position': 'top'
        };
        this.toastservice.presentToast((toastconf));
        return

      }
    ).finally(() => {
      //this.calcTotal()
      this.updatePreciosbyPlan('uno', this.analisis)
      setTimeout(() => {
        this.calcTotal()
        this.getMuestrasbyAnalisis();


      }, 1000)

  });
}


formatearFecha(fechaString: string): string {
  const partesFecha = fechaString.split(' ');
  const diaSemana = partesFecha[0];
  const diaMes = partesFecha[1];
  const mes = partesFecha[2];
  const año = partesFecha[3];
  const mesesEnIngles = {
    'ene': 'Jan',
    'feb': 'Feb',
    'mar': 'Mar',
    'abr': 'Apr',
    'may': 'May',
    'jun': 'Jun',
    'jul': 'Jul',
    'ago': 'Aug',
    'sep': 'Sep',
    'oct': 'Oct',
    'nov': 'Nov',
    'dic': 'Dec'
  };
  return `${diaSemana} ${diaMes} ${mesesEnIngles[mes]} ${año}`;
}

  updatePreciosbyPlan(tipo, data) {
    console.log('updateplan', this.planSelected);

    let plan = this.planSelected;

    console.log('precios plan todo');
    for (let index = 0; index < this.listAnalisis.length; index++) {
      const element = this.listAnalisis[index];
      console.log("element preciooos", element);

      let flag_no_precio = false;
      let data_p = this.queryservice.getPrecios(element.cod_ana, plan.cod_lpr);
      data_p.then((result: any) => {
        console.log("result asdadasdadas", result);
        if (result.data.PreciosbySeguro == null) {
          if (!element.flag_no_precio) {
            this.toastservice.presentToast({ message: element.des_ana + " no tiene asignado un precio", duration: 2000, color: "warning", position: "center" });
            this.removeAnalisis(element)
          }
          flag_no_precio = true;
          element.flag_no_precio = flag_no_precio
          element.paso = true
          element.subtotal = 0;
          element.totalPac = 0;
          element.total_vista = "0.00";
          element.pospago = 0;
          return
        }
        let data = result.data.PreciosbySeguro;
        console.log(data);
        if (data.pre_ana == null || data.pre_ana == '') {
          data.pre_ana = 0;
          flag_no_precio = true;
        }
        let porcentaje = 0.00;
        if (plan.por_seg == 0 && data.por_seg == '0.00') {
          porcentaje = 0;
        }
        else if (plan.por_seg > 0) {
          porcentaje = plan.por_seg
        } else {
          porcentaje = data.por_seg
        }
        let pre_analisis = data.pre_ana * plan.fac_plan
        let pospago: any = this.helper.toFixed((pre_analisis * porcentaje), 2)
        //let pospago: any = this.helper.toFixed((data.pre_ana * porcentaje), 2)

        /* 
        element.subtotal = (data.pre_ana - pospago);
         element.totalPac = (data.pre_ana - pospago);
         */
        element.flag_no_precio = flag_no_precio
        element.subtotal = (pre_analisis - pospago);
        element.totalPac = (pre_analisis - pospago);
        element.total_vista = (pre_analisis - pospago).toFixed(2);
        element.pospago = pospago;
      }, error => {
        console.log("entre al error", error);

      });
      setTimeout(() => { this.calcTotal() }, 1000);
    }
    return
  }

  calcTotal() {
    let total: number = 0.00;
    let pospago: number = 0.00
    let subtotal: number = 0.00
    let flag_aumento: boolean = false;

    if (this.listAnalisis.length > 0) {
      for (let i = 0; i < this.listAnalisis.length; i++) {
        console.log('this.listAnalisis[i]', this.listAnalisis[i]);



        if (this.listAnalisis[i].aumento) {
          flag_aumento = true;
          // this.listAnalisis.dcto_val=this.dataOrden.dcto_val
          if (this.dataOrden.dcto_val == 0) {
            this.listAnalisis[i].dcto_val = this.dataOrden.dcto_val;
            this.listAnalisis[i].aumento = false;
          } else {
            this.listAnalisis[i].dcto_val = this.dataOrden.dcto_val;
          }
        }

      }

      if (!flag_aumento && this.dataOrden.dcto_val != 0) {
        this.listAnalisis[this.listAnalisis.length - 1].dcto_val = this.dataOrden.dcto_val;
        this.listAnalisis[this.listAnalisis.length - 1].aumento = true;
      }

    }
    this.listAnalisis.forEach((element, index) => {
      element.dcto_pet = this.dataOrden.dcto_ord;
      subtotal = subtotal + parseFloat(element.subtotal);




      if (this.dataOrden.dcto_ord != 0) {

        let totalTemp = (((element.subtotal * element.dcto_pet) / 100) + parseFloat(element.subtotal) + element.dcto_val);
        element.totalPac = this.helper.toFixed(totalTemp, 2);

      }
      total = total + parseFloat(element.totalPac);
      pospago = pospago + parseFloat(element.pospago);

    });
    //  total=total+this.dataOrden.dcto_val;
    this.precioFinal = { total: total, pospago: pospago, subtotal: subtotal }

    this.dataOrden.pre_ord = subtotal;
    this.dataOrden.val_ord = total;
    this.total_ord = total.toFixed(2);

  }

  removeAnalisis(item) {
    for (let i = 0; i < this.listAnalisis.length; i++) {
      if (item.cod_ana == this.listAnalisis[i].cod_ana) {
        if (this.listAnalisis[i].aumento) {
          this.aplicoAumento = false;
        }
        this.listAnalisis.splice(i, 1);
        console.log('muestras', this.listMuestras);
        let temp_analisis_preguntas = this.preguntasAnalisis.filter(pregunta => pregunta.cod_ana != item.cod_ana);
        this.preguntasAnalisis = temp_analisis_preguntas;
        //this.removeMuestras(item);
        this.getMuestrasbyAnalisis();
      }
    }
    this.calcTotal()
    console.log('length analisis', this.listAnalisis.length);

console.log('this.pago.length: ',this.pago.length);

this.limpiar_pagos();

}
/////////////////Desde aqui va los cambios en get analisis Individual///////////////////////




async presentAlertaaa(item) {

  console.log('Itemmmmmm: ',item);
  const alert = await this.alertController.create({
    header: item.des_ana,
     buttons: ['Regresar'],
    inputs: [
      {    
        type: 'text',
        value: `Código de análisis:     ${item.cod_ana}`,        
        disabled: true, 
      },
      {        
        type: 'text',
        value: `Estado de análisis:     ${item.des_sts}`,        
        disabled: true, 
      },
      {
        type: 'text',
        value: `Descuento de petición:      ${item.dcto_pet}`,        
        disabled: true, 
      },
      {
        type: 'text',
        label: 'Código de análisis:',
        value: `Descuento Valor:     ${item.dcto_val}`,
        disabled: true, //    
      },
      {        
        type: 'text',
        value: `Pospago:      ${item.pospago}`,        
        disabled: true, 
      },
      {        
        type: 'text',
        value: `Subtotal:     ${item.subtotal}`,        
        disabled: true, 
      },
      {        
        type: 'text',
        value: `Total:      ${item.subtotal}`,   
        disabled: true,      
      },
      {
        type: 'text',        
        value: `Fecha de entrega:   ${item.fechaFinal}`, 
        disabled: true,
      },
     
    ],
  });

  await alert.present();
}




async getAnalisisIndividual(item) {
console.log('El item que viene de get AnalisisIndividual: ',item);

const modal = await this.modalController.create({
  component: GetAnalisisIndividualOrdenPage,
  componentProps: {
    'item':item,
    modalId: 'get_analisis_individual',
  },
  id:'get_analisis_individual'
});
modal.onDidDismiss()
  .then((result: any) => {   
  });
await modal.present();


}





  getMuestrasbyAnalisis() {
    let cadena = "";
    let temporal = [];
    temporal = this.listAnalisis.filter(analisis => !analisis.flag_no_precio);
    console.log("temporallll", temporal);
    if (temporal.length == 0) {
      this.listMuestras = []
      return
    }
    for (let index = 0; index < temporal.length; index++) {
      const element = temporal[index];
      if (index != 0) {
        cadena += ", "
      }
      cadena += "'" + element.cod_ana + "'";
    }

    this.queryservice.getMuestrasxAna(JSON.stringify({ analisis: cadena })).then(async (result: any) => {
      console.log('result', result);
      this.listMuestras = [];
      let data = JSON.parse(result.data.GetMuestrasxAnalisis.data)
      for await (const element of data) {
        //console.log("element",element);
        let muestra_temp = {
          des_mst: element.xdes_mst,
          cod_mst: element.xcod_mst,
          // analisis: data.cod_ana,
          fec_upd: new Date(),
          fec_ini: new Date(),
          fec_ent: new Date(),
          lock_mst: 0,
          checked: true,
          id_mxo: null
        }
        /*
        if (this.orden_view) {
          console.log('this.muestras_temp');
  
          for (let index = 0; index < this.muestras_temp.length; index++) {
            const element_temp = this.muestras_temp[index];
            console.log('element_temp mst', element_temp);
  
            if (element_temp.cod_mst == element.xcod_mst) {
              muestra_temp.id_mxo = element_temp.id_mxo
            }
          }
        }
  */
        this.listMuestras.push(muestra_temp)
        console.log('this.listMuestras', this.listMuestras);

      }

    }, error => {
      console.error('error', error);
    })
  }



  async presentPopoverMenu(ev: any) {
    const popover = await this.popoverController.create({
      component: MenuordenPage,
      event: ev,
      translucent: true,
      mode: "ios",
      size: "auto",
      side: "bottom",
      alignment: "end"

    });

    await popover.present();
  }

  changePrioritybtn() {
    if (this.dataOrden.stat_ord == 1) {
      this.dataOrden.stat_ord = 2
      return
    } else if (this.dataOrden.stat_ord == 2) {
      this.dataOrden.stat_ord = 0
      return
    }
    else {
      this.dataOrden.stat_ord = 1
      return
    }
  }


  async presentAlertQuestionsAna(data) {
    const alert = await this.alertController.create({
      header: 'Responda por favor',
      subHeader: data.des_ana,
      message: data.cod_que,
      inputs: [
        {
          type: 'text',
          name: 'que_res'
        }
      ],
      buttons: [{
        text: "Aceptar",
        handler: (data_alert) => {
          console.log("data res", data_alert);
          this.preguntasAnalisis.push({
            cod_ana: data.cod_ana,
            des_ana: data.des_ana,
            cod_que: data.cod_que,
            res_que: data_alert.que_res
          })
        }
      }]
    });

    await alert.present();
  }

  async presentModalMuestras() {
    const modal = await this.modalController.create({
      component: MuestrasPage,
      componentProps: { listMuestras: this.listMuestras }
    });

    await modal.present();

  }

  async presentModalObservations(tipo) {
    const modal = await this.modalController.create({
      component: ChequeoOrdenPage,
      componentProps: {
        optEntrega: this.optEntrega,
        fechaEntrega: this.fechaEntrega,
        observaciones_usuario: this.observaciones_usuario,
        exclusive_ent: this.dataOrden.exclusive_ent,
        preguntas_ana: this.preguntasAnalisis,
        dataOrden: this.dataOrden,
        tipo: tipo
      }
    });
    this.dataOrden.stat_ord
    modal.onDidDismiss()
      .then((result: any) => {

        console.log(result)

        if (result.data.observaciones_usuario) {
          this.observaciones_usuario = result.data.observaciones_usuario
        };

        if (result.data.stat_ord) {
          this.dataOrden.stat_ord = result.data.stat_ord
        };

        if (result.data.tipo == 'S') {
          console.log('this.pago.length',this.pago.length);
          
          if (this.pago.length == 0) {
            this.presentAlertNopago()
          } else {
            this.saveComplete()
            
          }

        }
      });

    await modal.present();



  }

  async presentAlertNopago() {
    const alert = await this.alertController.create({
      header: 'Advertencia',
      message: 'La orden no cuenta con pagos registrados <br> Desea continuar.',
      buttons: [{ text: "Cancelar" }, {
        text: "Aceptar",
        handler: () => {
          this.saveComplete()
        }
      }]
    });

    await alert.present();
  }


  async presentPopoverPago(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverPagoPage,
      event: ev,
      translucent: false,
      componentProps: {
        'dcto_ord': this.dataOrden.dcto_ord,
        'dcto_val': this.dataOrden.dcto_val,
        'val_ord': this.dataOrden.val_ord,
        'pre_ord': this.dataOrden.pre_ord,
        //  'listAnalisis': this.listAnalisis,
        //   'list_pagos': this.list_pagos

      },
      mode: "ios",
      cssClass: "pop_over_pago"
    });
    popover.onDidDismiss().then(
      ((result: any) => {
        console.log(result);

        let data = result.data.dataModal;
        if (data) {
          this.dataOrden.dcto_ord = data.dcto_ord,
            this.dataOrden.dcto_val = data.dcto_val,
            this.dataOrden.val_ord = data.val_ord,
            this.dataOrden.pre_ord = data.pre_ord,
            this.listAnalisis = data.listAnalisis,
            //   this.list_pagos = data.list_pagos
            this.calcTotal()
        }



      })
    )
    popover.present();
  }

  limpiar_pagos(){
    if(this.pago.length>0){
    this.pago=[];
    this.bandera_limpia_vector_caja=1;
    this.toastservice.presentToast({ message: "Eliminaste un analisis tus pagos se volveran a recargar", position: "buttom", duration: "1500", color: "danger" })
    }
  
    //this.tabla_Pagos=[];
  }


  async presentModalPago() {
    const numeroAnalisisAntes = this.listAnalisis.length;
  console.log(`this.dataOrden ordenaaaaaa: `,this.dataOrden);
  const modal = await this.modalController.create({
    component: CajaPage,
    componentProps: {
      'dcto_ord': this.dataOrden.dcto_ord,
      'dcto_val': this.dataOrden.dcto_val,
      'val_ord': this.dataOrden.val_ord,
      'pre_ord': this.dataOrden.pre_ord,
      'codigo_orden_completa': this.codigo_orden_completa,
      'variableUsuario': this.variableUsuario,
      json_data: this.json_data,
      'tabla_Pagos': this.tabla_Pagos,
      'bandera_limpia_vector_caja':this.bandera_limpia_vector_caja,
      'analisis':this.listAnalisis,
      'numeroAnalisisAntes': numeroAnalisisAntes,

    },
  });
  modal.onDidDismiss()
    .then((result: any) => {
     this.pago=result.data.pagos_arreglo;
     this.bandera_limpia_vector_caja=result.data.bandera_limpia_vector_caja;
      if (result.data.tipo == 'P') {
        // this.saveComplete();
        console.log('this.pago arreglo: ', this.pago);    
           }        
         this.tabla_Pagos=this.pago;  
           console.log('pago: ',this.pago);
    });
  await modal.present();
}


  saveComplete() {

    if (this.orden_view) {
      this.toastservice.presentToast({ message: "No puede guardar una orden en modo vista", position: "top", duration: "1500", color: "danger" })
      return
    }

    if (this.listAnalisis.length == 0) {
      this.toastservice.presentToast({ message: "No existen análisis para guardar orden", position: "top", duration: "1500", color: "warning" })
      return
    }

console.log('this.paciente',this.paciente);

    if (!this.paciente || this.paciente.cod_pac == null || this.paciente.cod_pac == '' ) {
      this.toastservice.presentToast({ message: "Falta información del paciente", position: "top", duration: "1500", color: "warning" })
      return
    } else { this.dataOrden.cod_pac = this.paciente.cod_pac; }
    
    if (!this.medico ||this.medico.cod_med == null || this.medico.cod_med == 'null' || this.medico.cod_med === undefined) {
      this.toastservice.presentToast({ message: "Falta información del médico", position: "top", duration: "1500", color: "warning" })
      return
    } else { this.dataOrden.cod_med = this.medico.cod_med; }

    if (this.fechaEntrega.fecha1 == '') {
      this.dataOrden.fec_ent = this.helper.fechaFormato(new Date, this.hora_entrega)
    } else {
      this.dataOrden.fec_ent = this.helper.fechaFormato(this.fechaEntrega.fecha1, this.hora_entrega)
    }
    if (this.fechaEntrega.fecha2 != '') {
      this.dataOrden.FEC_ENT2 = this.fechaEntrega.fecha2
    } else {
      this.dataOrden.FEC_ENT2 = null
    }

    for (let i = 0; i < this.optEntrega.length; i++) {
      if (this.optEntrega[i].tipo == 'mail') {
        if (this.optEntrega[i].checked) {
          this.dataOrden.mail_ent = 1;
          this.dataOrden.mail_ent_det = this.optEntrega[i].value
        }
        else {
          this.dataOrden.mail_ent = 0;
          this.dataOrden.mail_ent_det = null;
        }
      }
      if (this.optEntrega[i].tipo == 'dictar') {
        if (this.optEntrega[i].checked) {
          this.dataOrden.dicta_ent = 1;
          this.dataOrden.dicta_ent_det = this.optEntrega[i].value
        }
        else {
          this.dataOrden.dicta_ent = 0;
          this.dataOrden.dicta_ent_det = null;
        }
      }
      if (this.optEntrega[i].tipo == 'fisico') {
        if (this.optEntrega[i].checked) {
          this.dataOrden.envio_ent = 1;
          this.dataOrden.envio_ent_det = this.optEntrega[i].value
        }
        else {
          this.dataOrden.envio_ent = 0;
          this.dataOrden.envio_ent_det = null;
        }
      }
      if (this.optEntrega[i].tipo == 'copia') {
        if (this.optEntrega[i].checked) {
          this.dataOrden.copia_ent = 1;
          this.dataOrden.cod_med2 = this.optEntrega[i].value
        }
        else {
          this.dataOrden.copia_ent = 0;
          this.dataOrden.cod_med2 = null;
        }
      }
      if (this.optEntrega[i].tipo == 'pedidomed') {
        if (this.optEntrega[i].checked) {
          this.dataOrden.pedido_ent = 1;
        }
        else {
          this.dataOrden.pedido_ent = 0;
        }
      }
    }

    this.dataOrden.cod_ori = 2;
    let forden = new Date();
    this.dataOrden.fec_ord = this.helper.soloFecha(forden);
    this.dataOrden.dcto_ord = (this.dataOrden.dcto_ord / 100);
    this.dataOrden.id_plan = this.planSelected.id_plan;

    let observaciones = '';
    if (this.flag_referencia) {
      observaciones += "Orden ingresada por Referencia "
      this.dataOrden.user_type = 'ref',
        this.dataOrden.user_code = this.varGlobal.getVarUsuario()


    }
    this.preguntasAnalisis.forEach(element => {
      observaciones += element.cod_que + " " + element.res_que + "\n"
    });
    this.dataOrden.txt_ord = this.observaciones_usuario + "\n" + observaciones;
    this.dataOrden.num_analisis = this.listAnalisis.length;
    this.dataOrden.num_muestras = this.listMuestras.length;


    let Analisis_final = this.saveAnalisis();
    let Muestras_final = this.saveMuestras()


    if (Analisis_final.length == 0) {
      this.toastservice.presentToast({ message: "No existen análisis para guardar orden", position: "top", duration: "1500", color: "warning" })
      return
    }

  this.json_data = {
    orden: this.dataOrden,
    //  pago: this.list_pagos,
    muestras: Muestras_final,
    analisis: Analisis_final
  }
  console.log('Json Data: <------------------>: ', this.json_data)
  console.log('paciente_completo----paciente completo revisa antes del dataJson: ',this.paciente_completo);
  this.facturarPaciente();
  this.loadingservice.present("Ingresando Orden");
   this.queryservice.insertOrden({

      jsonAnalisis: JSON.stringify(Analisis_final),
      jsonMuestras: JSON.stringify(Muestras_final),
      jsonOrden: JSON.stringify(this.dataOrden)

    }).then
      ((result: any) => {
        this.loadingservice.dismiss()
        console.log("ingresooo", result);
        if (result.data.insertOrdenCompleta.resultado == 'ok') {
          let data = JSON.parse(result.data.insertOrdenCompleta.data);

         this.codigo_orden_completa = data[0].nro_ord;
         console.log('codigo_orden_completa dentro del metodo save: ', this.codigo_orden_completa);
         let toastconf =
         {
           'message': "Orden ingresada con exito",
           'color': 'success',
           'position': 'top',
           'duration': 1500,
         };
         let detalle = "Ingreso de Orden web -Paciente=" + this.paciente.cod_pac + "; Nombre=" + this.paciente.nombre_completo + "; Medico=" + this.medico.cod_med + "; Plan=" + this.dataOrden.id_plan + "; Entrega=" + this.dataOrden.fec_ent + ";Valor=" + this.dataOrden.val_ord.toFixed(2) + "; Pagos=0; Saldo=" + this.dataOrden.val_ord.toFixed(2)
         this.funcionesComunes.enviaAuditoria('User.' + this.varGlobal.getVarUsuarioDes(), data[0].nro_ord, 'DEMO', detalle)
         let detalle_pet = "Ingreso de peticion "
         for (let index = 0; index < Analisis_final.length; index++) {
           const element = Analisis_final[index];
           detalle_pet = element.cod_ana + "; "

          }
          this.funcionesComunes.enviaAuditoria('User.' + this.varGlobal.getVarUsuarioDes(), data[0].nro_ord, 'PETICION', detalle_pet)

          this.variableUsuario = this.varGlobal.getVarUsuario();
          console.log('Variable Usuario------------------------------------: ', this.variableUsuario);


          let detalle_mst = "Ingreso de muestra "
          for (let index = 0; index < Muestras_final.length; index++) {
            const element = Muestras_final[index];
            detalle_mst = element.cod_mst + "; "

          }

          this.funcionesComunes.enviaAuditoria('User.' + this.varGlobal.getVarUsuarioDes(), data[0].nro_ord, 'MUESTRA', detalle_mst)

          let list_ord_print = [];
          list_ord_print.push({ tipo: "ord", data: data[0].nro_ord });
          let mst_temp = data[0].mst.split(' ');
          for (let index = 0; index < mst_temp.length; index++) {
            let element = mst_temp[index];
            if (element != '') {
              list_ord_print.push({ tipo: "mst", data: element, nro_ord: data[0].nro_ord });
            }
          }
          this.toastservice.presentToast(toastconf);
          this.PrintTicket(list_ord_print);
          ////-  INICIO DE CONTROL DE PAGOS/////////////////////////////////////////////////////////
          if(this.pago.length>0){
            console.log(this.pago);
          
            for (let index = 0; index < this.pago.length; index++) {
              const element = this.pago[index];
              element.cod_cli = this.json_data.orden.cod_pac;
              element.cod_ori = this.json_data.orden.cod_ori;
              element.cod_suc = this.json_data.orden.cod_suc;
              element.first_user = this.variableUsuario;
              element.last_user = this.variableUsuario;
              element.nro_ord = this.codigo_orden_completa;
       
       //- this.queryservice.insertPago(JSON.stringify(this.pago))
       this.queryservice.insertPago({ json_data: JSON.stringify(element) })
       .then((result: any) => {
         console.log('Resultado de haber ingresado el de la orden completa: ', result);
       })
       .catch(error => {
         console.log('Error al ingresar el pago de la orden: ', error);
       });


            }
          }

        }
        if (result.data.insertOrdenCompleta.resultado == 'error') {
          let toastconf =
          {
            'message': "Error al ingresar la orden..intentelo otra vez o consulte a soporte",
            'style': 'Warning',
            'position': 'top'
          };
          this.toastservice.presentToast(toastconf);
          //this.loading.dismiss();
        }

       this.presentModalFactura();

     }).catch(error => {
       console.log('Error en la promesa: ', error);
      // Manejo de errores generales aquí, si es necesario
    
});
  }

facturarPaciente() {
  const nativeEl = this.accordionGroup; 
  if (nativeEl.value === 'first') {
    nativeEl.value = undefined;
  } else {
    nativeEl.value = 'first';
  }
  if(this.paciente_completo){
    let codigoPaciente = this.paciente_completo.cod_pac;
    if(this.paciente_completo.cod_pac===undefined){    
    }else{
    if (this.paciente_completo_bolean) {      
      this.paciente_completo.cod_pac=codigoPaciente;
    } else {
           this.paciente_completo.cod_pac=this.paciente.cod_pac; 
    }
  }
  }else{
    this.paciente_completo=this.paciente.cod_pac;
    console.log('El this.paciente_completo se encuentra vacion: ',this.paciente_completo);
  }
}



Eliminar_Paciente_Tercero(){
  this.advertecia_Eliminar_Paciente_Tercero();  
  const nativeEl = this.accordionGroup; 
  if (nativeEl.value === 'first') {
    nativeEl.value = undefined;
  } else {
    nativeEl.value = 'first';
  }
}


async advertecia_Eliminar_Paciente_Tercero() {
  const alert = await this.alertController.create({
    header: 'Estás seguro',
    message: '¿De eliminar el paciente de facturacion a tercero?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Operación cancelada.');
        }
      },
      {
        text: 'Aceptar',
        handler: () => {
          if(this.paciente_completo){

            if(this.paciente_completo.cod_pac===undefined){    
            }else{
            if (this.paciente_completo_bolean_eliminar) {      
              this.paciente_completo=this.paciente;
              this.bloquearIonItem=false;
            } 
          }
          }else{
            this.paciente_completo=this.paciente;
            this.bloquearIonItem=false;
          }
          this.input_paciente_terceros=' ';
          console.log('El Eliminar_Paciente_Tercero verificar: ',this.paciente_completo);
          this.paciente_completo=undefined;

        }
      }
    ]
  });

  await alert.present();
}

  async presentModalFactura() {
    console.log('Entra ala modal de factura json_data verifica modal PresentFacura: ',this.json_data);
    const modal = await this.modalController.create({
      component: IngresoFacturaPage,
      componentProps: {
        'dcto_ord': this.dataOrden.dcto_ord,
        'dcto_val': this.dataOrden.dcto_val,
        'val_ord': this.dataOrden.val_ord,
        'pre_ord': this.dataOrden.pre_ord,
        'codigo_orden_completa': this.codigo_orden_completa,
        'variableUsuario': this.variableUsuario,
        json_data: this.json_data,
        'tabla_Pagos': this.tabla_Pagos,
        'pago':this.pago
      },
    });
    modal.onDidDismiss()
      .then((result: any) => {
      });
    await modal.present();
  }

  saveAnalisis() {
    //let fecha;
    let peticionCompleta = [];
    if (this.listAnalisis.length == 0) {
      return null
    } else {
      this.listAnalisis.forEach(element => {
        console.log('fecha', element.fec_ent);
        console.log('formato', this.helper.fechaFormato(element.fec_ent, this.hora_entrega));
        console.log('solo formato', this.helper.soloFecha(element.fec_ent));
        if (!element.flag_no_precio) {
          let peticion = {
            "cod_ana": element.cod_ana,
            "id_plan": this.dataOrden.id_plan,
            "cod_ref": this.dataOrden.cod_ref,
            "pre_pac": element.subtotal,
            "pre_seg": element.pospago,
            "dcto_val": element.dcto_val,
            "dcto_pet": (element.dcto_pet / 100),
            "cod_suc": this.dataOrden.cod_suc,
            "tip_ser": element.tip_ser,
            "sts_pet": 'PE',
            //   "fec_ent": this.helper.toUnicode(this.helper.fechaFormato(element.fec_ent)),
            "fec_ent": this.helper.fechaFormato(element.fec_ent, this.hora_entrega),
            "valor_pet": element.totalPac,
            "pet_adi": 0,
            "sts_adm": 'PE',
            "cant_pet": element.cant_pet
          }
          peticionCompleta.push(peticion);
        }
      }
      );

      return peticionCompleta
    }
  }


  saveMuestras() {

    let muestraCompleta = [];

    if (this.listMuestras.length == 0) {
      return null
    } else {
      this.listMuestras.forEach(element => {

        let muestras = {
          //'nro_ord':nro_ord,
          'cod_suc': this.dataOrden.cod_suc,
          'cod_mst': element.cod_mst,
          'lock_mst': element.lock_mst,
          'fec_upd': this.helper.fechaFormato(element.fec_upd, null),
          'fec_ent': this.helper.fechaFormato(element.fec_ini, null),//nom cambia
          'fec_ini': this.helper.fechaFormato(element.fec_ini, null),//no cambia


          'last_user': null,
          'first_user': null,
          'per_toma': null,
          'fec_toma': null
        }

        muestraCompleta.push(muestras);


        console.log('muestras', element);

      });

    return muestraCompleta
 }
}
async presentModalPerfilesAva() {
  const modal = await this.modalcontroller.create({
    cssClass: 'modal_analisisA',
    component: PerfilesavaPage,
    backdropDismiss: false
  });
  modal.onDidDismiss().then(async (result: any) => {
    let data = result.data
    if (this.orden_view) {
      return
    }
    if (data.analisis) {

      for (let index = 0; index < data.analisis.length; index++) {
        if (data.analisis[index] != '') {
          this.analisisbuscar = await data.analisis[index].cod_ana;
          console.log('this.analisisbuscar', this.analisisbuscar);

          this.searchAnalisis();
        }
      }

    }
  })
  return await modal.present();
}




  cargarPresupuesto(){
    this.listAnalisis=[];
      let data_presupuesto:any

      data_presupuesto=JSON.parse(atob(sessionStorage.getItem('presupuesto_temp')));
      console.log('data_presupuesto',data_presupuesto);

      
      
      for (let index = 0; index < data_presupuesto.analisisList.length; index++) {
        const element = data_presupuesto.analisisList[index];
        this.selectAnalisis(element)
      }

  }

  async presentAlertConfirm() {

    if(!sessionStorage.getItem('presupuesto_temp')){
      this.toastservice.presentToast({
        message:"No existe presupuesto para cargar",
        position:"bottom",
        duration:2000,
        color:"warning"
      })
    }

    let message="¿Desea ingresar el presupuesto guardado en el navegador?"
    if(this.listAnalisis.length>0 || this.dataOrden.dcto_ord!=0 ||this.dataOrden.val_ord!=0){
      message="Existen cambios en esta orden. <br><small>¿Desea ingresasr el presupuesto guardado en el navegador y reemplazar los datos?</small>"
    }

   
    const alert = await this.alertController.create({
      header: 'Agregar presupuesto.',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
           this.cargarPresupuesto()
          }
        }
      ]
    });
  
    await alert.present();
  }

  resetOrden(){
    this.inputMedico=''
    this.inputPaciente=''
    this.input_paciente_terceros=''
    this.paciente=null
    this.medico=null
    this.getSeguro();
    //this.pago=[];
    this.tabla_Pagos=[]
    this.listAnalisis=[];
    this.listMuestras=[];
    this.paciente_completo=[]

    this.dataOrden = {
      cod_ori: null,
      cod_pac: null,
      cod_med: null,
      ca1_ord: null,
      ca2_ord: null,
      pre_ord: 0.00,
      dcto_ord: 0.00,
      val_ord: 0.00,
      sts_ord: "PE",
      sts_adm: "S",
      txt_ord: null,
      cod_ref: null,
      dcto_val: 0.00,
      stat_ord: 0,
      id_plan: null,
      cod_suc: 1,//Revisar como sacar el codigo sucursal
      cod_emp: null,
      fec_ent: null,
      tip_ord: 0,
      cod_pac2: null,
      fac_ter: 0,
      cod_uni: null,
      pwd_ord: null,
      exp_ord: 0,
      pet_adi: 0,
      FEC_ENT2: null,
      nro_ext: null,
      mst_ext: 0,
      obs_ext: null,
      tip_ped: null,
      cod_ped: null,
      des_ped: null,
      iess_tseg: null,
      iess_dx: null,
      iess_tben: null,
      iess_tder: null,
      iess_nder: null,
      iess_tcon: null,
      iess_dx2: null,
      iess_id: null,
      nro_aux: 1,
      iess_dep: null,
      mail_ent: 0,
      mail_ent_det: null,
      dicta_ent: 0,
      dicta_ent_det: null,
      envio_ent: 0,
      envio_ent_det: null,
      cod_med2: null,
      copia_ent: null,
      pedido_ent: null,
      exclusive_ent: 0,
      //grupo_ord: null,
      fec_ord: null,
      num_analisis: 0,
      num_muestras: 0,
      user_type: null,
      user_code: null
  
  
    };


  }

  async presentModalConfiguracion() {
    const modal = await this.modalController.create({
    component: ConfiguracionPage,
    componentProps: { value: 123 }
    });
  
    await modal.present();
  
    const data = await modal.onDidDismiss();
    console.log(data)
    this.getOrigen()
  
  }

  async PrintTicket(data_print) {

    let list_to_print = [];
    this.loadingservice.present("Imprimiendo etiquetas")
    console.log("data", data_print);

    let printer_name=this.varGlobal.getEtiquetasPrinter().printer_name
    if (printer_name == '' || printer_name == null) {
      this.toastservice.presentToast({ message: "No existe una impresora asignada ", position: "top", duration: "2000", color: "warning" })
      this.loadingservice.dismiss()
      return
    }
    
    data_print.forEach(element => {
      console.log('iterator',element);
         
      this.queryservice.getLabetTicketbyMxo(element).then((r: any) => {
        console.log("r",r);
        
        if (r.data.getTicketLabel) {
          list_to_print.push(r.data.getTicketLabel.ticket_label)
        }

      })       
    });
   
    setTimeout(()=>{
      console.log('list_to_print', list_to_print);
      this.webrestservice.printTicket({ "printer_name": printer_name, "data": list_to_print, "tipo": 'ticket' }).subscribe((r_print: any) => {
        console.log('r_print',r_print);
        if(r_print.result=='error'){
          this.toastservice.presentToast({message:r_print.message,position:"top",duration:"2000",color:"warning"})
        //  this.presentAlertListPrinters(JSON.parse(r_print.data))
        }

        if(r_print.result=='ok'){

          for (let index = 0; index < data_print.length; index++) {
            const element = data_print[index];
            if(element.tipo=='mst')
            {
              this.UpdateMst(element.data,"imp_mst",1)
              this.funcionesComunes.enviaAuditoria(this.varGlobal.getVarUsuarioDes(),element.nro_ord,'PRINT',"Impresion de etiqueta")
  
            }
  
            if(element.tipo=='ord')
            {
              this.funcionesComunes.enviaAuditoria(this.varGlobal.getVarUsuarioDes(),element.data,'PRINT',"Impresion de etiqueta")
  
            }    
          }
        }


       },error=>{
        this.toastservice.presentToast({message:'Error con el servicio de impresión: '+error.message,position:"top",duration:"2000",color:"warning"})
       })
  
    },2000)
  }


  UpdateMst(idmxo, campo, value) {
    
    this.queryservice.UpdateMuestra({
      json_data: JSON.stringify({
        campo: campo,
        value: value,
        id_mxo: idmxo
      })
    }).then(r => {
      console.log('r muestras', r);
      /*
      if (campo == "imp_mst") {

        this.queryservice.UpdateMuestra({
          json_data: JSON.stringify({
            campo: "lock_mst",
            value: 1,
            id_mxo: idmxo
          })
        }).then(r => {
          console.log('r muestras', r);
        })


      }
      */
    })
  }

  facturaPrintDemo(){
    this.queryservice.getFacturaData({sri_id:"250"}).then((r:any)=>{
      console.log(r);
      let data =r.data.getDataFactura
      let json_data=JSON.parse(data.data)
      console.log(json_data);
      let nro_fac= this.helper.completarConCeros(json_data.general.sri_estab,3)+'-'+this.helper.completarConCeros(json_data.general.sri_ptoemi,3)+'-'+this.helper.completarConCeros(json_data.general.sri_sec,9)
      let data_enviar={
        "factura":{
          tel_fac: json_data.general.tel_fac,
        dir_fac: json_data.general.dir_fac,
        url_lab: json_data.general.url_lab,
        usuario_paciente: json_data.general.usuario_paciente,
        clave_paciente: json_data.general.clave_paciente,
        usuario:json_data.general.usuario,
        nro_ord:json_data.general.nro_ord,
        sri_razon: json_data.general.sri_razon,
        sri_ruc:json_data.general.sri_ruc,
        sri_estab: json_data.general.sri_estab,
        sri_ptoemi: json_data.general.sri_ptoemi,   
        sri_sec: json_data.general.sri_sec,
        sri_comprador: json_data.general.sri_comprador,
        sri_doccompra: json_data.general.sri_doccompra,
        nro_fac:nro_fac,
        Analisis:json_data.Analisis
      }
        }
      console.log(data_enviar);



 this.serviciosPdf.getPDFFacturaM(data_enviar).subscribe((resp:any) => {


      //CIERRO EL LOADING
      console.log(resp);
     let  respuesta = resp;
      if (respuesta.estado == 0) {
  
        this.webrestservice.printPdfDirect({base_64:respuesta.data,printer_name:'POS-80'}).subscribe(r=>{
          console.log('r pirnt',r);
          
        })
  
      } else {
        console.log(respuesta.description)
      }
  
    }, error => {
      console.error(error);
    });
  
  })


  }

  

}
