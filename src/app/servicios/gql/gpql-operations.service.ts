
import { Injectable } from '@angular/core';

import { QueryService } from './query.service';
import { Utilidades } from 'src/app/utils/utilidades';

@Injectable({
  providedIn: 'root'
})
/*
  REUSABILIDAD
  solo para vistas o consultas que devuelven un MAP
  Deben estar declaradas en el esquema con tipo JSON
  parametros de entrada deben ir tal cual el esquema y solo Int o String
*/
export class GraphQLOperationsService {

  constructor(
    private queryservice: QueryService,
    public utilidades: Utilidades,
  ) {

  }
 
  //MANEJADOR DE ERRORES
  async handleGraphQLResult(method: string, parametros: { [key: string]: any },respuesta=null) {
    try {
        const resultado =respuesta!=null?respuesta:await this.queryservice.consultarOperacionGraphQL(method, parametros);

        if (resultado?.data && resultado.data.hasOwnProperty(method)) {
            console.log('Mensaje devuelto con exito:', resultado.data);
            return resultado.data[method];
        }

        if (resultado?.errors?.length > 0) {
            console.error('Error específico:', resultado.errors[0]);
            this.utilidades.mostrarToast(resultado.errors[0].message);
        } else {
            this.utilidades.mostrarToast(`OCURRIO UN PROBLEMA AL CARGAR DATOS ${method}`);
        }

       // throw new Error('Hubo un problema durante la operación');//TOCA CONSIDERAR DESCOMENTARLE
    } catch (error) {
        console.error('Error inesperado:', error);
        this.utilidades.alertErrorService(method, error.status);
        throw error;
    }
}
//EMPIEZA A CREAR LAS FUNCIONES
async getUsuariosOrden(nro_ord) {
  const method = "getUsuariosOrden";
  const parametros = { nro_ord };
  return this.handleGraphQLResult(method, parametros);

}

async getListUsuarios() {
  const method = "listUsuarios";
  const parametros = {};
  return this.handleGraphQLResult(method, parametros);
}

async getEstados() {
  const respuesta= await this.queryservice.getListEstatus();
  return this.handleGraphQLResult("ListEstatus", null,respuesta);
}


async getArchivoFirma(usuario:String) {
  return this.handleGraphQLResult("getArchivoFirma", {usuario});
}


  /*
  async getUsuariosOrden2(nro_ord,dato2) {
    const method = "getUsuariosOrden";
    const parametros = {nro_ord,dato2};
    return this.queryservice.consultarOperacionGraphQL(method, parametros);
  }
  */

}