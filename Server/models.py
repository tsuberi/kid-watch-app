from google.appengine.ext import ndb
from endpoints_proto_datastore.ndb import EndpointsModel
from endpoints_proto_datastore.ndb import EndpointsDateTimeProperty
from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.ext import blobstore
from protorpc import messages
from protorpc import message_types
from protorpc import remote
from endpoints_proto_datastore.ndb import EndpointsAliasProperty
import uuid
import datetime




class Location(EndpointsModel):
	country = ndb.StringProperty()
	city = ndb.StringProperty()
	address = ndb.StringProperty()


class AuthData(EndpointsModel):
	email = ndb.StringProperty()
	name = ndb.StringProperty()
	given_name  = ndb.StringProperty()
	family_name = ndb.StringProperty()
	picture = ndb.StringProperty()
	gender = ndb.StringProperty()
	locale = ndb.StringProperty()
	clientID = ndb.StringProperty()
	user_id = ndb.StringProperty()
	nickname = ndb.StringProperty()
	provider = ndb.StringProperty()
	token   = ndb.StringProperty()
	global_client_id    =   ndb.StringProperty()


class Employee(EndpointsModel):
	location = ndb.StructuredProperty(Location,repeated=False)
	name = ndb.StringProperty()
	position = ndb.StringProperty()
	cell_phone = ndb.StringProperty()
	email = ndb.StringProperty()
	image = ndb.StringProperty()
	#birth_day = ndb.DateTimeProperty()
	experience = ndb.StringProperty()


class User(EndpointsModel):
	auth = ndb.StructuredProperty(AuthData,repeated=False)
	name = ndb.StringProperty()
	password = ndb.StringProperty()



class Responsible(EndpointsModel):
	name = ndb.StringProperty()
	relation = ndb.StringProperty()
	phone = ndb.StringProperty()


class Payment(EndpointsModel):
	start_date = ndb.DateTimeProperty()
	end_date  = ndb.DateTimeProperty()
	pay_date = ndb.DateTimeProperty()



class Holiday(EndpointsModel):
	holiday_start_dete = ndb.DateTimeProperty()	
	holiday_end_dete  = ndb.DateTimeProperty()	
	holiday_title = ndb.StringProperty()
	holiday_reason = ndb.StringProperty()
	is_active = ndb.BooleanProperty(default=False)




class SmsQ(EndpointsModel):
	is_send = ndb.BooleanProperty(default=False)
	use_loop = ndb.BooleanProperty(default=False)
	sms_type =  ndb.StringProperty()
	need_replay = ndb.BooleanProperty(default=False)	
	send_date = ndb.DateTimeProperty()
	send_date_request = ndb.DateTimeProperty()
	parent_id =  ndb.StringProperty()
	kid_name =  ndb.StringProperty()
	responsible_name = ndb.StringProperty()
	responsible_relation = ndb.StringProperty()
	responsible_phone = ndb.StringProperty()




class Schedule(EndpointsModel):
	sunday = ndb.BooleanProperty(default=True)
	monday = ndb.BooleanProperty(default=True)
	tuesday = ndb.BooleanProperty(default=True)
	wednesday = ndb.BooleanProperty(default=True)
	thursday = ndb.BooleanProperty(default=True)
	friday = ndb.BooleanProperty(default=False)
	saturday = ndb.BooleanProperty(default=False)	 

	sunday_opeing_time  = ndb.StringProperty(default='08:00')
	monday_opeing_time  = ndb.StringProperty(default='08:00')
	tuesday_opeing_time  = ndb.StringProperty(default='08:00')
	wednesday_opeing_time  = ndb.StringProperty(default='08:00')
	thursday_opeing_time  = ndb.StringProperty(default='08:00')
	friday_opeing_time  = ndb.StringProperty(default='08:00')
	saturday_opeing_time  = ndb.StringProperty(default='08:00')
	sunday_closing_time  = ndb.StringProperty(default='16:00')
	monday_closing_time  = ndb.StringProperty(default='16:00')
	tuesday_closing_time  = ndb.StringProperty(default='16:00')
	wednesday_closing_time  = ndb.StringProperty(default='16:00')
	thursday_closing_time  = ndb.StringProperty(default='16:00')
	friday_closing_time  = ndb.StringProperty(default='16:00')
	saturday_closing_time  = ndb.StringProperty(default='16:00')


	

class Child(EndpointsModel):		
	kindergarten_id = ndb.StringProperty()
	kindergarten_key =  ndb.KeyProperty(kind='Kindergarten')
	holyday_key =  ndb.KeyProperty(kind='Holiday')
	schedule =  ndb.KeyProperty(kind='schedule')
	payment =  ndb.KeyProperty(kind='Payment')
	name = ndb.StringProperty()
	picture = ndb.StringProperty()
	birth_day = ndb.DateTimeProperty()
	gender = ndb.StringProperty()
	parent_id =  ndb.StringProperty()
	in_date = ndb.StringProperty()
	out_date =ndb.StringProperty()
	client_email =ndb.StringProperty()
	
	

class Kindergarten(EndpointsModel):	
	auth = ndb.StructuredProperty(AuthData,repeated=False)
	location = ndb.StructuredProperty(Location,repeated=False)
	opening_hour = ndb.IntegerProperty()
	opening_minutes = ndb.IntegerProperty()
	closing_hour = ndb.IntegerProperty()
	closing_minutes = ndb.IntegerProperty()
	is_working_on_friday = ndb.BooleanProperty()
	working_on_saturday = ndb.BooleanProperty(default=False)
	working_on_sunday = ndb.BooleanProperty(default=False)
	cron_flag = ndb.BooleanProperty(default=False)
	cron_date = ndb.DateTimeProperty()	
	employee_list = ndb.StructuredProperty(Employee,repeated=True)
	child_list = ndb.StructuredProperty(Child,repeated=True)
	register_date =  ndb.DateTimeProperty(auto_now_add=True)
	name = ndb.StringProperty()
	email = ndb.StringProperty()
	phone = ndb.StringProperty()
	cell_phone = ndb.StringProperty()
	contact_name = ndb.StringProperty()
	facebook = ndb.StringProperty()
	description = ndb.StringProperty()	
	kindergarten_id = ndb.StringProperty()
	holiday = ndb.StructuredProperty(Holiday,repeated=False)
	schedule = ndb.StructuredProperty(Schedule,repeated=False)

	
	
	
	_message_fields_schema = (                             
                              'auth'
                              ,'opening_hour'
                              ,'location'
                              ,'opening_hour'
                              ,'opening_minutes'                         
                              ,'closing_hour'
                              ,'closing_minutes' 
                              ,'is_working_on_friday' 
                              ,'working_on_saturday' 
                              ,'working_on_sunday' 
                              ,'employee_list'
                              ,'child_list'
                              ,'name' 
                              ,'email'
                              ,'phone' 
                              ,'cell_phone' 
                              ,'contact_name' 
                              ,'contact_name' 
                              ,'facebook' 
                              ,'description' 
                              ,'holiday'
                              ,'schedule'                         
                              ,'kindergarten_id'

                              )


class Client(EndpointsModel):
	auth = ndb.StructuredProperty(AuthData,repeated=False)
	email = ndb.StringProperty()
	child_list = ndb.StructuredProperty(Child,repeated=True)
	responsible_list = ndb.StructuredProperty(Responsible,repeated=True)
	password = ndb.StringProperty()	
	
	
