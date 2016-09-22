# -*- coding: utf-8 -*-
import webapp2

from google.appengine.api import images
from google.appengine.api import users
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext import blobstore
from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.ext.webapp.util import run_wsgi_app
from operator import attrgetter
import datetime
import json
import urllib
import os
import logging
import pytz
import datetime

from twilio.rest import TwilioRestClient
import twilio
import six
from models import Kindergarten, Client, Responsible, SmsQ , Child
import sys
from time import sleep
from datetime import date , timedelta
from datetime import timedelta
import calendar

reload(sys)
sys.setdefaultencoding('utf8')


class Aviv(webapp2.RequestHandler):
    def get(self,phone):

        ACCOUNT_SID = "ACee3212de166539f38ec6533956597360"
        AUTH_TOKEN = "74f1e17261ece29f7b311f12af1b1888"
        delay = 5
        toPhone  = "+972" + phone

        client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN)

      
        msg = "גננת יקרה,"  +"\n" + "\n" + "האפליקציה החכמה והחינמית שפיתחנו עבורך "  +"\n"  + "תקל עלייך בעבודתך היומיומית עם הילדים, תוריד ממך את עומס ואחריות מצד ההורים,  והיא ניתנת לך בחינם !"  +"\n" + "\n"  + "המטרות שלנו:"  + "\n"  + " * ליצור תחושה של ביטחון"  +"\n"   + " * לומד זמני הגעה ויציאה"  +"\n"  + " * עמוד אינטרנט לכל גן"  +"\n" + "\n"  + "ככה זה נראה"  +"\n" + "\n" + "http://watch-kid.com"  +"\n"  +"\n" + "לפרטים נוספים ולתיאום התקנה" +  "\n"   +"\n" + "אביב- 0542432367"  +"\n" + "אלי - 058-463-3355" +   "\n" 

        rv = client.messages.create(to=toPhone, from_="+972526269220", body=msg)
               
        self.response.write('<br/>Sms send to  ' + phone)


class Test(webapp2.RequestHandler):
    _GMT = 3
    def get(self):

        current_date = datetime.datetime.now() + timedelta(hours=self._GMT) 
        child_out_date = datetime.datetime(current_date.year, current_date.month, current_date.day,0,0,0) + timedelta(days=+1) 
                    
        
        self.response.write('<br/>&nbsp;&nbsp;&nbsp;holiday_start_date   {} .'. format(current_date ))
        
        self.response.write('<br/>&nbsp;&nbsp;&nbsp;holiday_start_date   {} .'. format(child_out_date ))




        
class holiday_task_handler(webapp2.RequestHandler):
    _GMT = 3
    def get(self):
        today =  datetime.datetime.now() + timedelta(hours=self._GMT) 
        weekday = today.toordinal()%7 + 1

        Kindergarten_list = Kindergarten.query(  Kindergarten.cron_date < today).fetch()
        start_current_date = datetime.datetime(today.year, today.month, today.day,0,0,0)

        for k in Kindergarten_list:
            holiday_start_date = datetime.datetime(k.holiday.holiday_start_dete.year, k.holiday.holiday_start_dete.month, k.holiday.holiday_start_dete.day,0,0,0) + timedelta(days=-1) 
            holiday_end_date = datetime.datetime(k.holiday.holiday_end_dete.year, k.holiday.holiday_end_dete.month, k.holiday.holiday_end_dete.day,0,0,0) + timedelta(days=-1) 

            self.response.write('<br/>&nbsp;&nbsp;&nbsp;start_current_date   {} .'. format(start_current_date ))
            self.response.write('<br/>&nbsp;&nbsp;&nbsp;holiday_start_date   {} .'. format(holiday_start_date ))


            if ( k.holiday.is_active) and ( start_current_date == holiday_start_date ) :
                self.send_holiday_sms(k)
                
            current_date = datetime.datetime.now() + timedelta(hours=self._GMT) 
            k.cron_date   =  datetime.datetime(current_date.year, current_date.month, current_date.day,0,0,0) + timedelta(days=+1) 
            k.put()



