import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController, IonInfiniteScroll, LoadingController, ModalController, NavController, Platform, PopoverController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { OrdenCompletaTurnosPage } from 'src/app/modals/orden-completa-turnos/orden-completa-turnos.page';
import { IngresoNuevoPacientePage } from 'src/app/modals/orden/ingreso-nuevo-paciente/ingreso-nuevo-paciente.page';
import { BaseService } from 'src/app/servicios/base/base.service';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { WebRestService } from 'src/app/servicios/intranet/web-rest.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { FuncionesComunes } from 'src/app/utils/funciones-comunes';
import { FuncionesComunesIntra } from 'src/app/utils/funciones-comunes-intra';
import { Utilidades } from 'src/app/utils/utilidades';

@Component({
  selector: 'app-responsive-listado-ingreso-de-usuarios',
  templateUrl: './responsive-listado-ingreso-de-usuarios.page.html',
  styleUrls: ['./responsive-listado-ingreso-de-usuarios.page.scss'],
})
export class ResponsiveListadoIngresoDeUsuariosPage implements OnInit {

  @ViewChild('filterOrden') filterInput: ElementRef;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  public formato_fecha = 'yyyy-MM-dd';
  public usuario;
  public var_usr;
  public lista_ordenes;
  public mobile = false;
  public digitosBusqueda = "";
  public lista_filtrar;
  public lista_temporal;
  public criterio_ordenamiento = "D";
  public tipo_ordenamiento = "fecha";
  public paginacion = 10;
  public cargando = true;
  public filtro = false;
  public tooltip_btn = "";
  public tipo_server = 0;
  public des_usr: any = ""
  public tipo_user = "";
  public ativa_progress = false;

  public formato_pdf_ref = "";
  public flag_view_ord=false;

  public nombre_paciente="";//////////////No Borrar
  public lista_resultados_pacientes:any;//////////////No Borrar
  public apellido_paciente="";//////////////No Borrar
  public codigo_paciente="";//////////////No Borrar
  public cedula_paciente="";//////////////No Borrar
  filaSeleccionada: number = -1;//////////////No Borrar
  seleccionadoIndex: number | null = null;//////////////No Borrar
  focusedIndex = -1;
  nombre_paciente2 = new FormControl('');//////////////No Borrar
  resultadosFiltrados: any[] = [];//////////////No Borrar
  public loaded = false;//////////////No Borrar
    input_id: string = '';
  cod_pac_temp:any;
  tipo:any;
  input_nombre: string = '';
  input_apellido: string = '';
  input_genero: string = '';
  input_telefono: string = '';
  input_cell: string = '';
  input_mail: string = '';
  input_dir: string = '';
  input_fec_nac: string='';
  input_instr: string = '';
  edad: number;
  input_pob: string='';
  input_est_civil: string='';
  input_titulo: string='';
  input_pais_doc: null;
  input_tipo_documento: null;
  input_direccion: string='';
  input_cp: string='';
  input_email: string='';
  input_celular: string='';
  input_pais_origen: string='';
  input_ciudad: string='';
  input_referencia: string='';
  input_estadoCivil: string='';
  input_instruccion: string='';
  input_ocupacion: string='';
  input_tipo_sangre: string = '';
  input_info_crediticia: string = '';
  input_etnia: string = '';
  input_patol_pac: string = '';
  input_plan_fijo: string = '';
  input_doc_fijo: string = '';
  input_edad: string='';
  edad_number:number;
  bandera_editar:boolean;
  input_cod_pac;
  bandera_de_botones:boolean;
  codigo_origen:any;
  last_user:string;
  private values: string[] = ['first', 'second', 'third'];
  array_referencia:any=[];
  flag_show_listado:boolean=false;
  segundoInputWidth = '100%'; //Para Borrar aqui
  primerInputWidth = '100%';
  segundoInputMarginRight = '0';
  miTexto: string = '';
  bandera_icono_search:boolean=false;
  minDate: string = new Date().toISOString().split('T')[0];
  segmentoSeleccionado='custom';
  bandera_ios=false;
  bandera_genero_table=false;
  contador_clic_item_turnos:number = -1;


