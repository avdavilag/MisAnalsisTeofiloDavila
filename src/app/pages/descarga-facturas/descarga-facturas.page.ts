import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonAccordionGroup, IonInfiniteScroll, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { error } from 'console';
import { FacturasPage } from 'src/app/modals/facturas/facturas.page';
import { ListTipoPage } from 'src/app/popover/list-tipo/list-tipo.page';
import { BaseService } from 'src/app/servicios/base/base.service';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { WebRestService } from 'src/app/servicios/intranet/web-rest.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { PdfRenderService } from 'src/app/servicios/pdf/pdf-render.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { FuncionesComunes } from 'src/app/utils/funciones-comunes';
import { FuncionesComunesIntra } from 'src/app/utils/funciones-comunes-intra';
import { Utilidades } from 'src/app/utils/utilidades';

@Component({
  selector: 'app-descarga-facturas',
  templateUrl: './descarga-facturas.page.html',
  styleUrls: ['./descarga-facturas.page.scss'],
})
export class DescargaFacturasPage implements OnInit {

  @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;
  @ViewChild('filterOrden') filterInput: ElementRef;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public formato_fecha = 'yyyy-MM-dd';
  public usuario;
  public var_usr;
  public sesion_usuario;
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
  public flag_view_ord = false;

  fecha_desde
  fecha_hasta
  dato_find = ""
  inicio_paginacion = 0
  order_by = ""
  infoText = ""
  checked_all = false

  input_filtro: any = {};

  list_referencia: any;
  list_medicos: any;
  list_planes: any;
  local_ip:any='';

  filtro_correos=[
    {des:'Referencia',checked:true,cod:'ref'  },
    {des:'Medico',checked:true,cod:'med'  },
    {des:'Paciente',checked:true,cod:'pac'  },
    {des:'Otro',checked:false,cod:'otro'  },
  ]

  inputMailOtro:String="";

  filtro_ref:any={cod:null,des:"todos"};
  filtro_med:any={cod:null,des:"todos"};
  filtro_plan:any={cod:null,des:"todos"};
  filtro_uni:any={cod:null,des:"todos"};

  filtro_sts:any={cod:null,des:"todos"};

  constructor(
    private queryservice:QueryService,
    public modalCtrl: ModalController,
    private varGlobal: VariablesGlobalesService,
    private servicios: BaseService,
    public popoverController: PopoverController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public toastService: ToastService,
    public funcionesComunes: FuncionesComunes,
    public utilidades: Utilidades,
    public funcionesComunesIntra: FuncionesComunesIntra,
    private configApp: AppConfigService,
    private webrestService:WebRestService,
    private pdfRender:PdfRenderService,
    private loadingService:LoadingService
  ) { }