class main_task_handler(webapp2.RequestHandler):
    _GMT = 3

    def send_sms(self,sms_q):
        ACCOUNT_SID = "ACee3212de166539f38ec6533956597360"
        AUTH_TOKEN = "74f1e17261ece29f7b311f12af1b1888"
        delay = 5
        client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN)
        rv = client.messages.create(to="+972" +sms_q.responsible_phone, from_="+972526269220", body=sms_q.title  +   '<br/>' +  sms_q.msg)

    def send_holiday_sms(self,kindergarten_obj):
        self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iin  send_holiday_sms ')
        #self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;kindergarten_obj.child_list  {} .'. format(kindergarten_obj.child_list))

        for child in kindergarten_obj.child_list:
            self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;in  child_list  loop ')
            client_object = Client.get_by_id(child.parent_id)

            for responsible in client_object.responsible_list:

                smsQ  = SmsQ()
                smsQ.kid_name = child.name
                smsQ.parent_id = kindergarten_obj.kindergarten_id 
                smsQ.sms_type = '_Holiday'
                smsQ.send_date = datetime.datetime.today()
                smsQ.send_date_request = datetime.datetime.today()
                smsQ.responsible_name = responsible.name
                smsQ.responsible_relation = responsible.relation
                smsQ.responsible_phone = responsible.phone
                smsQ.title = kindergarten_obj.holiday.holiday_title
                smsQ.msg = kindergarten_obj.holiday.holiday_reason
                smsQ.put();


            kindergarten_obj.holiday.is_active = False
            kindergarten_obj.put()



    def get_opening_time(self,today,kindergarten_obj):
        if (today ==  1):
            return  kindergarten_obj.schedule.sunday , kindergarten_obj.schedule.sunday_opeing_time  , kindergarten_obj.schedule.sunday_closing_time
        if (today ==  2):
            return  kindergarten_obj.schedule.monday , kindergarten_obj.schedule.monday_opeing_time  , kindergarten_obj.schedule.monday_closing_time
        if (today ==  3):
            return  kindergarten_obj.schedule.tuesday , kindergarten_obj.schedule.tuesday_opeing_time  , kindergarten_obj.schedule.tuesday_closing_time
        if (today ==  4):
            return  kindergarten_obj.schedule.wednesday , kindergarten_obj.schedule.wednesday_opeing_time  , kindergarten_obj.schedule.wednesday_closing_time
        if (today ==  5):
            return  kindergarten_obj.schedule.thursday , kindergarten_obj.schedule.thursday_opeing_time  , kindergarten_obj.schedule.thursday_closing_time
        if (today ==  6):
            return  kindergarten_obj.schedule.friday , kindergarten_obj.schedule.friday_opeing_time  , kindergarten_obj.schedule.friday_closing_time
        if (today ==  7):
            return  kindergarten_obj.schedule.saturday , kindergarten_obj.schedule.saturday_opeing_time  , kindergarten_obj.schedule.saturday_closing_time

    def is_holiday(self,kindergarten_obj ,today ,  holiday_start_date, holiday_end_date):
        _out = False

        if ( kindergarten_obj.holiday.is_active )  and (( today < holiday_start_date ) and ( today < holiday_end_date )) : 
            _out = True


        return _out


    def get(self):


        today =  datetime.datetime.now() + timedelta(hours=self._GMT)        
        weekday = today.toordinal()%7 + 1
        start_current_date = datetime.datetime(today.year, today.month, today.day,0,0,0)

      
        Kindergarten_list = Kindergarten.query( Kindergarten.cron_flag == False , Kindergarten.cron_date > today ).fetch()

        self.response.write('<br/><br/><br/> Check Opening   len(Kindergarten_list) =    {} .'. format(len(Kindergarten_list)))
        self.response.write('<br/>&nbsp;&nbsp;&nbsp;today    =  {} .'. format(today ))


        for k in Kindergarten_list:

            self.response.write('<br/><br/><br/> Kindergarten.cron_date    {} .'. format(k.cron_date))
            self.response.write('<br/>&nbsp;&nbsp;&nbsp;start_current_date   {} .'. format(start_current_date ))
            
            holiday_start_date = datetime.datetime(k.holiday.holiday_start_dete.year, k.holiday.holiday_start_dete.month, k.holiday.holiday_start_dete.day,0,0,0) + timedelta(days=-1) 
            holiday_end_date = datetime.datetime(k.holiday.holiday_end_dete.year, k.holiday.holiday_end_dete.month, k.holiday.holiday_end_dete.day,0,0,0) + timedelta(days=-1) 


            self.response.write('<br/>&nbsp;&nbsp;&nbsp;self.get_opening_time(weekday,k)[0]    =  {} .'. format(self.get_opening_time(weekday,k)[0] ))
            self.response.write('<br/>&nbsp;&nbsp;&nbsp;self.start_current_date     =  {} .'. format(start_current_date ))
            self.response.write('<br/>&nbsp;&nbsp;&nbsp;holiday_start_date    =  {} .'. format(holiday_start_date ))
            self.response.write('<br/>&nbsp;&nbsp;&nbsp;holiday_end_date    =  {} .'. format(holiday_end_date ))

            self.response.write('<br/>&nbsp;&nbsp;&nbsp;holiday_end_date    =  {} .'. format(holiday_end_date ))
            self.response.write('<br/>&nbsp;&nbsp;&nbsp;k.holiday.is_active    =  {} .'. format( k.holiday.is_active ))
            self.response.write('<br/>&nbsp;&nbsp;&nbsp;is_holiday    =  {} .'. format( self.is_holiday(k,start_current_date,holiday_start_date,holiday_end_date)   ))

            


            if (( self.get_opening_time(weekday,k)[0] == True )  and (  self.is_holiday(k,start_current_date,holiday_start_date,holiday_end_date) == False )): 
            
                self.response.write('<br/><br/><br/> Opening Step 1    .')
                self.response.write('<br/>&nbsp;&nbsp;&nbsp; self.get_opening_time(weekday,k) {} .'. format( weekday ))
                current_date = datetime.datetime.now() + timedelta(hours=self._GMT)        
                opening_date = datetime.datetime(current_date.year, current_date.month, current_date.day, int( self.get_opening_time(weekday,k)[1] .split(':')[0]) , int( self.get_opening_time(weekday,k)[1] .split(':')[1]))
                closing_date = datetime.datetime(current_date.year, current_date.month, current_date.day, int( self.get_opening_time(weekday,k)[2] .split(':')[0]) , int( self.get_opening_time(weekday,k)[2] .split(':')[1]))
                
                self.response.write('<br/>&nbsp;&nbsp;&nbsp; current_date  {} .'. format( current_date))
                self.response.write('<br/>&nbsp;&nbsp;&nbsp;opening_date    {} .'. format(opening_date ))
                self.response.write('<br/>&nbsp;&nbsp;&nbsp;closing_date   {} .'. format(closing_date  ))

                self.response.write('<br/>&nbsp;&nbsp;&nbsp;( current_date >  opening_date )   {} .'. format(( current_date >  opening_date )  ))
                self.response.write('<br/>&nbsp;&nbsp;&nbsp;( current_date <  closing_date )  {} .'. format(( current_date <  closing_date ) ))
            


                if ( current_date >  opening_date ) and ( current_date <  closing_date ) :
                    self.response.write('<br/><br/><br/> Step 2    .')
                
                    for child in k.child_list:


                        child_in_date  = datetime.datetime.strptime(child.in_date, "%Y-%m-%dT%H:%M:%S.%f")
                        child_list = Child.query( Child.parent_id  ==   child.parent_id ).fetch()

                        self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;child_in_date = {} .'. format( child_in_date  ))
                        self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;child_in_date.strftime(ymd) = {} .'. format( child_in_date.strftime('%Y-%m-%d') ))
                        self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;current_date.strftime(ymd) = {} .'. format( current_date.strftime('%Y-%m-%d') ))
                        self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;current_date.strftime('') == child_in_date.strftime('') = {} .'. format( current_date.strftime('%Y-%m-%d')  != child_in_date.strftime('%Y-%m-%d') ))
                        self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;child.name {} .'. format(child.name))



                        #if ( child_in_date <  current_date) and (  current_date.strftime('%Y-%m-%d')  != child_in_date.strftime('%Y-%m-%d')  ) :                            
                        if (   current_date.strftime('%Y-%m-%d')  != child_in_date.strftime('%Y-%m-%d')  ) :
                            client_object = Client.get_by_id(child.parent_id)

                            for responsible in client_object.responsible_list:
                                smsQ  = SmsQ()
                                smsQ.kid_name = child.name
                                smsQ.parent_id = child.parent_id
                                smsQ.sms_type = '_Missing'
                                smsQ.send_date = datetime.datetime.today()                            
                                smsQ.send_date_request = datetime.datetime.today()
                                smsQ.responsible_name = responsible.name
                                smsQ.responsible_relation = responsible.relation
                                smsQ.responsible_phone = responsible.phone
                                smsQ.put();
                                self.response.write('<br/>Do work')
                    k.cron_flag = True;
                
                    k.put()



        Kindergarten_list = Kindergarten.query( Kindergarten.cron_flag == True  , Kindergarten.cron_date > today).fetch()

        
        
        for k in Kindergarten_list:
            holiday_start_date = datetime.datetime(k.holiday.holiday_start_dete.year, k.holiday.holiday_start_dete.month, k.holiday.holiday_start_dete.day,0,0,0) + timedelta(days=-1) 
            holiday_end_date = datetime.datetime(k.holiday.holiday_end_dete.year, k.holiday.holiday_end_dete.month, k.holiday.holiday_end_dete.day,0,0,0) + timedelta(days=-1) 

            self.response.write('<br/><br/><br/> Check Closing    {} .'. format(len(Kindergarten_list)))
                    
            if (( self.get_opening_time(weekday,k)[0] == True )  and (  self.is_holiday(k,start_current_date,holiday_start_date,holiday_end_date) == False )): 

                current_date = datetime.datetime.now() + timedelta(hours=self._GMT)                  
                closing_date = datetime.datetime(current_date.year, current_date.month, current_date.day, int( self.get_opening_time(weekday,k)[2] .split(':')[0]) , int( self.get_opening_time(weekday,k)[2] .split(':')[1]))
                opening_date = datetime.datetime(current_date.year, current_date.month, current_date.day, int( self.get_opening_time(weekday,k)[1] .split(':')[0]) , int( self.get_opening_time(weekday,k)[1] .split(':')[1]))

                self.response.write('<br/><br/><br/>  Closing Step 1    .')
                self.response.write('<br/>&nbsp;&nbsp;&nbsp; self.get_opening_time(weekday,k) {} .'. format( weekday ))
                current_date = datetime.datetime.now() + timedelta(hours=self._GMT)        
                opening_date = datetime.datetime(current_date.year, current_date.month, current_date.day, int( self.get_opening_time(weekday,k)[1] .split(':')[0]) , int( self.get_opening_time(weekday,k)[1] .split(':')[1]))
                closing_date = datetime.datetime(current_date.year, current_date.month, current_date.day, int( self.get_opening_time(weekday,k)[2] .split(':')[0]) , int( self.get_opening_time(weekday,k)[2] .split(':')[1]))
                
                self.response.write('<br/>&nbsp;&nbsp;&nbsp; current_date  {} .'. format( current_date))
                self.response.write('<br/>&nbsp;&nbsp;&nbsp;opening_date    {} .'. format(opening_date ))
                self.response.write('<br/>&nbsp;&nbsp;&nbsp;closing_date   {} .'. format(closing_date  ))

                
                self.response.write('<br/>&nbsp;&nbsp;&nbsp;( current_date <  closing_date )  {} .'. format(( current_date <  closing_date ) ))
            


                if  ( current_date >  closing_date ) :
                    self.response.write('<br/><br/><br/> Closing Step 2    .')
               
                    for child in k.child_list:


                        child_out_date  = datetime.datetime.strptime(child.out_date, "%Y-%m-%dT%H:%M:%S.%f")
                        child_in_date  = datetime.datetime.strptime(child.in_date, "%Y-%m-%dT%H:%M:%S.%f")
                        child_list = Child.query( Child.parent_id  ==   child.parent_id ).fetch()

                        self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( current_date > closing_date )  {} .'. format(( current_date > closing_date) ))
                        self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( current_date.strftime()  != child_out_date.strftime() )  {} .'. format(( current_date.strftime('%Y-%m-%d')  != child_out_date.strftime('%Y-%m-%d')) ))
                        self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( current_date.strftime()  != child_in_date.strftime() )  {} .'. format(( current_date.strftime('%Y-%m-%d')  == child_in_date.strftime('%Y-%m-%d')) ))
                        self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( current_date.  )  {} .'. format(  current_date.strftime('%Y-%m-%d') ))
                        self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( child_in_date.  )  {} .'. format(  child_in_date.strftime('%Y-%m-%d') ))
                        self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( child_out_date.  )  {} .'. format(  child_out_date.strftime('%Y-%m-%d') ))
                        self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;child.name {} .'. format(child.name))




                        if ( current_date > closing_date  ) and ( (  current_date.strftime('%Y-%m-%d')  == child_in_date.strftime('%Y-%m-%d')  and ( current_date.strftime('%Y-%m-%d')  != child_out_date.strftime('%Y-%m-%d')) ) )  :
                            client_object = Client.get_by_id(child.parent_id)
                            
                            for responsible in client_object.responsible_list:
                                smsQ  = SmsQ()
                                smsQ.kid_name = child.name
                                smsQ.parent_id = child.parent_id
                                smsQ.sms_type = '_InPlace'
                                smsQ.send_date = datetime.datetime.today()                            
                                smsQ.send_date_request = datetime.datetime.today()
                                smsQ.responsible_name = responsible.name
                                smsQ.responsible_relation = responsible.relation
                                smsQ.responsible_phone = responsible.phone
                                smsQ.put();
                                self.response.write('<br/>Do work')
        

                    k.cron_flag = False;
                    #k.cron_date   = opening_date + timedelta(hours=self._GMT -2)     + timedelta(days=1) 
                    current_date = datetime.datetime.now() + timedelta(hours=self._GMT) 
                
                    k.cron_date   =  datetime.datetime(current_date.year, current_date.month, current_date.day,0,0,0) + timedelta(days=+1) 

                    k.put()