  paciente_completo:any={
    cod_pac: "",
    nom_pac: "",
    ape_pac: null,
    tit_pac: null,
    sex_pac: null,
    fec_nac:null,
    pais_id:null,
    id_pac:null,
    TIPO_ID:null,
    cod_pob:null,
    dir_pac:null,
    cp_pac:null,
    mail_pac:null,
    telf_pac:null,
    cel_pac:null,
    pais_nace:null,
    ciudad_nace:null,
    cod_ref:null,
    estado_civil:null,
    instruccion:null,
    ocu_pac:null,
    san_pac:null,
    sts_adm:null,
    etnia:null,
    pat_pac:null,
    cod_ori:null,
    last_user:null,
    pic_pac:null,
    profesion:null,
    tip_san:null,
   }
   esCedulaValidaennumero:number;
   esProvincia:string='';
   esCiudad='';
   array_poblacion:any=[];
////////////////////no borrar
  fecha_desde
  fecha_hasta
  dato_find = "";

  inicio_paginacion = 0
  order_by = ""
  infoText = "";
  css_with="demo_with";
  demo_with_search_ce="demo_with_search_ce";
  flag_warning:boolean=false;



  constructor(
    public modalCtrl: ModalController,
    private varGlobal: VariablesGlobalesService,
    private servicios: BaseService,
    private serviciosIntra: WebRestService,
    public popoverController: PopoverController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public toastController: ToastController,
    public funcionesComunes: FuncionesComunes,
    public utilidades: Utilidades,
    public funcionesComunesIntra: FuncionesComunesIntra,
    private configApp: AppConfigService,
    private router: Router,
    private _translate: TranslateService,
    private queryservice: QueryService,
    private toastservice:ToastService,
    private loadingservice:LoadingService,
    private sanitizer: DomSanitizer,
    private platform:Platform,
    private navCtrl:NavController
  ) {
    this.usuario = {};
    this.var_usr = {};
    this.lista_ordenes = [];
    this.lista_filtrar = [];
    this.lista_temporal = [];
    this.bandera_de_botones=false;

    
    //PONGO EL DEFAULT DEL FORMATO DE FECHA
    this.formato_fecha = this.configApp.formatoFecha;
    this.ativa_progress = this.configApp.progressPDF;//si esta activado buscara el prgress para dejarle imprimir
    if (this.configApp.formatoRefPDF) {
      this.formato_pdf_ref = this.configApp.formatoRefPDF//si tiene un valor voy a coger este valor y activar el boton
    }
    this.input_info_crediticia = '[Ninguna]';
    this.segmentoSeleccionado='nombre_completo_segment';
  }

   
  buscarPaciente(){
let comparacion='';
    let porcentaje='%';
    let nombre_paciente_enviar_base;
    this.nombre_paciente = this.nombre_paciente.toLowerCase();
    nombre_paciente_enviar_base = this.nombre_paciente.replace(/ /g, porcentaje);
    console.log('cedula_paciente REVISAR: ',this.cedula_paciente);

    if(this.cedula_paciente=='' && nombre_paciente_enviar_base==''){
      this.resultadosFiltrados.length=0;
      console.log('this.resultadosFiltrados.length: ',this.resultadosFiltrados.length);
      this.toastservice.presentToast({message:"Ingrese al menos un campo de busqueda",position:"top",color:"warning", duration:1500})
      return
    }
    this.lista_resultados_pacientes=[];
    this.queryservice.SearchPacienteDynamic(
    {cedula:this.cedula_paciente,codigo:this.codigo_paciente,nombre:this.nombre_paciente,apellido:this.apellido_paciente,nombre_completo:nombre_paciente_enviar_base}
    ).then((r:any)=>{
      console.log("Por favor revisa el resutadi esperado",r);
      let data=r.data.searchPacienteDynamic
         console.log("Dataaaaaaaaa: ",data);
      if(data.length>0){
        this.lista_resultados_pacientes=data;
        this.loaded=false;
           this.resultadosFiltrados = this.lista_resultados_pacientes;
            this.loaded=true;
        console.log('this.resultadosFiltrados: ',this.resultadosFiltrados);
        console.log('this.resultadosFiltrados-longitud : ',this.resultadosFiltrados.length);
           this.flag_show_listado=false;

           

           this.filtrarResultados()
           
           // La variable 'comparacion' ahora contiene los caracteres iguales entre 'this.nombre_paciente' y cada 'nombre_completo'.
           
           

      }else{
        this.resultadosFiltrados.length=0;
        console.log('this.resultadosFiltrados-longitud en cero : ',this.resultadosFiltrados.length);

        this.toastservice.presentToast({message:"No se encuentran resultados",position:"middle",color:"warning", duration:1500});
      }
    });

  }

