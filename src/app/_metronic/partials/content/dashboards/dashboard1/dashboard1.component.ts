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

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class Dashboard1Component implements OnInit {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  user$: UserModel;
  events$: any = [{ title: `Fun In The Sun`, allDay: true, start: '2020-10-12', end: '2020-10-14', backgroundColor: 'gold', textColor: 'black' },
  { title: 'Vacation!!!', allDay: true, start: '2020-10-23', end: '2020-11-01', backgroundColor: '#3699FF', editable: true }];
  calendarApi: Calendar;
  listEvents;
  


  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    // dateClick: this.handleDateClick.bind(this), // bind is important!
    events: this.events$,
    selectable: true,
    select: this.handleDateSelect.bind(this)
  };

  constructor(private auth: AuthService, private changeDetection: ChangeDetectorRef) {
    this.auth.currentUserSubject.asObservable().subscribe(user => {
      this.user$ = user;
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.calendarApi = this.calendarComponent.getApi();
    this.events$ = this.calendarApi.getEvents();
    this.listEvents = [{ title: `Fun In The Sun`, allDay: true, start: '2020-10-12', end: '2020-10-14', backgroundColor: 'gold', textColor: 'black' },
    { title: 'Vacation!!!', allDay: true, start: '2020-10-23', end: '2020-11-01', backgroundColor: '#3699FF', editable: true }];
  }

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
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
        
        // info.end.setDate(info.end.getDate() + 1);
        // checkOutDate.setDate(checkOutDate.getDate() - 1);
        console.log('info end', info.end);
        this.calendarApi.addEvent({ title: `${this.user$.fullname}`, allDay: true, start: info.start, end: info.end, backgroundColor: 'gold', textColor: 'black' });
        this.listEvents.push({ title: `${this.user$.fullname}`, allDay: true, start: info.start, end: checkOutDate, backgroundColor: 'gold', textColor: 'black' });
        this.changeDetection.detectChanges();
        console.log('all events', this.listEvents, checkOutDate);
        Swal.fire({
          icon: 'success',
          title: 'Request Submitted',
          text: 'Your request to stay at the condo has been submitted and is pending approval.',
          timer: 2500,
          timerProgressBar: true
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

  getPendingStays() {
    if(this.listEvents) {
      return this.listEvents.filter(stay => stay.backgroundColor === 'gold');
    }
    return [];
  }

}