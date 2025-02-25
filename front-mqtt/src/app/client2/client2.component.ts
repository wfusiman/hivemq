import { Component } from '@angular/core';
import { Client2Service } from '../services/client2.service';

@Component({
  selector: 'app-client2',
  standalone: false,
  templateUrl: './client2.component.html',
  styleUrl: './client2.component.scss'
})
export class Client2Component {

  toast = { visible: false, error: false, title: '', message: '' }

  spin: boolean = false;
  conf: any;
  estat: string = '';
  pubtopic: string = '';
  pubmessage: string = '';

  subtopic: string = '';
  subs: string[] = [];
  messages: any[] = [];

  constructor(
    private servclient: Client2Service
  ) {
    this.status();
  }

  status() {
    this.spin = true;
    this.servclient.getStatus().subscribe((res: any) => {
      this.spin = false;
      console.log("getStatus: ", res);
      this.conf = res;
      if (this.conf.connect) {
        this.subs = this.conf.topics ? JSON.parse(this.conf.topics.replace(/'/g, '"')) : [];
        this.refreshMessages();
      }
    });
  }

  connect() {
    if (this.conf && this.conf.connect) return;
    this.spin = true;
    this.servclient.conectar().subscribe((res: any) => {
      this.spin = false;
      console.log("connectar : ", res);
      this.showToast(res.error, res.error ? 'Error' : 'Ok', res.error ? 'No se pudo conectar a broker' : 'Conectado a broker');
      if (!res.error) {
        this.status();
      }
    })
  }

  publish() {
    if (!this.conf || !this.conf.connect) {
      this.showToast(true, 'Error', 'No esta conectado')
      return;
    }
    this.spin = true;
    this.servclient.publicar(this.pubtopic, this.pubmessage).subscribe((res: any) => {
      this.spin = false;
      console.log("publicar : ", res);
      if (!res.error) {
        this.pubtopic = '';
        this.pubmessage = '';
      }
      this.showToast(res.error, res.error ? 'Error' : 'Ok', res.error ? 'No se pudo publicar' : 'Mensaje publicado');
    })
  }

  subscribe() {
    console.log("subscribor topic: ", this.subtopic)
    if (!this.conf || !this.conf.connect) {
      this.showToast(true, 'Error', 'No esta conectado')
      return;
    }
    if (this.subs.find((s: string) => s == this.subtopic)) return;
    this.spin = true;
    this.servclient.subscribir(this.subtopic).subscribe((res: any) => {
      this.spin = false;
      this.showToast(res.error, res.error ? 'Error' : 'Ok', res.data);
      if (!res.error) {
        this.subs.push(this.subtopic);
        this.subtopic = '';
      }
    });
  }

  refreshMessages() {
    console.log("refresh message: ", this.messages);
    if (!this.conf || !this.conf.connect) {
      this.showToast(true, 'Error', 'No esta conectado')
      return;
    }
    this.spin = true;
    this.servclient.getMessages().subscribe((res: any) => {
      this.spin = false;
      console.log("get messages: ", res);
      //if (!res.error)
      this.messages = res.data ? JSON.parse(res.data.replace(/'/g, '"')) : [];
      console.log("messages: ", this.messages);
      this.showToast(res.error, res.error ? 'Error' : 'Ok', res.error ? 'No se pudieron recuperar los mensajes' : 'Mensajes recuperados');
    });
  }

  dessub(topic: string) {
    if (!this.conf || !this.conf.connect) {
      this.showToast(true, 'Error', 'No esta conectado')
      return;
    }
    this.spin = true;
    this.servclient.desubscribir(topic).subscribe((res: any) => {
      this.spin = false;
      if (!res.error)
        this.subs = this.subs.filter((s: string) => s != topic);
      this.showToast(res.error, res.error ? 'Error' : 'Ok', res.data);
    })

    console.log("dessubscribir a tema: ", topic);
  }

  disconnect() {
    if (!this.conf || !this.conf.connect) {
      this.showToast(true, 'Error', 'No esta conectado')
      return;
    }
    this.spin = true;
    this.servclient.desconectar().subscribe((res: any) => {
      this.spin = false;
      this.showToast(false, 'Ok', 'Desconectado a broker');
      this.status();
    });
  }

  showToast(err: boolean, tit: string, msg: string) {
    this.toast.error = err;
    this.toast.title = tit;
    this.toast.message = msg;
    this.toast.visible = true;
    setInterval(() => {
      this.toast.visible = false;
    }, 6000);
  }

  closeToast() {
    this.toast.visible = false;
  }

}
