import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { stringify } from 'querystring';
import { GraphQLMutationService } from 'src/app/servicios/gql/gpql-mutation.service';
import { GraphQLOperationsService } from 'src/app/servicios/gql/gpql-operations.service';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { FuncionesComunesIntra } from 'src/app/utils/funciones-comunes-intra';
import { Utilidades } from 'src/app/utils/utilidades';

@Component({
  selector: 'app-timeline-orden',
  templateUrl: './timeline-orden.page.html',
  styleUrls: ['./timeline-orden.page.scss'],
})
export class TimelineOrdenPage implements OnInit {
  tiempo = "hell"
  dataUsuarios;
  usuarios;
  @Input() public nroOrden = "";
  private sesion_usuario;
  sesion_usuario_des;
  constructor(public modalCtrl: ModalController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public funcionesComunesIntra: FuncionesComunesIntra,
    public utilidades: Utilidades,
    private varGlobal: VariablesGlobalesService,
    private gpqlOperationService: GraphQLOperationsService,
    private qplMutationService: GraphQLMutationService) { }

  ngOnInit() {

  }
  ionViewDidEnter() {

    this.sesion_usuario = this.varGlobal.getVarUsuarioIntra();
    this.sesion_usuario_des = this.varGlobal.getVarUsuarioIntraDes();
    this.consultaUsuarios()

  }

  async consultarOperacion() {
    const resultado = await this.gpqlOperationService.getUsuariosOrden(parseInt(this.nroOrden));
    this.dataUsuarios = resultado;
    if (this.dataUsuarios && this.dataUsuarios.length > 0) {
      if (this.dataUsuarios[0].last_user_ord != null && !this.validaUsuario(this.dataUsuarios[0].last_user_ord)) {
        this.usuarios.push({ usuario: this.dataUsuarios[0].last_user_ord, nom_usu: this.dataUsuarios[0].last_user_ord + " (inactivo)" })
      }
      this.dataUsuarios.forEach(peticion => {
        if (peticion.usu_val != null && !this.validaUsuario(peticion.usu_val)) {
          this.usuarios.push({ usuario: peticion.usu_val, nom_usu: peticion.usu_val + " (inactivo)" })
        }
      });
    }
    console.log('Resultado en el componente:', resultado);
    setTimeout(() => {
      this.loadingController.dismiss()
    }, 500);
    // this.onUserChange()

  }

  async consultaUsuarios() {
    this.loadingOrden();
    const resultado = await this.gpqlOperationService.getListUsuarios();
    this.usuarios = resultado;
    if(this.nroOrden&&this.nroOrden!='')
      this.consultarOperacion()
      else{
        setTimeout(() => {
          this.loadingController.dismiss()
        }, 500);
      }
    console.log('Resultado usuarios:', resultado);

  }
  convertirFechaMilisegundos(fechaEnMilisegundos): string {
    const fecha = new Date(fechaEnMilisegundos);

    // Obtener la diferencia de minutos entre la zona horaria local y UTC
    const diferenciaZonaHoraria = fecha.getTimezoneOffset();

    // Ajustar la fecha restando la diferencia de minutos
    const fechaLocal = new Date(fecha.getTime() - diferenciaZonaHoraria * 60000);

    // Formatear la fecha y la hora en el formato local del navegador
    const formatoLocal = fechaLocal.toISOString().slice(0, 16).replace('T', ' ');

    return formatoLocal;
  }



  validaUsuario(usuario: string): boolean {
    console.log(usuario);

    return this.usuarios.some(item => item.usuario === usuario);
  }

  actualizarFechas(event: any) {
    const nuevaFecha = event.target.value;
    const nuevaFechaMilisegundos = Date.parse(nuevaFecha);

    if (!isNaN(nuevaFechaMilisegundos)) {
      this.dataUsuarios[0].fec_ini_ord = nuevaFechaMilisegundos;
      this.dataUsuarios.forEach(peticion => {
        peticion.fec_ini_pet = nuevaFechaMilisegundos;
        if (peticion.fec_val < nuevaFechaMilisegundos) {
          peticion.fec_error = 'No puede ser menor a la creación';
        } else {
          peticion.fec_error = null; // Limpiar el mensaje de error si la fecha es válida
        }
      });
    } else {
      console.error('Error al convertir la fecha a milisegundos.');
    }
  }