class sms_q(webapp2.RequestHandler):

    def send_sms(self,sms_q):
        ACCOUNT_SID = "ACee3212de166539f38ec6533956597360"
        AUTH_TOKEN = "74f1e17261ece29f7b311f12af1b1888"
        delay = 5
        client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN)
        self.response.write('<br/> sms_q Start ' )

        rv = client.messages.create(to="+972" + str(sms_q.responsible_phone) , from_="+972526269220", body= str(sms_q.title)  +   '\n' +  str(sms_q.msg))


    def get(self): 
        delay = 5

        self.response.write('<br/>sms_q Start ' )

        SmsQ_list = SmsQ.query(SmsQ.is_send == False, SmsQ.sms_type=='_Missing').fetch()

        for smsQ in SmsQ_list:
            msg = "הילד " + smsQ.kid_name +   " טרם הגיע לגן " + " אנא בדיקו בדחיפות "
            smsQ.is_send = True;
            smsQ.title = '\nwatch-kid\n'
            smsQ.msg = msg
            smsQ.send_date = datetime.datetime.today()
            smsQ.put()
            self.send_sms(smsQ)
            sleep(delay) 

        SmsQ_list = SmsQ.query(SmsQ.is_send == False, SmsQ.sms_type=='_InPlace').fetch()

        for smsQ in SmsQ_list:
            msg = "הילד " + smsQ.kid_name +   " טרם עזב את הגן"
            smsQ.is_send = True;
            smsQ.title = '\nwatch-kid\n'
            smsQ.msg = msg
            smsQ.send_date = datetime.datetime.today()
            smsQ.put()
            self.send_sms(smsQ)            
            sleep(delay) 

        SmsQ_list = SmsQ.query(SmsQ.is_send == False, SmsQ.sms_type=='_Arrived').fetch()

        for smsQ in SmsQ_list:
            msg = "הילד " + smsQ.kid_name +   "  הגיע לגן " 
            smsQ.is_send = True;
            smsQ.title = '\nwatch-kid\n'
            smsQ.msg = msg
            smsQ.send_date = datetime.datetime.today()
            smsQ.put()
            self.send_sms(smsQ)
            sleep(delay) 

        SmsQ_list = SmsQ.query(SmsQ.is_send == False, SmsQ.sms_type=='_Left').fetch()

        for smsQ in SmsQ_list:
            msg = "הילד " + smsQ.kid_name +   "  עזב  את הגן " 

            smsQ.is_send = True;
            smsQ.title = '\nwatch-kid\n'
            smsQ.msg = msg
            smsQ.send_date = datetime.datetime.today()
            smsQ.put()
            self.send_sms(smsQ)
            sleep(delay) 

        self.response.write('<br/>sms_q  Done' )


application = webapp2.WSGIApplication([
    ('/task/main_task_handler', main_task_handler)
    ,('/task/sms_q', sms_q)
    ,('/task/Test', Test)
    ,('/task/holiday_task_handler', holiday_task_handler)    
    ,('/task/Aviv/([^/]+)?', Aviv)         
  
    
], debug=True)


def main():
    application.RUN()


if __name__ == '__main__':
    main()
