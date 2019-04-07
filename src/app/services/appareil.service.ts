import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppareilService {

  appareilsSubject = new Subject<any[]>();
  
  private appareils = [];

  constructor(private httpClient: HttpClient) {}

  saveAppareilToService() {
    this.httpClient.put('https://projet-test-43177.firebaseio.com/appareils.json', this.appareils).subscribe(
      () => {
        this.getAppareilfromServer();
        console.log('Enregistrement terminé !');
      },
      (error) => {
        console.log('Erreur ! : ' + error)
      }
    );
  }

  getAppareilfromServer() {
    this.httpClient.get<any[]>('https://projet-test-43177.firebaseio.com/appareils.json').subscribe(
      (response) => {
        this.appareils = response;
        this.emitAppareilSubject();
      },
      (error) => {
        console.log('Erreur ! :' + error);
      }
    )
  }

  getAppareilById(id: number) {
    const appareil = this.appareils.find(
      (s) => {
        return s.id === id;
      }
    );
    return appareil;
  }

  emitAppareilSubject() {
    this.appareilsSubject.next(this.appareils.slice());
  }

  switchOnAll() {
    console.log('On allume tout !');
    for(let appareil of this.appareils) {
      appareil.status = 'allumé';
    }
    this.emitAppareilSubject();
  }
  switchOffAll() {
    console.log('On éteint tout !');
    for(let appareil of this.appareils) {
      appareil.status = 'éteint';
    }
    this.emitAppareilSubject();
  }

  switchOnOne(i: number) {
    this.appareils[i].status = 'allumé';
    this.emitAppareilSubject();
  }

  switchOffOne(i: number) {
    this.appareils[i].status = 'éteint';
    this.emitAppareilSubject();
  }

  addAppareil(name: string, status: string) {
    const appareilObject = {
      id: 0,
      name: '',
      status: ''
    };
    appareilObject.name = name;
    appareilObject.status = status;
    appareilObject.id = this.appareils[(this.appareils.length - 1)].id + 1;
    this.appareils.push(appareilObject);
    this.emitAppareilSubject();
  }

}