import { Component } from '@angular/core';
import { Client1Service } from '../services/client1.service';
import { RouterTestingHarness } from '@angular/router/testing';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-client1',
  standalone: false,
  templateUrl: './client1.component.html',
  styleUrl: './client1.component.scss'
})
export class Client1Component {

  toast = { visible: false, error: false, title: '', message: '' }

  spin: boolean = false;
  conf: any;
  estat: string = '';
  pubtopic: string = '';
  pubmessage: string = '';

  subtopic: string = '';
  subqos: number=0;
  subs: string[] = [];
  messages: any[] = [];

  constructor(
    private servclient: Client1Service
  ) {
    this.status();
  }

  status() {
    this.spin = true;
    setTimeout(() => {
      this.servclient.getConfig().subscribe((res: any) => {
        this.spin = false;
        console.log("getStatus: ", res);
        this.conf = res.data;
        if (this.conf.connect) {
          this.subs = this.conf.topics;
          this.refreshMessages();
        }
      });
    }, 2000);
  }

  connect() {
    if (this.conf && this.conf.connect) return;
    this.spin = true;
    this.servclient.conectar().subscribe((res: any) => {
      this.spin = false;
      console.log("connect : ", res);
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
      if (!res.error) {
        this.pubtopic = '';
        this.pubmessage = '';
      }
      this.showToast(res.error, res.error ? 'Error' : 'Ok', res.data);
      console.log("publicar : ", res);
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
    this.servclient.subscribir(this.subtopic, this.subqos).subscribe((res: any) => {
      this.spin = false;
      this.showToast(res.error, res.error ? 'Error' : 'Ok', res.data);
      if (!res.error) {
        this.subs.push(this.subtopic);
        this.subtopic = '';
        this.subqos = 0;
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
      if (!res.error)
        this.messages = res.data;
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
    setTimeout(() => { this.closeToast() }, 4000);
  }

  closeToast() {
    this.toast.visible = false;
  }

  setQoS( val: number ) {
    this.subqos = val;
  }
}
