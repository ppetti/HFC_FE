import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public auth: AuthService
  ) {}

  ngOnInit(): void {}

  openAccedi(): void {
    this.dialog.open(LoginDialogComponent, {
      disableClose: true
    });
  }

}