  filtrarResultados() {
      this.resultadosFiltrados = this.lista_resultados_pacientes.map(paciente => {
        const nombreFormateado = paciente.nombre_completo.toLowerCase().includes(this.nombre_paciente.toLowerCase())
          ? this.highlightMatchingText(paciente.nombre_completo, this.nombre_paciente)
          : paciente.nombre_completo;
    
        return {
          ...paciente,
          nombre_completo: this.sanitizer.bypassSecurityTrustHtml(nombreFormateado),
        };
      });
    }
    
    highlightMatchingText(fullText, searchText) {
      const index = fullText.toLowerCase().indexOf(searchText.toLowerCase());
      if (index !== -1) {
        const highlightedText = `${fullText.substring(0, index)}<span style="background: yellow;">${fullText.substring(index, index + searchText.length)}</span>${fullText.substring(index + searchText.length)}`;
        return highlightedText;
      }
      return fullText;
    }

  
/////////////////////Seleccion de Fila  ////////////////////////
seleccionarItem(index: number) {
  
console.log('contador_clic_item_turnos: ',this.contador_clic_item_turnos);
console.log('index: ',index);

  if (this.contador_clic_item_turnos === index) {
    this.contador_clic_item_turnos = -2;
    const pacienteSeleccionado_orden = this.lista_resultados_pacientes[index];
    console.log('pacienteSeleccionado_orden: ',pacienteSeleccionado_orden);
    this.Alert_seleccion_item_muestras(pacienteSeleccionado_orden);
    return;
  }

  this.contador_clic_item_turnos = index;
  this.seleccionadoIndex = index;
  const pacienteSeleccionado = this.lista_resultados_pacientes[index];
  this.input_nombre=pacienteSeleccionado.nom_pac;
  this.input_apellido=pacienteSeleccionado.ape_pac;
  this.input_id=pacienteSeleccionado.id_pac;
  this.input_edad=pacienteSeleccionado.edad;
  this.input_fec_nac=pacienteSeleccionado.fec_nac;
  this.input_genero=pacienteSeleccionado.sex_pac;
  this.input_mail=pacienteSeleccionado.mail_pac;
  this.input_telefono=pacienteSeleccionado.telf_pac;
  this.input_celular=pacienteSeleccionado.cel_pac;
  this.input_cp=pacienteSeleccionado.cp_pac;
 this.input_cod_pac=pacienteSeleccionado.cod_pac;

  if(pacienteSeleccionado.id_pac===''){
  }else{
    this.bandera_de_botones=true;
  }


}

async presentModal_orden_turnos(pacienteSeleccionado_orden) { 
  console.log('pacienteSeleccionado_orden: ',pacienteSeleccionado_orden);
    const modal = await this.modalCtrl.create({
      component: OrdenCompletaTurnosPage,
      componentProps: {
        pacienteSeleccionado_orden: pacienteSeleccionado_orden,        
      }        
    });
    await modal.present();
}

async Alert_seleccion_item_muestras(pacienteSeleccionado_orden) {
  console.log('Paciente seleccionado: ',pacienteSeleccionado_orden);
  const alert = await this.alertController.create({
    header: '! Estas seguro de seleccionar !',
    message: `Al paciente `+pacienteSeleccionado_orden.nombre_completo, 
    buttons: [
      {
        text: 'Sí',
        handler: () => {  
          // this.presentModal_orden_turnos(pacienteSeleccionado_orden); 
          this.varGlobal.setPaciente_orden_entrada_turnos(pacienteSeleccionado_orden.cod_pac)   
          this.router.navigate(['/orden-completa-turnos']);                   


       }
      },
      {
        text: 'No',
        role: 'Cancelar',
        cssClass: 'secondary',
        handler: () => {
          console.log('No clicked');           
        }
      },      
    ]
  });  
  await alert.present();
}




Check_metodo_verificacion(input_cod_pac?: string){
  console.log('Check_metodo_verificacion: ',input_cod_pac);
  if(input_cod_pac===undefined || input_cod_pac===null || input_cod_pac===''){
console.log('Undefined o null o vacio');
this.CheckPaciente();
  }else{
    console.log('Aqui se debe actualizar');
    this.actualizarPaciente(input_cod_pac);
  }
}




//Actualizar Paciente////
actualizarPaciente(codigo_paciente:String)
{
  let fechaupd=new Date();
  this.loadingservice.present('Actualizando Perfil');
  let listadostring: string = "";

   let data = {
    nom_pac:this.input_nombre,
    ape_pac:this.input_apellido,
    tit_pac:'',
    sex_pac:this.input_genero,
    fec_nac:this.input_fec_nac,
    pais_id:this.input_pob,
    id_pac:this.input_id,
    // TIPO_ID:null,
    cod_pob:this.input_pob,
    dir_pac:this.input_direccion,
    cp_pac:this.input_cp,
    mail_pac:this.input_email,
    telf_pac:this.input_telefono,
    cel_pac:this.input_celular,
    pais_nace:this.input_pais_origen,
    ciudad_nace:this.input_ciudad,
    // cod_ref:this.input_referencia,
    cod_ref:null,
    estado_civil:this.input_estadoCivil,
    instruccion:this.input_instruccion,
    ocu_pac:this.input_ocupacion,
    tip_san:this.input_tipo_sangre,
    sts_adm:this.input_info_crediticia,
    etnia:this.input_etnia,
    pat_pac:this.input_patol_pac,
    cod_pac:this.input_cod_pac,
    cod_ori:this.varGlobal.getOrigenOrden().cod_ori,
    last_user:this.varGlobal.getVarUsuario(),
    pic_pac:null,
    profesion:null,
    san_pac:null,
  }
console.log('Datosssssss: en update verifica por favor',data);
this.queryservice.actualizarPaciente(JSON.stringify(data)).then((result: any) => {
    let data = result.data
    console.log('result mutation', result);
    console.log('dataDelModificar: ',data);
    this.toastservice.presentToast({ message: data.UpdatePaciente.mensaje, position: 'top', color: 'success' })
    this.loadingservice.dismiss();

    // this.dismissData();
  }, error => {
    console.log(error);
    this.toastservice.presentToast({ message:'Intentelo mas tarde '+ error.mensaje, position: 'top', color: 'warning' })
    this.loadingservice.dismiss()
  })

}

onDateKeyUp(event: any, dateValue: string)  {
  console.log('EventOnDatekeyUp: ',event);
  console.log('dateValuessss: ',dateValue);
  if (event.keyCode === 13) {
    this.getCurrentDate(dateValue);
  }
}



getCurrentDate(getFechadeNacimiento) {

this.queryservice.getFechadeNacimiento(getFechadeNacimiento).then((r:any)=>{
  console.log('Resultado por favor es de de get: ',r);
   this.input_edad=r.data.getEdadPac.data;
   console.log('Resultado por favor es de de this.edad: ',this.input_edad);
});
}

Limpiar_Datos(){
console.log('this.input_nombre  limpiar datos: ',this.input_nombre);
this.input_id= '';
this.input_nombre = '';
this.input_apellido = '';
this.input_genero = '';
this.input_telefono = '';
this.input_cell = '';
this.input_mail = '';
this.input_dir = '';
this.input_fec_nac = '';
this.input_instr = '';
this.input_pob = '';
this.input_est_civil = '';
this.input_titulo = '';
this.input_pais_doc = null;
this.input_tipo_documento = null;
this.input_direccion = '';
this.input_cp = '';
this.input_email = '';
this.input_celular = '';
this.input_pais_origen = '';
this.input_ciudad = '';
this.input_referencia = '';
this.input_estadoCivil = '';
this.input_instruccion = '';
this.input_ocupacion = '';
this.input_tipo_sangre = '';
this.input_info_crediticia = '';
this.input_etnia = '';
this.input_patol_pac = '';
this.input_plan_fijo = '';
this.input_doc_fijo = '';
this.input_edad = '';
this.input_cod_pac = '';
this.bandera_de_botones = false;
this.nombre_paciente='';
this.apellido_paciente='';
this.cedula_paciente='';
this.resultadosFiltrados=[];
}



check_Formulario_Vacio(input_cod_pac?: string){

  console.log('this.this.flag_warning warning: ',this.flag_warning);
  // 
  if(this.flag_warning){
    this.presentAlertLimpiarDatos(input_cod_pac);
  }else{
    this.Limpiar_Datos();
  }
}



check_Formulario_Vacio_Buscador(){

  console.log('this.this.flag_warning warning: ',this.flag_warning);
   this.Limpiar_Datos();  
}

async presentAlertLimpiarDatos(input_cod_pac) {
  this.flag_show_listado=false;

  const alert = await this.alertController.create({
    header: '! Deseas Guardar !',
    message: `Los cambios realizados`,
    buttons: [
      {
        text: 'Sí',
        handler: () => {
          if(input_cod_pac==='' || input_cod_pac===null || input_cod_pac===undefined){
              console.log('No tiene codigo input_cod_pac: ',input_cod_pac);
              this.CheckPaciente();
              this.Limpiar_Datos();
          }else{
            console.log('si tiene codigo de input_cod_pac: ',input_cod_pac);
            this.actualizarPaciente(input_cod_pac);
            this.Limpiar_Datos();
          }
       }
      },
      {
        text: 'No',
        role: 'Cancelar',
        cssClass: 'secondary',
        handler: () => {
          console.log('No clicked');
           this.Limpiar_Datos();

        }
      },
      
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Cancelar clicked');
          // Puedes agregar lógica adicional aquí si es necesario
        }
      }
    ]
  });  
  await alert.present();
}