  ngOnInit() {
    
    
    this.usuario = {};
    this.var_usr = {};
    this.lista_ordenes = [];
    this.lista_filtrar = [];
    this.lista_temporal = [];
    

    this.formato_fecha = this.configApp.formatoFecha;
    this.ativa_progress = this.configApp.progressPDF;//si esta activado buscara el prgress para dejarle imprimir
    if (this.configApp.formatoRefPDF) {
      this.formato_pdf_ref = this.configApp.formatoRefPDF//si tiene un valor voy a coger este valor y activar el boton
    }


    console.log(window.innerWidth);
    if (window.screen.width < 769 || window.innerWidth < 769) { // 768px portrait        
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    window.onresize = () => {
      if (window.screen.width < 769 || window.innerWidth < 769) { // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    };
  }


  ionViewWillEnter() {
    this.usuario = {};
    this.var_usr = {};
    this.lista_ordenes = [];
    this.lista_filtrar = [];
    this.lista_temporal = [];
    let fecha_hoy = new Date()
    this.fecha_hasta = fecha_hoy.toISOString().split("T")[0]
    let dias = 3

    this.sesion_usuario = this.varGlobal.getVarUsuarioIntra();
    
    this.des_usr = this.varGlobal.getVarUsuarioDes();
    this.var_usr = this.varGlobal.getVarUsuario()//ESTE ES L CODIGO
    this.tipo_user = this.varGlobal.getVarUsuarioTipo();
    console.log('this.des_usr', this.varGlobal.getVarUsuarioDes());
    console.log('this.var_usr', this.var_usr);
    console.log('this.tipo_user', this.tipo_user);

    if (this.tipo_user == 'ref') {
      if (this.configApp.enable_orden_referencia) { this.flag_view_ord = true }
    }
    if (this.tipo_user == 'int') {
      this.flag_view_ord = true
    }

    //this.fecha_desde=new Date(this.fecha_desde.setDate( this.fecha_hasta.getTime()-miliseg_dia))
    if (this.tipo_user == 'pat') {
      this.fecha_desde = new Date("1990-01-01").toISOString().split("T")[0]
    } else {
      this.fecha_desde = new Date(fecha_hoy.setDate(fecha_hoy.getDate() - dias)).toISOString().split("T")[0]
    }

    // this.presentLoading();
    this.usuario = this.varGlobal.getEntidad();

    //tipo de servidor
    this.tipo_server = this.configApp.apiBaseType;
    //DEFAULT PAGINACION
    this.paginacion = this.configApp.defaultPaginacion;
    console.log("usuario", this.usuario);
    console.log("var_usr", this.var_usr);
    setTimeout(() => {
      //this.getData();
      // this.getDataListAva()
    }, 100);
    //MODIFICO EL CSS DE LA SOMBRA CREADA POR IONIC
    this.cssToolTip();

  }

  cssToolTip() {
    document.querySelector("ion-toolbar")
      .shadowRoot
      .querySelector(".toolbar-container").setAttribute("style", "contain:initial;overflow:initial")
  }


  abrirFiltro() {
    console.log("ABRIR FILTRO");
    this.filtro = this.filtro ? false : true;
  }

  async presentPopoverList(ev: any,tipo:any) {
    console.log(ev);
    
    const popover = await this.popoverController.create({
      component: ListTipoPage,
      event: ev,
      cssClass: 'ion-popover-custom',
      translucent: false,
      componentProps: {
        tipo:tipo
      }
    });

    popover.onDidDismiss()
      .then((data: any) => {

        console.log(data['data']);
        if (data['data']) {


          if(data['data'].tipo=='ref'){
         this.filtro_ref= data['data'].data_select
          }
      
          if(data['data'].tipo=='med'){
            this.filtro_med= data['data'].data_select
          }
      
          if(data['data'].tipo=='plan'){
            this.filtro_plan= data['data'].data_select
          }

          if(data['data'].tipo=='uni'){
            this.filtro_uni= data['data'].data_select
          }

          if(data['data'].tipo=='sts'){
            this.filtro_sts= data['data'].data_select
          }
      

         // this.tipo_filtro:tipo
        //  this.input_filtro = data['data'].data_select
        //  this.lista_filtrar = []
        //  this.lista_ordenes = []
        }

      });
    await popover.present();
  }

  validaFecha() {
    let fecha_hoy = new Date()
    let dias = 7
    let espera = 100
    if (this.fecha_desde == '') {
      espera = 150;
      setTimeout(() => {
        this.fecha_desde = new Date(fecha_hoy.setDate(fecha_hoy.getDate() - dias)).toISOString().split("T")[0]
      }, 100);
    }
    if (this.fecha_hasta == '') {
      espera = 150;
      setTimeout(() => {
        this.fecha_hasta = fecha_hoy.toISOString().split("T")[0]
      }, 100);
    }
    setTimeout(() => {
      //    this.getDataListAva()
    }, espera);

  }

  doInfinite(event) {
    if (this.lista_filtrar.length != this.lista_ordenes.length && this.digitosBusqueda.length == 0) {
      this.cargando = false;
      let inicio_paginacion = this.paginacion;
      this.paginacion += this.configApp.defaultPaginacion
      setTimeout(() => {
        this.infiniteScroll.complete();
        this.lista_filtrar.push(...this.lista_ordenes.slice(inicio_paginacion, this.paginacion));
        this.cargando = true;
        console.log(this.lista_filtrar);

      }, 1000);

    } else {
      event.target.disabled = true;
      this.toggleInfiniteScroll();
    }
  }
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  buscaxFiltro() {
    const nativeEl = this.accordionGroup;
    if (nativeEl.value === 'second') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'second';
    }
    this.getDataListAva()

  }

  async getDataListAva() {
    //this.presentLoading()
    this.infoText = "Cargando..."
    

    console.log(this.fecha_desde);


   
    let data:any={};

    if (this.dato_find != "" && this.dato_find.length > 3) {
      data.dato= this.dato_find;
    } else {
      data.dato, "";
    }

    data.codigo= this.var_usr
    data.tipo= this.tipo_user
    data.desde= this.fecha_desde
    data.hasta= this.fecha_hasta
    data.inicio= this.inicio_paginacion
    //data.listo_imprime=0
    data.factura="s"
    if (this.criterio_ordenamiento == 'D') {
      data.orderby= "DESC";
    } else {
      data.orderby= "ASC";
    }

    if(this.filtro_ref.cod!=null){
      data.id_ref=this.filtro_ref.cod
    }else{
      data.id_ref=""
    }
    if(this.filtro_med.cod!=null){
      data.cod_med=this.filtro_med.cod
    }else{
      data.cod_med=""
    }
    if(this.filtro_plan.cod!=null){
      data.id_plan=this.filtro_plan.cod
    }else{
      data.id_plan=""
    }

    if(this.filtro_sts.cod!=null){
      data.stsList=this.filtro_sts.cod
    }else{
      data.stsList=""
    }
    
      console.log(data);

      this.queryservice.getOrdenResultadosSB(data).then((r:any)=>{
        console.log(r);
        let result=r.data.getOrdentoResultadosDynamic

        for (let index = 0; index < result.length; index++) {
          let element = result[index];
          element.correos=[];


          if(element.mail_ref && element.mail_ref!=null && this.filtro_correos[0].checked){
            let correostemp=element.mail_ref.split(',');
            for (let index = 0; index < correostemp.length; index++) {
              const element_temp = correostemp[index];
              element.correos.push(element_temp)
            }
          }

          if(element.mail_med&& element.mail_med!=null && this.filtro_correos[1].checked){
            console.log('element.mail_med',element.mail_med);
          
            let correostemp=element.mail_med.split(',');
            for (let index = 0; index < correostemp.length; index++) {
              const element_temp = correostemp[index];
              element.correos.push(element_temp)
            }
          }


          if(element.mail_pac && element.mail_pac!=null && this.filtro_correos[2].checked){
            let correostemp=element.mail_pac.split(',');
            
            for (let index = 0; index < correostemp.length; index++) {
              const element_temp = correostemp[index];
              element.correos.push(element_temp)
            }
          }

          if(this.filtro_correos[3].checked && this.inputMailOtro!=''){
            element.correos.push(this.inputMailOtro)
          }
         // if(element.mail_pac) element.correos.push(element.mail_pac)
         // if(element.mail_med) element.correos.push(element.mail_med)
          element.text_correo=""
        }
  
        
  
        this.lista_ordenes = result;
        console.log('this.lista_ordenes',this.lista_ordenes);
        this.lista_filtrar=result;
        // this.lista_filtrar = result;
        /*
        if(this.filtro_med.cod==null &&this.filtro_ref.cod==null && this.filtro_plan.cod==null){
          this.lista_filtrar = result;
        }
  */
        this.lista_filtrar = this.lista_filtrar.slice(0, this.configApp.defaultPaginacion)
  
        //this.loadingController.dismiss();
        setTimeout(async () => {
          this.infoText = ""
          const isLoadingOpen = await this.loadingController.getTop();
          if (isLoadingOpen) {
            this.loadingController.dismiss()
          }
  
        }, 300);


      }, error => {
      console.log(error);
      const isLoadingOpen = this.loadingController.getTop();
      if (isLoadingOpen) {
        this.loadingController.dismiss()
      }
      this.utilidades.alertErrorService("get-list-orders", error.status)
      this.infoText = "Error"
      //this.loadingController.dismiss();
    })
   
  }

  async presentAlertDescargarFactura() {
    if(this.lista_ordenes==null || this.lista_ordenes.length==0){
      this.toastService.presentToast({
        message:"No existe listado para descargar",
        duration:1500,
        postion:'bottom',
        color:'warning'
      })
      return
    }
    const alert = await this.alertController.create({
      header:'Desea continuar con la descarga de facturas',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay');
            this.descargaFactura()
          }
        }
      ]
    });
  
