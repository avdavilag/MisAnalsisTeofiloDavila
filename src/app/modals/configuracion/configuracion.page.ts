import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { timeout } from 'rxjs';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { WebRestService } from 'src/app/servicios/intranet/web-rest.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  recibos_printer: any
  facturas_printer: any
  etiquetas_printer: any
  status_csagent: boolean = false
  list_printers = []
  list_origen = []
  origen_lab: any
  listSeguro: any;
  planSelected: any;
  resultados_printer: any

  constructor(
    private modalController: ModalController,
    private variablesGlobales: VariablesGlobalesService,
    private restService: WebRestService,
    private toastService: ToastService,
    private queryService: QueryService,
    private alertController: AlertController,
    private loadingService:LoadingService
  ) {
    this.origen_lab = {
      cod_ori: 'no',
      des_ori: 'Seleccione un origen'
    }
   // this.recibos_printer = this.variablesGlobales.getRecibosPrinter().printer_name
   // this.facturas_printer = this.variablesGlobales.getFacturasPrinter().printer_name
   // this.etiquetas_printer = this.variablesGlobales.getEtiquetasPrinter().printer_name

   // this.variablesGlobales.getRecibosPrinter(),
   this.testCsAgent()
     

  }

  ngOnInit() {
  //  this.ListOrigen()
  //  this.ListSeguro()
   
  }

  cerrar() {
    this.modalController.dismiss()
  }

  ngAfterViewInit(){
    
    

  
  }

  testCsAgent() {
    console.log("entreee");

    this.restService.testAgent().subscribe((r) => {
      console.log('testAgent', r);
      this.status_csagent = true
     // this.ListPrinters()
      this.getLocalConfig()
   

    }, error => {
      console.log(error);

      this.status_csagent = false
    })
  }

  ListPrinters() {
    if (!this.status_csagent) { return }
    this.restService.getListPrinters().subscribe((r: any) => {
      console.log('list', r);
      this.list_printers = JSON.parse(r.data)
      console.log(this.list_printers);


    })
  }




  SavePrinter(tipo) {
    let toastData = {
      message: "Impresora guardada Correctamente",
      color: "success",
      position: "top",
      duration: 1500
    }
    switch (tipo) {
      case "recibos":
        if (this.recibos_printer != '' || this.recibos_printer != null) {
          this.variablesGlobales.setRecibosPrinter({ "printer_name": this.recibos_printer })
          this.toastService.presentToast(toastData)
        }
        break;

      case "facturas":
        if (this.facturas_printer != '' || this.facturas_printer != null) {
          this.variablesGlobales.setFacturasPrinter({ "printer_name": this.facturas_printer })
          this.toastService.presentToast(toastData)
        }
        break;

      case "etiquetas":
        if (this.etiquetas_printer != '' || this.etiquetas_printer != null) {
          this.variablesGlobales.setEtiquetasPrinter({ "printer_name": this.etiquetas_printer })
          this.toastService.presentToast(toastData)
        }
        case "resultados":
        if (this.resultados_printer != '' || this.resultados_printer != null) {
          this.variablesGlobales.setResultadosPrinter({ "printer_name": this.resultados_printer })
          this.toastService.presentToast(toastData)
        }
        break;


    }
  }

  removeImpresora(tipo) {
    let toastData = {
      message: "Impresora borrada",
      color: "warning",
      position: "bottom",
      duration: 1500
    }
    switch (tipo) {
      case "recibos":
        localStorage.removeItem('recibos_printer')
        this.recibos_printer = ''
        this.toastService.presentToast(toastData)
        break;

      case "facturas":
        localStorage.removeItem('facturas_printer')
        this.facturas_printer = ''
        this.toastService.presentToast(toastData)
        break;

      case "etiquetas":
        localStorage.removeItem('etiquetas_printer')
        this.etiquetas_printer = ''
        this.toastService.presentToast(toastData)
        break;


    }



  }



  getOrigen() {
    if (this.variablesGlobales.getOrigenOrden() != null) {
      console.log("entre get origen");

      this.origen_lab = this.variablesGlobales.getOrigenOrden()
      console.log(' this.origen_lab ', this.origen_lab);

    }

  }

  ListOrigen() {
    this.queryService.getListOrigen().then(r => {
      console.log(r);
      this.list_origen = r.data.ListOrigen
      console.log('list_origen', this.list_origen);
      this.getOrigen()
    })
  }

  selectChangeOrigen(ev) {
    console.log('Current value:', JSON.stringify(ev.target.value));
    if (ev.target.value == 'no') {
      this.removeOrigenOrden()
      return
    }
    let temp_ori = this.list_origen.filter(r => { return r.cod_ori == ev.target.value })
    console.log('temp_ori', temp_ori);
    this.variablesGlobales.setOrigenOrden(temp_ori[0])
    //this.origen_lab
    this.toastService.presentToast({
      message: "Origen actualizado",
      duration: 1500,
      position: "bottom",
      color: "success"
    })
  }

  removeOrigenOrden() {
    this.origen_lab = {
      cod_ori: 'no',
      des_ori: 'Seleccione un origen'
    }
    localStorage.removeItem('origen_lab')
    this.toastService.presentToast({
      message: "Origen borrado",
      color: "warning",
      position: "bottom",
      duration: 1500
    })
  }


  ListSeguro() {
    this.queryService.getListSeguro().then((r: any) => {
      console.log('planes', r);
      this.listSeguro = r.data.ListSeguro;
      this.getPlan()
    })
  }

  savePlan(event) {
    console.log(event);
    let plan = event.detail.value
    this.planSelected = plan
    this.variablesGlobales.setPlanDefault(plan);
  }

  getPlan() {
    if (this.variablesGlobales.getPlanDefault() != '') {
      let plan_temp = this.variablesGlobales.getPlanDefault(); console.log('plan_temp',plan_temp);
      
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
    }
  }

  async presentAlertLocalConf() {
    const alert = await this.alertController.create({
      header: 'Cargar datos por defecto',
      message: 'Esta a punto de cargar la configuración local, se sobreescribiran los datos',
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
            this.getLocalConfig()
          }
        }
      ]
    });

    await alert.present();
  }
  getLocalConfig() {
    this.loadingService.present("Cargando Configuración")
    if (!this.status_csagent) { return }
    this.restService.getLocalConfig().subscribe((r: any) => {
      console.log(r);
      let data = r.data;
/*
      if (data.cod_ori && this.list_origen.length>0) {
        let temp_ori = this.list_origen.filter(r => { return r.cod_ori == data.cod_ori })
        console.log('temp_ori', temp_ori);
        this.origen_lab = temp_ori[0]
        this.variablesGlobales.setOrigenOrden(temp_ori[0])
      }

      if(data.cod_plan && this.listSeguro.length>0){
        this.variablesGlobales.setPlanDefault({id_plan:data.cod_plan});
        this.getPlan()
      }
*/
      if (data.facturas_printer_name ) {
        console.log("entre facturas",data.facturas_printer_name);
        
        this.facturas_printer = data.facturas_printer_name
        this.SavePrinter('facturas');
      }
      if (data.recibos_printer_name ) {
        this.recibos_printer = data.recibos_printer_name
        this.SavePrinter('recibos');
      }
      if (data.etiquetas_printer_name ) {
        console.log("entre etiquetas conifg");
        
        this.etiquetas_printer = data.etiquetas_printer_name
        this.SavePrinter('etiquetas');
      }

      if (data.resultados_printer_name ) {
        console.log("entre etiquetas conifg");
        
        this.resultados_printer = data.resultados_printer_name
        this.SavePrinter('resultados');
      }

      this.loadingService.dismiss()
    })

  }


  selectChangePrinter(ev, tipo) {
    console.log('Current value:', JSON.stringify(ev.target.value));
    if (ev.target.value == 'no') {
      this.removeImpresora(tipo)
      return
    } else {
      this.SavePrinter(tipo)
    }
  }




}
