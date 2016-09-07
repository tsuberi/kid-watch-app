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


class Test(webapp2.RequestHandler):
    def get(self):
        self.response.write('<br/>Test')

class main_task_handler(webapp2.RequestHandler):
    _GMT = 3
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

        
    def get(self):


        today =  datetime.datetime.now() + timedelta(hours=self._GMT)        
        weekday = datetime.datetime.today().toordinal()%7 + 1
        Kindergarten_list = Kindergarten.query( Kindergarten.cron_flag == False , Kindergarten.cron_date < today ).fetch()
        self.response.write('<br/>Opening  Step 1')
        self.response.write('<br/>len today   {} .'. format(today))


        self.response.write('<br/>part 1 len Kindergarten_list   {} .'. format(len(Kindergarten_list)))


        for k in Kindergarten_list:
            if ( self.get_opening_time(weekday,k)[0] == True ):
                current_date = datetime.datetime.now() + timedelta(hours=self._GMT)        
                opening_date = datetime.datetime(current_date.year, current_date.month, current_date.day, int( self.get_opening_time(weekday,k)[1] .split(':')[0]) , int( self.get_opening_time(weekday,k)[1] .split(':')[1]))
                closing_date = datetime.datetime(current_date.year, current_date.month, current_date.day, int( self.get_opening_time(weekday,k)[2] .split(':')[0]) , int( self.get_opening_time(weekday,k)[2] .split(':')[1]))

                #self.response.write('<br/>Step 1')

                if ( current_date >  opening_date ) and ( current_date <  closing_date ) :
                    #self.response.write('<br/>Step 2')

                    for child in k.child_list:

                        child_in_date  = datetime.datetime.strptime(child.in_date, "%Y-%m-%dT%H:%M:%S.%f")
                        child_list = Child.query( Child.parent_id  ==   child.parent_id ).fetch()

                        if ( child_in_date <  current_date):
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





        #Kindergarten_list = Kindergarten.query( Kindergarten.cron_flag == True , Kindergarten.cron_date < today ).fetch()
        Kindergarten_list = Kindergarten.query( Kindergarten.cron_flag == True  , Kindergarten.cron_date < today).fetch()


        self.response.write('<br/>part 2 len Kindergarten_list   {} .'. format(len(Kindergarten_list)))
     

        for k in Kindergarten_list:
            if ( self.get_opening_time(weekday,k)[0] == True ):
                current_date = datetime.datetime.now() + timedelta(hours=self._GMT)        
                closing_date = datetime.datetime(current_date.year, current_date.month, current_date.day, int( self.get_opening_time(weekday,k)[2] .split(':')[0]) , int( self.get_opening_time(weekday,k)[2] .split(':')[1]))
                opening_date = datetime.datetime(current_date.year, current_date.month, current_date.day, int( self.get_opening_time(weekday,k)[1] .split(':')[0]) , int( self.get_opening_time(weekday,k)[1] .split(':')[1]))

                
                # self.response.write('<br/>Step 1')

                if  ( current_date <  closing_date ) :
               
                    for child in k.child_list:

                        child_in_date  = datetime.datetime.strptime(child.in_date, "%Y-%m-%dT%H:%M:%S.%f")
                        child_list = Child.query( Child.parent_id  ==   child.parent_id ).fetch()

                        if ( child_in_date <  current_date):
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
        
                          
                #self.response.write('<br/>Kindergarten.cron_date  {} .'. format(k.cron_date ))


                k.cron_flag = False;
                k.cron_date   = opening_date + timedelta(hours=self._GMT -2)     + timedelta(days=1) 
                k.put()




                