  actualizarFechaPeticion(event: any, peticion: any) {
    const nuevaFecha = event.target.value;
    const nuevaFechaMilisegundos = Date.parse(nuevaFecha);
    if (!isNaN(nuevaFechaMilisegundos)) {
      peticion.fec_ini_pet = nuevaFechaMilisegundos
      if (peticion.fec_val < nuevaFechaMilisegundos) {
        peticion.fec_error = 'No puede ser menor a la creación';
      } else {
        peticion.fec_error = null; // Limpiar el mensaje de error si la fecha es válida
      }
    } else {
      console.error('Error al convertir la fecha a milisegundos.');
    }

  }

  actualizarFechaValida(event: any, peticion: any) {
    const nuevaFecha = event.target.value;
    const nuevaFechaMilisegundos = Date.parse(nuevaFecha);
    if (!isNaN(nuevaFechaMilisegundos)) {
      peticion.fec_val = nuevaFechaMilisegundos
      if (peticion.fec_ini_pet > nuevaFechaMilisegundos) {
        peticion.fec_error = 'No puede ser menor a la creación';
      } else {
        peticion.fec_error = null; // Limpiar el mensaje de error si la fecha es válida
      }
    } else {
      console.error('Error al convertir la fecha a milisegundos.');
    }

  }

  async guardaCambios(){
    this.loadingOrden()
    const sendData=this.dataUsuarios;
    
    sendData.forEach(element => {
      element.fec_ini_ord=this.convertirFechaMilisegundos( element.fec_ini_ord)
      element.fec_val=this.convertirFechaMilisegundos( element.fec_val)
      element.fec_ini_pet=this.convertirFechaMilisegundos( element.fec_ini_pet)
      element.fec_upd_pet=this.convertirFechaMilisegundos( element.fec_upd_pet)
      // Eliminar el campo error
      delete element.fec_error;
    });
    console.log('ENVIA:', sendData);

    const resultado = await this.qplMutationService.setUsuariosFechaOrden(JSON.stringify(sendData));
    //CREO LA AUDITORIA
    this.funcionesComunesIntra.enviaAuditoria(this.sesion_usuario,this.nroOrden,"UPDATE","Actualización de fechas y/o usuarios de auditoria");
    if(resultado.code==1){
      this.funcionesComunesIntra.mostrarToast("GUARDADO CORRECTAMENTE")
      this.cerrar()
    }else{
      this.utilidades.alertErrorService(resultado.descripcion,resultado.code);
    }
    setTimeout(() => {
      this.loadingController.dismiss()
    }, 500);
    //this.usuarios = resultado;
    //this.consultarOperacion()
    console.log('GUARDADO:', resultado);
  }
  
  cerrar(){
    this.modalCtrl.dismiss();
  }

  async loadingOrden() {
  
    const loading = await this.loadingController.create({
      id: '1',
      cssClass: 'my-custom-class',
      message: 'Cargando...',
      backdropDismiss: true,
      duration: 10000
    });

    return loading.present();
  }
 async subeHospitalario(analisis,descripcion){
    this.loadingOrden()

    
    console.log('ENVIA:', analisis);

    const resultado = await this.qplMutationService.setUploadHospitalario(this.nroOrden,analisis);

    setTimeout(() => {
      this.loadingController.dismiss()
    }, 500);
    console.log("resultado",resultado)
    if(resultado["@retorno"]&&resultado["@retorno"]!=null&&resultado["@retorno"].toUpperCase()=="OK"){

      this.utilidades.mostrarToastSuccess("Analisis "+descripcion+" subido al HIS")
    }else{
      
      this.utilidades.mostrarToastError("Ubo un problema al actualizar "+descripcion+" en HIS")
    }
  }
}