CheckPaciente() {
  this.paciente_completo.nom_pac = this.input_nombre ? this.input_nombre : null;
  this.paciente_completo.ape_pac = this.input_apellido ? this.input_apellido : null;
  this.paciente_completo.tit_pac = this.input_titulo ? this.input_titulo : null;
  this.paciente_completo.sex_pac = this.input_genero ? this.input_genero : null;
  this.paciente_completo.fec_nac = this.input_fec_nac ? this.input_fec_nac : null;
  this.paciente_completo.pais_id = this.input_pais_doc ? this.input_pais_doc : null;
  this.paciente_completo.id_pac = this.input_id ? this.input_id : null;
  this.paciente_completo.cod_pob = this.input_pob ? this.input_pob : null;
  this.paciente_completo.dir_pac = this.input_direccion ? this.input_direccion : null;
  this.paciente_completo.cp_pac = this.input_cp ? this.input_cp : null;
  this.paciente_completo.mail_pac = this.input_mail ? this.input_mail : null;
  this.paciente_completo.telf_pac = this.input_telefono ? this.input_telefono : null;
  this.paciente_completo.cel_pac = this.input_celular ? this.input_celular : null;
  this.paciente_completo.pais_nace = this.input_pais_origen ? this.input_pais_origen : null;
  this.paciente_completo.ciudad_nace = this.input_ciudad ? this.input_ciudad : null;
  this.paciente_completo.cod_ref = this.input_referencia ? this.input_referencia : null;
  this.paciente_completo.estado_civil = this.input_estadoCivil ? this.input_estadoCivil : null;
  this.paciente_completo.instruccion = this.input_instruccion ? this.input_instruccion : null;
  this.paciente_completo.ocu_pac = this.input_ocupacion ? this.input_ocupacion : null;
  this.paciente_completo.tip_san = this.input_tipo_sangre ? this.input_tipo_sangre : null;
  this.paciente_completo.sts_adm = this.input_info_crediticia ? this.input_info_crediticia : null;
  this.paciente_completo.etnia = this.input_etnia ? this.input_etnia : null;
  this.paciente_completo.pat_pac = this.input_patol_pac ? this.input_patol_pac : null;

  this.codigo_origen=this.varGlobal.getOrigenOrden().cod_ori;
  if(this.codigo_origen === '' || this.codigo_origen === null){
    this.paciente_completo.cod_ori=null;
  }else{
    this.paciente_completo.cod_ori=this.codigo_origen;
  }
this.last_user=this.varGlobal.getVarUsuario();
  if(this.last_user=== '' || this.last_user === null){
    this.paciente_completo.last_user=null;
  }else{
    this.paciente_completo.last_user=this.last_user;
  }
if(this.input_id!==''){
this.queryservice.getPacientesbyId(this.input_id).then((r: any) => {

          if (r.data.getPaciente.id_pac != null) {
         // this.dismissData(this.paciente, "check")

        this.toastservice.presentToast2({ message: "Ya existe un  registrado con esa cédula.", position: "middle", color: "danger", duration: 2000});

          if(this.paciente_completo.fec_nac===undefined){
        this.toastservice.presentToast({ message: "Campo de fecha vacio.", position: "middle", color: "warning", duration: 2000 });
      }
        //  this.loadingservice.dismiss();
          // return
        } else {
        if(this.paciente_completo.nom_pac === '' && this.paciente_completo.ape_pac === ''){
          this.toastservice.presentToast2({ message: "Ingresa Nombre/Apellido.", position: "middle", color: "warning", duration: 2000 });
          this.loadingservice.dismiss();
        } else{
          if(this.paciente_completo.sex_pac===''){
            this.toastservice.presentToast2({ message: "Elige el genero del paciente.", position: "middle", color: "warning", duration: 2000 });
            this.loadingservice.dismiss();
          }else{
            if(this.paciente_completo.mail_pac === ''){
              this.toastservice.presentToast2({ message: "Por favor ingresa el campo correo.", position: "middle", color: "warning", duration: 2000 });
            }else{
            if(this.getVerificarEmail(this.paciente_completo.mail_pac)){
              if(this.paciente_completo.fec_nac===undefined){
                this.toastservice.presentToast2({ message: "Por favor ingrese la fecha de nacimiento.", position: "middle", color: "warning", duration: 2000 });
                this.loadingservice.dismiss();
              } else{
                console.log('Paciente en MAYUSCULAS POR FAVOR: ',this.paciente_completo);
                 this.insertarPacientecomplete(this.paciente_completo); ////AQUI DEBES DESCOMENTAR SSOLO ES PRUEBA;
                // this.toastservice.presentToast({ message: "Usuario Guardado Correctamente.", position: "middle", color: "success", duration: 2000 });
                // this.loadingservice.dismiss();
                return
                }
            }else{
              this.toastservice.presentToast2({ message: "Correo Electronico no Valido.", position: "middle", color: "danger", duration: 2000 });
              this.loadingservice.dismiss();
            }

            }

           }
          }
        }
      })
    return
}else{
      // this.toastservice.presentToast({ message: "Deseas guardar el paciente sin cedula.", position: "middle", color: "tertiary", duration: 2000 });
      //         this.loadingservice.dismiss();
      if (this.paciente_completo.nom_pac === '' && this.paciente_completo.ape_pac === '') {
        this.toastservice.presentToast2({ message: "Debes ingresar Nombre/Apellido.", position: "middle", color: "danger", duration: 2000 });
        this.loadingservice.dismiss();
        return;
      } else {
        if (this.paciente_completo.nom_pac === null || this.paciente_completo.ape_pac === null) {
          console.log('revisa el paciente en null: ', this.paciente_completo.nom_pac);
          this.toastservice.presentToast2({ message: "Debes ingresar Nombre/Apellido.", position: "middle", color: "danger", duration: 2000 });
          this.loadingservice.dismiss();
        } else {
          this.presentAlert();
          console.log('revisa el paciente_completo.nom_pac: ', this.paciente_completo.nom_pac);
        }
      }
    }



  }