class sms_q(webapp2.RequestHandler):
    def get(self):
        ACCOUNT_SID = "ACee3212de166539f38ec6533956597360"
        AUTH_TOKEN = "74f1e17261ece29f7b311f12af1b1888"
        delay = 5

        self.response.write('<br/>sms_q Start ' )

        client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN)

        SmsQ_list = SmsQ.query(SmsQ.is_send == False, SmsQ.sms_type=='_Missing').fetch()

        for smsQ in SmsQ_list:
            msg = "הילד " + smsQ.kid_name +   " טרם הגיע לגן " + " אנא בדיקו בדחיפות "
            smsQ.is_send = True;
            smsQ.send_date = datetime.datetime.today()
            smsQ.put()
            rv = client.messages.create(to="+972" + smsQ.responsible_phone, from_="+972526269220", body=msg)
            self.response.write('<br/>_Missing Done ' )
            sleep(delay) 

        SmsQ_list = SmsQ.query(SmsQ.is_send == False, SmsQ.sms_type=='_InPlace').fetch()

        for smsQ in SmsQ_list:
            msg = "הילד " + smsQ.kid_name +   " טרם הגיע לגן " + " אנא בדיקו בדחיפות "
            smsQ.is_send = True;
            smsQ.send_date = datetime.datetime.today()
            smsQ.put()
            rv = client.messages.create(to="+972" + smsQ.responsible_phone, from_="+972526269220", body=msg)
            self.response.write('<br/>_InPlace Done ' )
            sleep(delay) 

        SmsQ_list = SmsQ.query(SmsQ.is_send == False, SmsQ.sms_type=='_Arrived').fetch()

        for smsQ in SmsQ_list:
            msg = "הילד " + smsQ.kid_name +   " טרם הגיע לגן " + " אנא בדיקו בדחיפות "
            smsQ.is_send = True;
            smsQ.send_date = datetime.datetime.today()
            smsQ.put()
            rv = client.messages.create(to="+972" + smsQ.responsible_phone, from_="+972526269220", body=msg)
            self.response.write('<br/>_Arrived Done ' )
            sleep(delay) 

        SmsQ_list = SmsQ.query(SmsQ.is_send == False, SmsQ.sms_type=='_Left').fetch()

        for smsQ in SmsQ_list:
            msg = "הילד " + smsQ.kid_name +   " טרם הגיע לגן " + " אנא בדיקו בדחיפות "
            smsQ.is_send = True;
            smsQ.send_date = datetime.datetime.today()
            smsQ.put()
            rv = client.messages.create(to="+972" + smsQ.responsible_phone, from_="+972526269220", body=msg)
            self.response.write('<br/>_Left Done ' )
            sleep(delay) 

        self.response.write('<br/>sms_q  Done' )



# class main_task_handler(webapp2.RequestHandler):
#     def SendSms(self, responsible_obj, msg):
#         ACCOUNT_SID = "ACee3212de166539f38ec6533956597360"
#         AUTH_TOKEN = "74f1e17261ece29f7b311f12af1b1888"

#         client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN)
        

#     def get(self):
#         ams = pytz.timezone('Asia/Jerusalem')

#         logging.info('datetime.datetime.now()   = ' +
#                      str(datetime.datetime.now()))

#         d = datetime.datetime.now()
#         d = ams.localize(d)
#         hour = (d.hour + 3) % 24
#         minute = d.minute

#         logging.info('ams.localize(d)  = ' + str(hour))
#         logging.info('hour  = ' + str(hour))
#         logging.info('minute' + str(minute))

#         todaty = datetime.date(d.year, d.month, d.day)


#         Kindergarten_list = Kindergarten.query(Kindergarten.opening_hour <= hour, Kindergarten.cron_flag == False).fetch()

#         for k in Kindergarten_list:
            

#             if  (( ( hour > k.opening_hour   )  and ( hour  <  k.closing_hour   ) )   or ( ( hour == k.opening_hour   )  and ( minute <= k.opening_minutes   )) ) :
                
#                 for child in k.child_list:
                   
#                     in_date = datetime.datetime.strptime(child.in_date, "%Y-%m-%dT%H:%M:%S.%f")
#                     in_date = datetime.date(in_date.year, in_date.month, in_date.day)

