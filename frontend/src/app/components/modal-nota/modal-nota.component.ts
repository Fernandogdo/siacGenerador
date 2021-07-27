import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-modal-nota',
  templateUrl: './modal-nota.component.html',
  styleUrls: ['./modal-nota.component.css']
})
export class ModalNotaComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }


  close(){
    this.dialog.closeAll();
  }

}