insertarPacientecomplete(data) {
  this.queryservice.insertPacienteComplete(JSON.stringify(data)).then((result: any) => {
  let data = result.data.insertPacienteComplete;
  if (data.resultado == 'ok') {
    this.toastservice.presentToast({ message: data.mensaje, color: "success", position: "top" });
    let cod_pac_regreso=data.data;
    let data_convertido = JSON.parse(cod_pac_regreso);
    this.input_cod_pac=data_convertido[0].cod_pac;
    if(this.input_cod_pac === undefined && this.input_cod_pac === null && this.input_cod_pac === ''){
      console.log('Error en crear el insetar paciente');
    }else{
      this.bandera_de_botones=true;
    }

  }
  this.loadingservice.dismiss();

}, error => {
  this.toastservice.presentToast({ message: error, color: "warning", position: "top" });
  this.loadingservice.dismiss()
})
}
async presentAlert() {
  const alert = await this.alertController.create({
    header: '! Deseas guardar !',
    // subHeader: 'Paciente',
    message: `Deseas guardar al paciente ${this.paciente_completo.nom_pac} sin cédula `,
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
          console.log('Sí clicked::: ',this.paciente_completo);
          this.insertarPacientecomplete(this.paciente_completo); ////AQUI DEBES DESCOMENTAR SSOLO ES PRUEBA;
          this.toastservice.presentToast({ message: "Usuario Guardado Correctamente.", position: "middle", color: "success", duration: 2000 });
          this.loadingservice.dismiss();
        }
      }
    ]
  });

  await alert.present();
}

