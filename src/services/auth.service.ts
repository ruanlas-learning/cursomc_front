import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";

@Injectable()
export class AuthService {

    constructor(public http: HttpClient) {

    }

    authenticate(creds: CredenciaisDTO) {
        return this.http.post(
                    `${API_CONFIG.baseUrl}/login`, 
                    creds,
                    {
                        observe: 'response', //=> isso será necessário pois devemos obter o header da resposta
                        responseType: 'text' //=> isso é necessário para o framework não tentar 
                        //                               parsear o response que vem vazio para json
                    }
                );
    }
}