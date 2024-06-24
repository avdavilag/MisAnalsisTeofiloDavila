import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';

@Component({
  selector: 'app-creartrackingord',
  templateUrl: './creartrackingord.page.html',
  styleUrls: ['./creartrackingord.page.scss'],
})
export class CreartrackingordPage implements OnInit {
  fecha_desde:any;
  fecha_hasta:any;
  tipo_usuario:any;
  var_usr:any;
  listadoOrden:any=[];
  constructor(
    private loadingService:LoadingService,
    private queryService:QueryService,
    private varGlobal:VariablesGlobalesService,
    private alertController:AlertController
  ) { }

  ngOnInit() {
  
  }

  ionViewWillEnter(){
    let fecha_hoy=new Date;
    let dias=5;
    this.fecha_hasta=fecha_hoy.toISOString().split("T")[0];
    this.fecha_desde= new Date(fecha_hoy.setDate(fecha_hoy.getDate() - dias)).toISOString().split("T")[0]
   

    this.tipo_usuario = this.varGlobal.getVarUsuarioTipo();
    this.var_usr = this.varGlobal.getVarUsuario();//CODIGO_user
    console.log('this.usuario',this.tipo_usuario);
    console.log('this.var_usr',this.var_usr);
    this.validaFecha()
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
      
      this.getData()
    }, espera);

  }

  getData(){

    let data={
      fecha_i:this.fecha_desde,
      fecha_h:this.fecha_hasta,
      tipo_user:this.tipo_usuario,
      codigo_user: this.var_usr,
      uuid_ordtrack:"",
      orderby: "desc"

    }
    console.log("data",data);

    this.queryService.getOrdenWeb(data).then((r:any)=>{
      console.log("web",r);
      let data=r.data.searchWebOrd;
      if(data.length>0){
        this.listadoOrden=data

      }
    })

  }

  checkedGuia(ev,data){
    console.log('ev',ev);
    console.log('data',data);
    data.checked=ev.detail.checked
    console.log('thislistadoOrden',this.listadoOrden);
    
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Crear nueva guia',
   //   message: 'Message <strong>text</strong>!!!',
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
            this.crearGuia()
          }
        }
      ]
    });
  
    await alert.present();
  }


  crearGuia(){
    let data_ordenes=[]
    
    for (let index = 0; index < this.listadoOrden.length; index++) {
      const element = this.listadoOrden[index];
      if(element.checked){
        element.uuid=this.generateUUid()
        data_ordenes.push(element)
      }
    }

    let data_send={
      user:this.var_usr,
      type_user:this.tipo_usuario,
    }
     = this.varGlobal.getVarUsuarioTipo();
    this.var_usr = 

    console.log("data_send",data_send);
 //   this.queryService.insertGuia(JSON.stringify(data_send)).then((r:any)=>{
   //   console.log('r',r);
      
   // })
  }

  generateUUid(){
    let date =new Date()
    let final_string:String =date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString() + date.getHours().toString()+ date.getMinutes().toString()+ date.getMilliseconds().toString()

    return final_string;
  }
}