onDateKeyCedula(event: KeyboardEvent) {
  if (event.keyCode === 13) {
    this.getValidarcedula();
    }
}
getValidarcedula(){
  if(this.input_id===''){
      this.esCedulaValidaennumero=-1;
  }else{
    const cedbandera=this.input_id;
    const regexNumero = /^[0-9]/;


    if(regexNumero.test(cedbandera)){

      if(this.input_id.length>10){
    if(this.validarRucEcuatoriano(this.input_id)){
      this.esCedulaValidaennumero=4;
       }else{
      this.esCedulaValidaennumero=5;
        }
      }else{
        if(this.getCedula(this.input_id)){
          this.esCedulaValidaennumero=0;
        }else{
          this.esCedulaValidaennumero=1;
        }
      }
    }else{
      if(this.verificarPasaporteEcuatoriano(this.input_id)){
        this.esCedulaValidaennumero=2;
      }else{
        this.esCedulaValidaennumero=3;
          }
        }
       }
}

verificarPasaporteEcuatoriano(numeroPasaporte: string): boolean {

  if (numeroPasaporte.length !== 8) {
    return false;
  }
  for (let i = 0; i < 3; i++) {
    const c = numeroPasaporte.charAt(i);
    if (!/[a-zA-Z]/.test(c)) {
      return false;
    }
  }
  for (let i = 3; i < 8; i++) {
    const c = numeroPasaporte.charAt(i);
    if (!/\d/.test(c)) {
      return false;
    }
  }
  return true;
}

