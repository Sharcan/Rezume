//built-in imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Lottie
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

//component imports
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';

//routes
import { AppRoutingModule } from './app-routing.module';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { StudentService } from './shared/student.service';

//other
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { CvCreationComponent } from './cv-creation/cv-creation.component';
import { CvUpdateComponent } from './student-profile/cvUpdate/cv-update/cv-update.component';
import { CvViewComponent } from './student-profile/cv-view/cv-view.component';
import { GetAllCvComponent } from './get-all-cv/get-all-cv.component';
import { SelectedCvComponent } from './get-all-cv/selected-cv/selected-cv.component';
import { SignUpStudentComponent } from './sign-up/sign-up-student/sign-up-student.component';
import { SignUpCompanyComponent } from './sign-up/sign-up-company/sign-up-company.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { JobCreationComponent } from './job-creation/job-creation.component';
import { GetAllJobComponent } from './get-all-job/get-all-job.component';
import { JobSelectedComponent } from './get-all-job/job-selected/job-selected.component';
import { PostComponent } from './post/post.component';
import { ProfileSideComponent } from './company-profile/profile-side/profile-side.component';
import { PostSideComponent } from './company-profile/post-side/post-side.component';
import { CompanyDetailComponent } from './company/company-detail/company-detail.component';
import { NavbarComponent } from './navbar/navbar.component';


// LOTTIE PLAYER
export function playerFactory() {
  return player;
}


@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    StudentProfileComponent,
    SignInComponent,
    CvCreationComponent,
    CvUpdateComponent,
    CvViewComponent,
    GetAllCvComponent,
    SelectedCvComponent,
    SignUpStudentComponent,
    SignUpCompanyComponent,
    CompanyProfileComponent,
    JobCreationComponent,
    GetAllJobComponent,
    JobSelectedComponent,
    PostComponent,
    ProfileSideComponent,
    PostSideComponent,
    CompanyDetailComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LottieModule.forRoot({ player: playerFactory, useCache: true, }),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  AuthGuard,
  StudentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
