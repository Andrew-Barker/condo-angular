import { Component, OnInit, Inject } from '@angular/core';
import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular/public_api';
import { LayoutService } from '../../../../core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { Observable } from 'rxjs';
import { UserModel } from 'src/app/modules/auth/_models/user.model';
import { ViewChild } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class Dashboard1Component implements OnInit {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  user$: UserModel;
  primaryBlue: string = '#3699FF';
  events$: any = [];
  calendarApi: Calendar;
  pendingStaysList;
  weatherOverview;
  


  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    // dateClick: this.handleDateClick.bind(this), // bind is important!
    events: this.events$,
    selectable: true,
    select: this.handleDateSelect.bind(this)
  };

  constructor(private auth: AuthService, private changeDetection: ChangeDetectorRef,
    private dashboardService: DashboardService) {
    this.auth.currentUserSubject.asObservable().subscribe(user => {
      this.user$ = user;
    });
  }

  ngOnInit(): void { 
    this.dashboardService.getWeatherOverview().subscribe(weather => {
      this.weatherOverview = weather;
    }, error => {
      
    })
   }

  ngAfterViewInit(): void {
    this.calendarApi = this.calendarComponent.getApi();

    this.dashboardService.getCondoEvents().subscribe(events => {
      console.log('events from api',events);
      this.calendarApi.addEventSource(events);
      this.events$ = this.calendarApi.getEvents();
      this.pendingStaysList = this.getPendingStays(this.events$);
      this.changeDetection.detectChanges();
    }, error => {

    });


  }

  handleDateSelect(info) {

    let validSelection = this.validateDate(info.start, info.end);

    if(!validSelection) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `You can't request to stay at the condo in the past. Please update your selection.`,
      })
    } else {
    
    const checkIn = info.start.toLocaleDateString();
    let checkOutDate = new Date(info.end);
    checkOutDate.setDate(checkOutDate.getDate() - 1);
    let checkOut = checkOutDate.toLocaleDateString();

    let html = `<p>Are you sure you would like to submit your request to stay at the condo during the following dates?</p>
    <p><b>${checkIn}</b><span *ngIf="!singleDay"> - <b>${checkOut}</b></span></p>`;
    if(checkIn == checkOut) {
      console.log('start and end the same');
      html = `<p>Are you sure you would like to submit your request to stay at the condo during the following date?</p>
      <p><b>${checkIn}</b></span></p>`;
    }
    
    //alert user to confirm request
    Swal.fire({
      title: `Verify Stay Request`,
      html: html,
      showCancelButton: true,
      confirmButtonText: `Submit`,
      cancelButtonText: `Discard`,
      width: `64rem`,
      cancelButtonColor: 'red',
      confirmButtonColor: '#3699FF',
      reverseButtons: true,
    }).then((result) => {
      if(result.isConfirmed) {
        //add event to the calendar

        const eventId = this.events$.length + 1;
        this.dashboardService.addCondoRequest({title: `${this.user$.fullname}`, allDay: true, start: info.start, end: info.end, backgroundColor: 'gold', textColor: 'black' }).subscribe(request => {
          console.log('post request success', request);

        this.calendarApi.addEvent(request);
        this.pendingStaysList.push(request);
        this.changeDetection.detectChanges();
        Swal.fire({
          icon: 'success',
          title: 'Request Submitted',
          text: 'Your request to stay at the condo has been submitted and is pending approval.',
          timer: 2500,
          timerProgressBar: true
        });

        }, error => {

        })
        

        
      }
    })
  }
}

  validateDate(startDate: Date, endDate: Date): boolean {
    const today: Date = new Date();
    today.setHours(0,0,0,0);
    if (startDate < today || endDate < today) {
      return false;
    }
    return true;
  }

  getPendingStays(events) {
    if(events) {
      return events.filter(stay => stay.backgroundColor === 'gold');
    }
    return [];
  }

  approveRequest(request) {
    // TODO: http call to update DB that request is approved
    request.setProp('backgroundColor', this.primaryBlue);
    request.setProp('textColor', 'white');
    this.dashboardService.updateCondoRequest(request).subscribe(updatedReq => {
      //do this after DB call
      this.calendarApi.getEventById(request.id).setProp('backgroundColor', this.primaryBlue);
      this.calendarApi.getEventById(request.id).setProp('textColor', 'white');
      this.pendingStaysList = this.getPendingStays(this.calendarApi.getEvents())
      this.changeDetection.detectChanges();

    }, error => {

    })
    
  }

  denyRequest(request, index) {
    console.log('request to delete', request, index)
    Swal.fire({
      title: `Are you sure you want to deny this request?`,
      showCancelButton: true,
      confirmButtonText: `Yes`,
      cancelButtonText: `No`,
      width: `50rem`,
      cancelButtonColor: 'red',
      confirmButtonColor: '#3699FF',
      reverseButtons: true,
    }).then((result) => {
      if(result.isConfirmed) {

        this.dashboardService.removeCondoRequest(request.id).subscribe(deleteResponse => {
          
          this.calendarApi.getEventById(request.id).remove();
          this.pendingStaysList.splice(index, 1);
        }, error => {

        })

      }
    })
  }

}