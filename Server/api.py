import endpoints
from protorpc import remote
from google.appengine.ext import ndb
import uuid
import os
import json
import logging
import sys
import re
import datetime

from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.ext import blobstore

from models import User
from models import Child
from models import Client
from models import Kindergarten
from models import Payment
from models import Holiday
from models import Schedule
from models import SmsQ


@endpoints.api( name='watch_kid_server', version='v1', description='Watch Kid Api.' )
class WatchKidServer(remote.Service):

	@User.method(path='user', 
			http_method='POST', 
			name='user.update')
	def update_user(self, user):
		user.key = ndb.Key(User, user.auth.email)
		user.put()
		return user

	@Child.method(path='child', 
			http_method='POST', 
			name='child.insert')
	def insert_child(self, child):
		child.userKey = ndb.Key(User, child.auth.email)
		child.put()
		return child



	@Client.query_method(query_fields=('email','limit', 'order', 'pageToken') , path='client', name='client.list')
  	def get_clients(self, query):
  		return query



	


	@Client.method(path='client', 
			http_method='POST', 
			name='client.update')
	def update_client(self, client):
		count = 0
		newClient = False

		clientObj = Client.get_by_id(client.auth.email) 

		if (  clientObj is None ):
			newClient = True
			for c in client.child_list:
				d = datetime.datetime.now()
				next_month = datetime.datetime(d.year, d.month+1, 1)
				next_month_string =  next_month.isoformat() + '.0000'
				pay = Payment()
				pay.start_date = datetime.datetime.strptime(next_month_string, "%Y-%m-%dT%H:%M:%S.%f")
				pay.end_date = datetime.datetime.strptime(next_month_string, "%Y-%m-%dT%H:%M:%S.%f")
				pay.pay_date = datetime.datetime.strptime(next_month_string, "%Y-%m-%dT%H:%M:%S.%f")
				c.payment = pay.put()
				

		client.key = ndb.Key(Client, client.auth.email)	
		client.email = client.auth.email

		for c in client.child_list:			
		 	KindergartenKey =  ndb.Key(Kindergarten, c.kindergarten_id)
		 	c.kindergarten_key = KindergartenKey
		 	c.parent_id = client.email 
		 	#c.put()
		 	kindergarten = Kindergarten.get_by_id(c.kindergarten_id)
		 	for kc in kindergarten.child_list:
		 	 	if ( client.email  == kc.parent_id ):
		 	 		kindergarten.child_list.remove(kc)


		client.put()



		for c in client.child_list:
			count = count +1			
			kindergarten = Kindergarten.get_by_id(c.kindergarten_id)
			# c.client_email =  client.auth.email
			# c.put()

			kindergarten.child_list.append(c)

			if ( count == len( client.child_list) ):				
				kindergarten.put()



		return client


	@Kindergarten.method(path='kindergarten', 
				http_method='POST', 
				name='kindergarten.update')
	def update_kindergarten(self, kindergarten):
		kindergarten.key = ndb.Key(Kindergarten, kindergarten.auth.email)
		kindergarten.kindergarten_id  =  kindergarten.auth.email	

		kindergarten.put()
		return kindergarten

	@SmsQ.method(path='smsq', 
				http_method='POST', 
				name='smsq.update')
	def update_sms_q(self, sms_q):		
		sms_q.put()
		return sms_q

	@SmsQ.query_method(query_fields=('parent_id','sms_type','send_date','limit', 'order', 'pageToken') , path='sms_q', name='smsq.list')
  	def get_smsq(self, query):
  		return query


	@Kindergarten.query_method(query_fields=('kindergarten_id','limit', 'order', 'pageToken') , path='kindergarten', name='kindergarten.list')
  	def get_kindergartens(self, query):
  		return query
  
api = endpoints.api_server([WatchKidServer],restricted=False)