validarRucEcuatoriano(ruc: string): boolean {
  ruc = ruc.replace(/\s|-/g, '');
    if (ruc.length !== 10 && ruc.length !== 13) {
    return false;
  }
    if (!/^\d+$/.test(ruc)) {
    return false;
  }

  const provincia = Number(ruc.substr(0, 2));

  if (provincia < 1 || provincia > 24) {
    return false;
  }

  const tercerDigito = Number(ruc.charAt(2));

  if (tercerDigito < 0 || (tercerDigito !== 6 && tercerDigito !== 9)) {
    return false;
  }


  const coeficientes = [3, 2, 7, 6, 5, 4, 3, 2];
  const sumatoria = coeficientes.reduce((acc, coeficiente, index) => {
    const digito = Number(ruc.charAt(index));
    return acc + (coeficiente * digito);
  }, 0);

  let digitoVerificador = 11 - (sumatoria % 11);

  if (digitoVerificador === 11) {
    digitoVerificador = 0;
  }

  if (digitoVerificador !== Number(ruc.charAt(9))) {
    return false;
  }

  return true;
}


getCedula(cedula:String):boolean{
  if (cedula.length !== 10) {
    return false;
  }
  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) {
    return false;
  }
   const digitos = cedula.split('').map(Number);
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let mult = (i % 2 === 0) ? 2 : 1;
    let resultado = digitos[i] * mult;
    if (resultado > 9) {
      resultado -= 9;
    }
    suma += resultado;
  }
  const decenaSuperior = Math.ceil(suma / 10) * 10;
  const ultimoDigito = decenaSuperior - suma;
  return digitos[9] === ultimoDigito;
}

getVerificarEmail(correo: string): boolean {
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const result: boolean = expression.test(correo);
  return result;
}

ionChangeVariable(){
  this.flag_show_listado=true;
}
calcularAnchoInput() {
  // Puedes ajustar la lógica según tus necesidades
  const primerInput = document.querySelector('.primer-input') as HTMLElement;
  console.log('primerInput.offsetWidth{primerInput.offsetWidth: ',primerInput.offsetWidth);


  this.primerInputWidth = `calc(100% + ${primerInput.offsetWidth}px)`;
  this.segundoInputMarginRight = `-${primerInput.offsetWidth}px`;

  console.log('primerInputWidth 2 offsetWidth: ',primerInput.offsetWidth);

  // this.primerInputWidth = `calc(100% + ${primerInput.offsetWidth}px)`;
  // this.segundoInputMarginRight = `-${primerInput.offsetWidth}px`;
}

Test(dato){
if(dato==='cedula'){

  return;
}
if(dato==='nombre'){

  return;
}

}

Flag_warning_method(data){
  if (
    data === 'input_id' ||
    data === 'input_nombre' ||
    data === 'input_apellido' ||
    data === 'input_fec_nac' ||
    data === 'input_edad' ||
    data === 'input_genero' ||
    data === 'mail' ||
    data === 'input_celular' ||
    data === 'input_pob' ||
    data === 'input_direccion' ||
    data === 'input_telefono' ||
    data === 'input_cp' ||
    data === 'input_pais_origen' ||
    data === 'input_ciudad' ||
    data === 'input_referencia' ||
    data === 'input_estadoCivil' ||
    data === 'input_instruccion' ||
    data === 'input_ocupacion' ||
    data === 'input_etnia' ||
    data === 'input_info_crediticia' ||
    data === 'input_tipo_sangre' ||
    data === 'input_patol_pac'
  ) {
    this.flag_warning = true;
  }
  
}




