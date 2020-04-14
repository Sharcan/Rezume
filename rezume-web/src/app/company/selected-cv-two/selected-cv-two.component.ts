import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CvService } from 'src/app/shared/cv.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-selected-cv-two',
  templateUrl: './selected-cv-two.component.html',
  styleUrls: ['./selected-cv-two.component.css']
})
export class SelectedCvTwoComponent implements OnInit {

  cvDetails;

  constructor(private route: ActivatedRoute, private cvService: CvService, private _location: Location) { }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    this.cvService.getSelectedCV(id).subscribe(
      res => {
        this.cvDetails = res["cv"];
        console.log(this.cvDetails);
      },
      err => {
        console.log('Impossible de recup cv details');
      }
    )
  }

  backToPage() {
    this._location.back();
  }

}