    await alert.present();
  }


  descargaFactura(){
    let data_enviar=[]
    let fecha_d =new Date();
    let name_directory="avalab_facturas_"+fecha_d.getFullYear()+(fecha_d.getMonth()+1)+fecha_d.getDate()+fecha_d.getHours()+fecha_d.getMinutes()+fecha_d.getMilliseconds()

    this.lista_ordenes.forEach(element => {
      data_enviar.push({
        nro_ord:element.nro_ord,
        nombre_pdf:element.numero
      })
    });
    console.log("pdfRender",);
    this.loadingService.present("Enviando a descarga")
    data_enviar.push({
      url_pdf:this.pdfRender.urlPdfMail,
      name_directory:name_directory
    })

    console.log('data_enviar',data_enviar);
    this.webrestService.downloadFacBloque(data_enviar).subscribe((r:any)=>{
      console.log(r);
      this.loadingService.dismiss()
      if(r.status=='ok'){
        this.toastService.presentToast({
          message:r.message,
          duration:1500,
          position:'bottom',
          color:'success'
        })
      }
    },error=>{
      this.loadingService.dismiss()
      this.utilidades.alertErrorService("cs-Agent", error.status)
    })
  }

  async presentPopoverFacturas(data) {

    var formData: any = new FormData();
    formData.append("orden", data.nro_ord);
    console.log('formData',formData);
    
    let facturas;
    this.servicios.getListFacturas(formData).toPromise().then(async (r) => {
      console.log('r', r);
      facturas = r
      if (facturas.length > 0) {
        const modal = await this.modalCtrl.create({
          component: FacturasPage,
          //   cssClass: 'my-custom-class',
          //    event: ev,
          componentProps: {
            facturas: facturas,
            orden: data.nro_ord
          }
        });
        modal.onDidDismiss()
          .then((data) => {
          });
        return await modal.present();

      } else {
        this.toastService.presentToast({
          message:"No contiene Facturas",
          position:"top",
          duration:1500,
          color:"warning"
        })
      }
    }, error => {
      this.utilidades.alertErrorService("get-list-fact", error.status)
    })
  }

}