//////////////////////De aqui para debes eliminar por favor///////////////////////////////////////
//////////////////////////////////////////De aqui para debes eliminar por favor///////////////////////////////////////
//////////////////////////////////////////De aqui para debes eliminar por favor///////////////////////////////////////
//////////////////////////////////////////De aqui para debes eliminar por favor///////////////////////////////////////
//////////////////////////////////////////De aqui para debes eliminar por favor///////////////////////////////////////
//////////////////////////////////////////De aqui para debes eliminar por favor///////////////////////////////////////
//////////////////////////////////////////De aqui para debes eliminar por favor///////////////////////////////////////
//////////////////////////////////////////De aqui para debes eliminar por favor///////////////////////////////////////
//////////////////////////////////////////De aqui para debes eliminar por favor///////////////////////////////////////


  ngOnInit() {
    if(this.platform.is('ios')){
      this.bandera_ios=true;
      console.log('Estas en ios: ',this.bandera_ios);
    }else{
      this.bandera_ios=false;
      console.log('No estas en IosL ',this.bandera_ios);
    }

    console.log(window.innerWidth);
    if (window.screen.width < 760 || window.innerWidth < 760) { // 768px portrait
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    window.onresize = () => {
      if (window.screen.width < 760 || window.innerWidth < 760) { // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    };



    this.queryservice.getListPoblacion().then((r:any)=>
    {
      let data=r.data.ListPoblacion;
        for(let i=0;i<data.length;i++){
            if(data[i].cod_niv===1){

              this.esProvincia='Provincia';
            }
            if(data[i].cod_niv===2){
              this.esCiudad='Ciudad';
            }
        }

       this.array_poblacion=data;

    });

     this.queryservice.getListReferencia().then((r:any)=>
    {
      let datos=r.data.ListReferencia;
      this.array_referencia=datos;
    });
  console.log('this.mobile: ',this.mobile);

  console.log(window.innerWidth);
    if (window.screen.width < 770 && window.screen.width > 760  || window.innerWidth < 770 &&  window.innerWidth > 760) { // 768px portrait
      this.bandera_genero_table = true;
    } else {
      this.bandera_genero_table = false;
    }
    window.onresize = () => {
      if (window.screen.width < 770 && window.screen.width > 760  || window.innerWidth < 770 &&  window.innerWidth > 760) { // 768px portrait
        this.bandera_genero_table = true;
      } else {
        this.bandera_genero_table = false;
      }
    };

console.log('this.bandera_genero_table: ',this.bandera_genero_table);




  


  }
  abrirFiltro() {
    console.log("ABRIR FILTRO");
    this.filtro = this.filtro ? false : true;
  }

  cancelFiltroBusqueda(event) {
    // console.log(event);
    console.log("cancelo");
    this.digitosBusqueda = "";
    this.filtro = false;


  }

  Test1(datos){
    if(datos==='nombre'){
      this.size_nombre=8;
      this.size_cedula=2;
      this.size_nombre_tablet=9;
      this.size_cedula_tablet=3;
      this.bandera_icono_search=false;
      this.cedula_paciente='';  

    }
    if(datos==='cedula'){
      this.size_nombre=3;
      this.size_cedula=7;
      this.size_nombre_tablet=3;
      this.size_cedula_tablet=9;
    this.bandera_icono_search=true;
    this.nombre_paciente='';
    }
    if(datos==='reset'){
      this.size_nombre=6;
      this.size_cedula=4;
      this.size_nombre_tablet=6;
      this.size_cedula_tablet=6;
    }
  }




  accordionGroupChange = (ev: any) => {
    const collapsedItems = this.values.filter((value) => value !== ev.detail.value);
    const selectedValue = ev.detail.value;

    console.log(
      `Expanded: ${selectedValue === undefined ? 'None' : ev.detail.value} | Collapsed: ${collapsedItems.join(', ')}`
    );
  };


  async presentModalModificarPaciente(paciente?) {
    console.log('Item: ',paciente);
    let cod_pac_temp=0;    
    if(paciente===undefined){
      const modal = await this.modalCtrl.create({
        component: IngresoNuevoPacientePage,        
      });
      await modal.present();
      modal.onDidDismiss().then(r=>{
        
        if(r.data){
        //  this.paciente=r.data.orden
        console.log('r.datar.datar.datar.datar.datar.data: ',r.data);
        }
      })
    }else{
      const modal = await this.modalCtrl.create({
        component: IngresoNuevoPacientePage,
        componentProps: {
          cod_pac_temp:paciente.cod_pac
        },
      });
      await modal.present();
      modal.onDidDismiss().then(r=>{
        
        if(r.data){
        //  this.paciente=r.data.orden
        console.log('r.datar.datar.datar.datar.datar.data: ',r.data);
        }
      })
   }  
  }

pruebaTurnos(){
console.log('Hace la prueba en Turnos');
  }
size_nombre=7;
size_cedula=3;
size_reset_total=2;
size_nombre_tablet=6;
size_cedula_tablet=6;
}