#                     self.response.write('<br/>todaty   {} .'. format(todaty))
#                     self.response.write('<br/>in_date   {} .'. format(in_date))


#                     if (todaty >=  in_date):
                       
#                         self.response.write('<br/>OK child_list')
#                         logging.info('child.parent_id  = ' + child.parent_id)
#                         client_object = Client.get_by_id(child.parent_id)
#                         for responsible in client_object.responsible_list:
#                             smsQ  = SmsQ()

#                             smsQ.kid_name = child.name
#                             smsQ.parent_id = child.parent_id
#                             smsQ.sms_type = '_Missing'
#                             smsQ.send_date = datetime.datetime.today()                            
#                             smsQ.send_date_request = datetime.datetime.today()

#                             smsQ.responsible_name = responsible.name
#                             smsQ.responsible_relation = responsible.relation
#                             smsQ.responsible_phone = responsible.phone

#                             smsQ.put();



#                             self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kindergarten name  {} .'.format(k.name))
#                             self.response.write('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kindergarten name  {} .'.format(responsible.name))
                           
#                             msg = "watch-kid.com\n" + " אזהרה " + "\n" + " הילד " + child.name + \
#                                 " לא הגיע לגן " + "  אנא בידקו עם כולם בדחיפות  " + ""
#                             # self.SendSms(responsible, msg)
#                             # child.in_date =   str(datetime.datetime.strptime(d, "%Y-%B-%dT%H:%M:%S-%H:%M").date())
                          

#             k.cron_flag = True
#             k.put()

#         Kindergarten_list = Kindergarten.query(
#             Kindergarten.closing_hour <= hour, Kindergarten.cron_flag == True).fetch()

#         for k in Kindergarten_list:
#             self.response.write('<br/>Kindergarten name  {} .'.format(k.name))
#             self.response.write(
#                 '<br/>Kindergarten Hour  {} .'.format(datetime.time(k.opening_hour, k.opening_minutes)))
#             self.response.write('<br/> step 1  ')

            
            


#             if   (( hour > k.closing_hour   )   or ( ( hour == k.closing_hour    )  and ( minute <= k.closing_minutes   ))) :
#                 for child in k.child_list:
#                      out_date = datetime.datetime.strptime(child.out_date, "%Y-%m-%dT%H:%M:%S.%f")
#                      out_date = datetime.date(out_date.year, out_date.month, out_date.day)
#                      if (todaty >=  out_date):
#                         client_object = Client.get_by_id(child.parent_id)
#                         for responsible in client_object.responsible_list:

#                             smsQ  = SmsQ()

#                             smsQ.kid_name = child.name
#                             smsQ.parent_id = child.parent_id
#                             smsQ.sms_type = '_InPlace'
#                             smsQ.send_date = datetime.datetime.today()                            
#                             smsQ.send_date_request = datetime.datetime.today()

#                             smsQ.responsible_name = responsible.name
#                             smsQ.responsible_relation = responsible.relation
#                             smsQ.responsible_phone = responsible.phone

#                             smsQ.put();


#                             msg = "watch-kid.com\n" + " אזהרה " + "\n" + " הילד " + child.name + \
#                                 " לא עזב את הגן  " + "  אנא בידקו עם כולם בדחיפות  " + ""
#                             # self.SendSms(responsible, msg)
#                             # child.in_date =   str(datetime.datetime.strptime(d, "%Y-%B-%dT%H:%M:%S-%H:%M").date())
                  
#             k.cron_flag = False
#             k.put()

         

#         logging.info('main_task_handler Working')


application = webapp2.WSGIApplication([
    ('/task/main_task_handler', main_task_handler)
    ,('/task/sms_q', sms_q)
    ,('/task/Test', Test)
    
], debug=True)


def main():
    application.RUN()


if __name__ == '__main__':
    main()
